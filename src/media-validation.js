const MAX_MEDIA_BYTES = 5 * 1024 * 1024;
const ALLOWED_MEDIA_MIME = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

function hasSignature(buffer, mimeType) {
  if (mimeType === "image/png") {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  }
  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/webp") {
    return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  }
  if (mimeType === "application/pdf") {
    return buffer.length >= 5 && buffer.toString("ascii", 0, 5) === "%PDF-";
  }
  return false;
}

function validateBase64Media(rawMedia) {
  if (!rawMedia || typeof rawMedia !== "object" || Array.isArray(rawMedia)) {
    return { ok: false, error: "File không hợp lệ. Hãy chọn lại." };
  }
  const { mimeType, data } = rawMedia;
  if (typeof mimeType !== "string" || !ALLOWED_MEDIA_MIME.has(mimeType)) {
    return { ok: false, error: "Chỉ nhận ảnh PNG, JPEG, WEBP hoặc PDF." };
  }
  if (typeof data !== "string" || data.length === 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data)) {
    return { ok: false, error: "File không hợp lệ. Hãy chọn lại." };
  }
  // Reject oversized payloads by base64 length BEFORE allocating the decoded
  // buffer (base64 is ~4/3 of the byte size; small slack for padding).
  if (data.length > Math.ceil(MAX_MEDIA_BYTES * 4 / 3) + 8) {
    return { ok: false, error: "File quá lớn. Hãy chọn file dưới 5MB." };
  }
  const buffer = Buffer.from(data, "base64");
  if (buffer.length === 0 || buffer.length > MAX_MEDIA_BYTES) {
    return { ok: false, error: "File quá lớn. Hãy chọn file dưới 5MB." };
  }
  if (!hasSignature(buffer, mimeType)) {
    return { ok: false, error: "Nội dung file không khớp định dạng đã chọn." };
  }
  return { ok: true, media: { mimeType, data } };
}

module.exports = { MAX_MEDIA_BYTES, ALLOWED_MEDIA_MIME, hasSignature, validateBase64Media };
