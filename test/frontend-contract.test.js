const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
const services = fs.readFileSync(path.join(root, "public", "services.js"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public", "manifest.webmanifest"), "utf8"));

test("primary product surfaces use the Lá Chắn Số brand with the Khoan đã tagline", () => {
  // Brand name = "Lá Chắn Số"; "Khoan đã" is the catchphrase/tagline.
  assert.match(html, /class="brand__title">LÁ CHẮN SỐ</);
  assert.equal(manifest.name, "Lá Chắn Số");
  assert.match(html, /name="description" content="Lá Chắn Số/);
  assert.match(html, /<title>Khoan đã/);
});

test("critical senior and emergency controls are present", () => {
  for (const id of [
    "voiceGuideToggle", "analysisDropzone", "cancelAnalysisButton",
    "pressureGuide", "postTransferView", "familyView", "privacyView",
    "supportView", "educationView"
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /TÔI ĐANG BỊ THÚC ÉP/);
  assert.match(html, /TÔI ĐÃ CHUYỂN TIỀN/);
});

test("frontend network access is centralized in service adapters", () => {
  assert.doesNotMatch(app, /\bfetch\s*\(/);
  for (const name of [
    "scamAnalysisService", "ocrService", "speechToTextService", "reputationService",
    "qrService", "evidenceService", "familyCircleService", "supportDirectoryService",
    "communityReportService", "privacyService", "notificationService", "textToSpeechService"
  ]) {
    assert.match(services, new RegExp(name));
  }
});

test("demo and unverified reputation states are explicit", () => {
  assert.match(html, /AI có thể nhận sai/);
  assert.match(app, /dữ liệu minh họa/);
  assert.match(app, /Chưa có dữ liệu xác minh/);
});
