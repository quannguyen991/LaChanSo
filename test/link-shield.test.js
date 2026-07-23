const test = require("node:test");
const assert = require("node:assert/strict");
const {
  evaluateLinkRisk,
  resolveRedirectChain,
  isPrivateOrReservedIp,
  LinkCheckError
} = require("../src/link-shield");

test("a link with no claimed brand and no redirect stays low risk", () => {
  const result = evaluateLinkRisk({ redirectChain: ["example.com"], claimedBrand: "" });
  assert.equal(result.muc_rui_ro, "Chưa thấy dấu hiệu rủi ro");
  assert.equal(result.ten_mien_cuoi, "example.com");
});

test("a final domain matching the claimed brand's official domain stays low risk", () => {
  const result = evaluateLinkRisk({
    redirectChain: ["bit.ly", "vietcombank.com.vn"],
    claimedBrand: "Vietcombank"
  });
  assert.equal(result.muc_rui_ro, "Chưa thấy dấu hiệu rủi ro");
});

test("a final domain that doesn't match the claimed brand is flagged high risk", () => {
  const result = evaluateLinkRisk({
    redirectChain: ["bit.ly", "vietcombank.com.vn"],
    claimedBrand: "Công an"
  });
  assert.equal(result.muc_rui_ro, "Nguy hiểm cao");
});

test("a lookalike domain containing the real brand name is flagged high risk", () => {
  const result = evaluateLinkRisk({
    redirectChain: ["bit.ly", "vietcombank-support.xyz"],
    claimedBrand: "Vietcombank"
  });
  assert.equal(result.muc_rui_ro, "Nguy hiểm cao");
  assert.ok(result.diem >= 4);
});

test("recognizes brand keywords written with Vietnamese diacritics", () => {
  const result = evaluateLinkRisk({
    redirectChain: ["bit.ly", "bocongan.gov.vn"],
    claimedBrand: "Công an phường"
  });
  assert.equal(result.muc_rui_ro, "Chưa thấy dấu hiệu rủi ro");
});

test("always returns at most 3 reasons/actions and at least 1 citation", () => {
  const result = evaluateLinkRisk({
    redirectChain: ["bit.ly", "vietcombank-support.xyz"],
    claimedBrand: "Vietcombank"
  });
  assert.ok(result.ly_do.length <= 3);
  assert.ok(result.hanh_dong.length <= 3);
  assert.ok(result.trich_dan.length >= 1);
});

test("isPrivateOrReservedIp blocks loopback, RFC1918 and link-local IPv4", () => {
  assert.equal(isPrivateOrReservedIp("127.0.0.1", 4), true);
  assert.equal(isPrivateOrReservedIp("10.0.0.5", 4), true);
  assert.equal(isPrivateOrReservedIp("172.16.0.5", 4), true);
  assert.equal(isPrivateOrReservedIp("192.168.1.1", 4), true);
  assert.equal(isPrivateOrReservedIp("169.254.1.1", 4), true);
  assert.equal(isPrivateOrReservedIp("8.8.8.8", 4), false);
});

test("isPrivateOrReservedIp blocks loopback and link-local IPv6", () => {
  assert.equal(isPrivateOrReservedIp("::1", 6), true);
  assert.equal(isPrivateOrReservedIp("fe80::1", 6), true);
  assert.equal(isPrivateOrReservedIp("2606:4700:4700::1111", 6), false);
});

test("resolveRedirectChain rejects non-http(s) protocols before any network call", async () => {
  await assert.rejects(
    () => resolveRedirectChain("javascript:alert(1)", { dnsLookup: async () => { throw new Error("should not be called"); } }),
    LinkCheckError
  );
});

test("resolveRedirectChain rejects hostnames that resolve to a private IP", async () => {
  const dnsLookup = async () => [{ address: "127.0.0.1", family: 4 }];
  await assert.rejects(
    () => resolveRedirectChain("http://internal.example/", { dnsLookup }),
    LinkCheckError
  );
});

test("resolveRedirectChain follows a manual redirect chain via an injected fetchImpl", async () => {
  const dnsLookup = async () => [{ address: "93.184.216.34", family: 4 }];
  const fetchImpl = async (url) => {
    if (url === "http://short.link/abc") {
      return { status: 301, headers: new Map([["location", "https://final.example/"]]) };
    }
    return { status: 200, headers: new Map() };
  };
  const chain = await resolveRedirectChain("http://short.link/abc", { dnsLookup, fetchImpl });
  assert.deepEqual(chain, ["short.link", "final.example"]);
});

test("resolveRedirectChain stops following redirects past the hop limit", async () => {
  const dnsLookup = async () => [{ address: "93.184.216.34", family: 4 }];
  const fetchImpl = async () => ({
    status: 301,
    headers: new Map([["location", "https://loop.example/next"]])
  });
  await assert.rejects(
    () => resolveRedirectChain("http://loop.example/start", { dnsLookup, fetchImpl, maxHops: 2 }),
    LinkCheckError
  );
});
