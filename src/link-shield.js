const dns = require("node:dns/promises");
const http = require("node:http");
const https = require("node:https");
const { classifyScore } = require("./rule-engine");

const KNOWN_BRAND_DOMAINS = [
  { keyword: "vietcombank", domain: "vietcombank.com.vn" },
  { keyword: "vcb", domain: "vietcombank.com.vn" },
  { keyword: "techcombank", domain: "techcombank.com.vn" },
  { keyword: "bidv", domain: "bidv.com.vn" },
  { keyword: "agribank", domain: "agribank.com.vn" },
  { keyword: "vietinbank", domain: "vietinbank.vn" },
  { keyword: "acb", domain: "acb.com.vn" },
  { keyword: "sacombank", domain: "sacombank.com.vn" },
  { keyword: "mbbank", domain: "mbbank.com.vn" },
  { keyword: "tpbank", domain: "tpbank.vn" },
  { keyword: "vpbank", domain: "vpbank.com.vn" },
  { keyword: "cong an", domain: "bocongan.gov.vn" },
  { keyword: "dich vu cong", domain: "dichvucong.gov.vn" },
  { keyword: "bao hiem xa hoi", domain: "baohiemxahoi.gov.vn" },
  { keyword: "bhxh", domain: "baohiemxahoi.gov.vn" },
  { keyword: "vneid", domain: "vneid.gov.vn" }
];

const SUSPICIOUS_TLDS = [".xyz", ".top", ".club", ".support", ".click", ".work", ".online", ".site", ".live", ".buzz", ".info"];

const DEFAULT_LINK_CITATION =
  "Ngân hàng và cơ quan nhà nước chỉ dùng đúng một tên miền chính thức — hãy tự gõ địa chỉ quen thuộc thay vì bấm vào link hoặc quét mã QR nhận được.";

class LinkCheckError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.name = "LinkCheckError";
    this.status = status;
  }
}

function stripDiacritics(value) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function normalizeText(value) {
  return stripDiacritics(String(value || "").toLowerCase()).trim();
}

function findKnownBrand(claimedBrand) {
  const normalized = normalizeText(claimedBrand);
  if (!normalized) return null;
  return KNOWN_BRAND_DOMAINS.find((entry) => normalized.includes(entry.keyword)) || null;
}

function domainMatches(domain, officialDomain) {
  const normalizedDomain = String(domain || "").toLowerCase();
  return normalizedDomain === officialDomain || normalizedDomain.endsWith(`.${officialDomain}`);
}

function evaluateLinkRisk({ redirectChain, claimedBrand }) {
  const chain = Array.isArray(redirectChain) ? redirectChain.filter(Boolean) : [];
  const originalDomain = chain[0] || null;
  const finalDomain = chain.length > 0 ? chain[chain.length - 1] : null;

  const reasons = [];
  const actions = [];
  const citations = [DEFAULT_LINK_CITATION];
  let score = 0;

  if (chain.length > 1 && originalDomain !== finalDomain) {
    score += 1;
    reasons.push(`Link đã chuyển hướng từ ${originalDomain} sang ${finalDomain}.`);
  }

  const brand = findKnownBrand(claimedBrand);
  if (brand && finalDomain) {
    if (domainMatches(finalDomain, brand.domain)) {
      reasons.push(`Domain cuối cùng khớp với domain chính thức (${brand.domain}).`);
    } else {
      score += 3;
      reasons.push(`Domain cuối cùng không khớp với domain chính thức của thương hiệu tự xưng (${brand.domain}).`);
      actions.push("Không bấm vào link này, không đăng nhập hay nhập mã OTP.");
      actions.push(`Tự gõ địa chỉ chính thức ${brand.domain} nếu cần truy cập.`);

      if (normalizeText(finalDomain).includes(brand.keyword)) {
        score += 3;
        reasons.push("Domain cuối cùng chứa tên thương hiệu thật nhưng thêm hậu tố lạ — dấu hiệu domain giả gần giống.");
      }
    }
  }

  if (finalDomain && SUSPICIOUS_TLDS.some((tld) => finalDomain.toLowerCase().endsWith(tld))) {
    score += 1;
    reasons.push("Đuôi tên miền thuộc nhóm hay bị lợi dụng để lừa đảo.");
  }

  if (reasons.length === 0) {
    reasons.push("Chưa thấy dấu hiệu bất thường rõ ràng trong chuỗi chuyển hướng hoặc tên miền.");
  }
  if (actions.length === 0) {
    actions.push("Vẫn nên tự gõ địa chỉ quen thuộc thay vì bấm vào link, nếu còn nghi ngờ.");
  }

  return {
    muc_rui_ro: classifyScore(score),
    chuoi_chuyen_huong: chain,
    ten_mien_cuoi: finalDomain,
    ly_do: reasons.slice(0, 3),
    hanh_dong: actions.slice(0, 3),
    trich_dan: [...new Set(citations)],
    diem: score
  };
}

function isPrivateIpv4(address) {
  const parts = String(address).split(".").map(Number);
  // Malformed IPv4 → fail closed (treat as unsafe).
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return true;
  }
  const [a, b] = parts;
  if (a === 0) return true;                       // "this" network
  if (a === 10) return true;                      // RFC1918
  if (a === 127) return true;                     // loopback
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64.0.0/10
  if (a === 169 && b === 254) return true;        // link-local (cloud metadata)
  if (a === 172 && b >= 16 && b <= 31) return true; // RFC1918
  if (a === 192 && b === 168) return true;        // RFC1918
  if (a >= 224) return true;                      // multicast / reserved / broadcast
  return false;
}

