const test = require("node:test");
const assert = require("node:assert/strict");
const { lookupReputation, normalizeValue } = require("../src/reputation-engine");

test("unknown entities never receive an invented report count", () => {
  const result = lookupReputation({ entityType: "phone", value: "090 123 4567" });
  assert.equal(result.status, "unknown");
  assert.equal(result.reportCount, null);
  assert.equal(result.isDemoData, false);
  assert.match(result.source, /Chưa kết nối/);
});

test("configured domains are clearly marked as reference demo data", () => {
  const result = lookupReputation({ entityType: "domain", value: "www.sbv.gov.vn" });
  assert.equal(result.status, "configured_official");
  assert.equal(result.normalizedDomain, "sbv.gov.vn");
  assert.equal(result.isDemoData, true);
  assert.match(result.source, /minh họa/);
  assert.equal(result.reportCount, null);
});

test("plain HTTP returns caution without claiming the domain is fraudulent", () => {
  const result = lookupReputation({ entityType: "url", value: "http://example.com/path" });
  assert.equal(result.status, "caution");
  assert.equal(result.reportCount, null);
  assert.match(result.moderationNote, /không chứng minh/);
});

test("invalid entity types and values are rejected", () => {
  assert.throws(() => lookupReputation({ entityType: "email", value: "a@example.com" }), /không hợp lệ/);
  assert.throws(() => lookupReputation({ entityType: "phone", value: "123" }), /định dạng/);
  assert.throws(() => lookupReputation({ entityType: "ip", value: "999.2.3.4" }), /định dạng/);
});

test("phone and bank account values are normalized conservatively", () => {
  assert.equal(normalizeValue("phone", " +84 (90) 123-4567 "), "+84901234567");
  assert.equal(normalizeValue("bank_account", " 1234 5678-AB "), "12345678-AB");
});
