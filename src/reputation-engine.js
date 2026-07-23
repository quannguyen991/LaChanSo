const crypto = require("node:crypto");

const ENTITY_TYPES = ["phone", "bank_account", "url", "domain", "ip"];
const MAX_VALUE_LENGTH = 2048;

// This provider intentionally never invents report history. Replace it with a
// verified directory provider when a real source and update process exist.
const CONFIGURED_OFFICIAL_DOMAINS = new Set([
  "chinhphu.vn",
  "mps.gov.vn",
  "sbv.gov.vn",
  "vcb.com.vn"
]);

function normalizeEntityType(value) {
  return ENTITY_TYPES.includes(value) ? value : null;
}

function normalizeValue(type, value) {
  if (typeof value !== "string") return "";
  const normalized = value.trim().slice(0, MAX_VALUE_LENGTH);
  if (type === "phone") return normalized.replace(/[^+\d]/g, "");
  if (type === "bank_account") return normalized.replace(/[^\dA-Za-z-]/g, "");
  return normalized;
}

function isIpv4(value) {
  const parts = value.split(".");
  return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

function isIpv6(value) {
  return value.includes(":") && /^[0-9a-f:]+$/i.test(value);
}

function hashForAudit(value) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 12);
}

function unknownResult(entityType, value, note = "Chưa có dữ liệu xác minh cho thông tin này.") {
  return {
    entityType,
    value,
    status: "unknown",
    reportCount: null,
    source: "Chưa kết nối nguồn dữ liệu xác minh",
    updatedAt: null,
    confidence: "thấp",
    moderationNote: note,
    isDemoData: false,
    checkedValueHash: hashForAudit(value)
  };
}

function lookupReputation(input) {
  const entityType = normalizeEntityType(input?.entityType);
  if (!entityType) throw new Error("Loại thông tin cần kiểm tra không hợp lệ.");
  const value = normalizeValue(entityType, input?.value);
  if (!value) throw new Error("Hãy nhập thông tin cần kiểm tra.");

  if (entityType === "phone" && !/^\+?[\d]{8,15}$/.test(value)) {
    throw new Error("Số điện thoại chưa đúng định dạng.");
  }
  if (entityType === "bank_account" && !/^[\dA-Za-z-]{5,34}$/.test(value)) {
    throw new Error("Số tài khoản chưa đúng định dạng.");
  }
  if (entityType === "ip" && !isIpv4(value) && !isIpv6(value)) {
    throw new Error("Địa chỉ IP chưa đúng định dạng.");
  }

  if (entityType === "domain" || entityType === "url") {
    const candidate = entityType === "url" ? value : `https://${value}`;
    let url;
    try { url = new URL(candidate); } catch { throw new Error("Đường link hoặc tên miền chưa đúng định dạng."); }
    const domain = url.hostname.toLowerCase().replace(/^www\./, "");
    if (entityType === "url" && url.protocol !== "https:") {
      return {
        ...unknownResult(entityType, value, "Link không dùng HTTPS; HTTPS chỉ mã hóa đường truyền, không chứng minh website là chính thức."),
        normalizedDomain: domain,
        status: "caution",
        confidence: "trung bình"
      };
    }
    if (CONFIGURED_OFFICIAL_DOMAINS.has(domain)) {
      return {
        ...unknownResult(entityType, value, "Tên miền khớp danh sách cấu hình tham khảo; bác vẫn nên tự mở website chính thức và kiểm tra ngữ cảnh."),
        normalizedDomain: domain,
        status: "configured_official",
        source: "Danh sách tên miền cấu hình tham khảo (dữ liệu minh họa)",
        confidence: "trung bình",
        isDemoData: true
      };
    }
    return { ...unknownResult(entityType, value), normalizedDomain: domain };
  }

  return unknownResult(entityType, value);
}

module.exports = {
  ENTITY_TYPES,
  CONFIGURED_OFFICIAL_DOMAINS,
  normalizeEntityType,
  normalizeValue,
  lookupReputation
};