function isPrivateOrReservedIp(address, family) {
  const value = String(address || "").toLowerCase().trim();

  if (family === 6) {
    // IPv4-mapped / -compatible IPv6 in dotted form: ::ffff:169.254.169.254
    const dottedMapped = value.match(/^::(?:ffff:)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
    if (dottedMapped) return isPrivateIpv4(dottedMapped[1]);

    // IPv4-mapped IPv6 in hex form: ::ffff:a00:1  → 10.0.0.1
    const hexMapped = value.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
    if (hexMapped) {
      const hi = parseInt(hexMapped[1], 16);
      const lo = parseInt(hexMapped[2], 16);
      const ipv4 = `${(hi >> 8) & 255}.${hi & 255}.${(lo >> 8) & 255}.${lo & 255}`;
      return isPrivateIpv4(ipv4);
    }

    if (value === "::" || value === "::1") return true;         // unspecified / loopback
    if (/^(0+:){7}0*1$/.test(value)) return true;               // expanded loopback
    if (value.startsWith("fe80")) return true;                  // link-local fe80::/10
    if (value.startsWith("fc") || value.startsWith("fd")) return true; // unique-local fc00::/7
    if (value.startsWith("ff")) return true;                    // multicast ff00::/8
    if (value.startsWith("64:ff9b")) return true;               // NAT64 well-known prefix
    return false;
  }

  return isPrivateIpv4(value);
}

// DNS pinning: connect only to an address we already validated, so a rebinding
// answer that flips between the check and the fetch cannot redirect us inward.
function pinnedLookup(addresses) {
  return (_hostname, lookupOptions, callback) => {
    if (lookupOptions && lookupOptions.all) {
      return callback(null, addresses.map((entry) => ({ address: entry.address, family: entry.family })));
    }
    return callback(null, addresses[0].address, addresses[0].family);
  };
}

function defaultHeadFetch(urlString, { pinnedAddresses } = {}) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let url;
    try {
      url = new URL(urlString);
    } catch {
      reject(new Error("invalid url"));
      return;
    }
    const lib = url.protocol === "https:" ? https : http;
    const requestOptions = { method: "HEAD" };
    if (pinnedAddresses && pinnedAddresses.length > 0) {
      requestOptions.lookup = pinnedLookup(pinnedAddresses);
    }

    const finish = (fn) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn();
    };

    const req = lib.request(urlString, requestOptions, (res) => {
      res.resume(); // discard the (HEAD) body; never expose it to the caller
      const headers = {
        get(name) {
          const value = res.headers[name.toLowerCase()];
          return Array.isArray(value) ? value[0] : (value ?? null);
        }
      };
      finish(() => resolve({ status: res.statusCode, headers }));
    });

    const timer = setTimeout(() => {
      finish(() => reject(new Error("timeout")));
      req.destroy();
    }, 6000);

    req.on("error", (error) => finish(() => reject(error)));
    req.end();
  });
}

async function assertPublicHostname(hostname, dnsLookup) {
  let addresses;
  try {
    addresses = await dnsLookup(hostname, { all: true });
  } catch {
    throw new LinkCheckError("Không thể tra cứu địa chỉ của tên miền này.", 400);
  }

  if (addresses.length === 0 || addresses.some((entry) => isPrivateOrReservedIp(entry.address, entry.family))) {
    throw new LinkCheckError("Địa chỉ này trỏ tới một mạng nội bộ, không được phép kiểm tra.", 400);
  }

  return addresses;
}

async function resolveRedirectChain(inputUrl, options = {}) {
  const fetchImpl = options.fetchImpl || defaultHeadFetch;
  const dnsLookup = options.dnsLookup || dns.lookup;
  const maxHops = options.maxHops || 5;

  let current;
  try {
    current = new URL(inputUrl);
  } catch {
    throw new LinkCheckError("Đường link không hợp lệ.", 400);
  }

  const chain = [];
  for (let hop = 0; hop <= maxHops; hop += 1) {
    if (current.protocol !== "http:" && current.protocol !== "https:") {
      throw new LinkCheckError("Chỉ kiểm tra được link http hoặc https.", 400);
    }

    const validatedAddresses = await assertPublicHostname(current.hostname, dnsLookup);
    chain.push(current.hostname);

    let response;
    try {
      response = await fetchImpl(current.toString(), {
        method: "HEAD",
        redirect: "manual",
        pinnedAddresses: validatedAddresses
      });
    } catch {
      throw new LinkCheckError("Không thể kết nối tới link này. Có thể link đã hỏng hoặc bị chặn.", 502);
    }

    const isRedirect = response.status >= 300 && response.status < 400;
    const location = response.headers.get("location");
    if (!isRedirect || !location) break;

    try {
      current = new URL(location, current);
    } catch {
      break;
    }

    if (hop === maxHops) {
      throw new LinkCheckError("Link chuyển hướng quá nhiều lần, không thể theo dõi hết.", 502);
    }
  }

  return chain;
}

module.exports = {
  LinkCheckError,
  evaluateLinkRisk,
  resolveRedirectChain,
  isPrivateOrReservedIp,
  defaultHeadFetch,
  KNOWN_BRAND_DOMAINS
};
