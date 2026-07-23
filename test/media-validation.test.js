const test = require("node:test");
const assert = require("node:assert/strict");
const { hasSignature, validateBase64Media } = require("../src/media-validation");

test("accepts known PNG, JPEG, WEBP and PDF signatures", () => {
  assert.equal(hasSignature(Buffer.from("89504e470d0a1a0a", "hex"), "image/png"), true);
  assert.equal(hasSignature(Buffer.from("ffd8ffe0", "hex"), "image/jpeg"), true);
  assert.equal(hasSignature(Buffer.from("524946460000000057454250", "hex"), "image/webp"), true);
  assert.equal(hasSignature(Buffer.from("%PDF-1.7"), "application/pdf"), true);
});

test("rejects a declared MIME type that does not match file bytes", () => {
  const data = Buffer.from("%PDF-1.7").toString("base64");
  const result = validateBase64Media({ mimeType: "image/png", data });
  assert.equal(result.ok, false);
  assert.match(result.error, /không khớp/);
});

test("rejects unsupported MIME and malformed base64", () => {
  assert.equal(validateBase64Media({ mimeType: "image/svg+xml", data: "PHN2Zz4=" }).ok, false);
  assert.equal(validateBase64Media({ mimeType: "image/png", data: "not base64!" }).ok, false);
});
