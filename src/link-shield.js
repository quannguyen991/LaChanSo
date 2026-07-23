const dns = require("node:dns/promises");
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

function isPrivateOrReservedIp(address, family) {
  if (family === 6) {
    const normalized = address.toLowerCase();
    return (
      normalized === "::1" ||
      normalized.startsWith("fe80:") ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("::ffff:127.") ||
      normalized === "::"
    );
  }

  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return true;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 0) return true;
  return false;
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
}

async function resolveRedirectChain(inputUrl, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
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

    await assertPublicHostname(current.hostname, dnsLookup);
    chain.push(current.hostname);

    let response;
    try {
      response = await fetchImpl(current.toString(), {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(6000)
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
  KNOWN_BRAND_DOMAINS
};
