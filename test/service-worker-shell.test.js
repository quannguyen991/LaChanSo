const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const sw = fs.readFileSync(path.join(root, "public", "sw.js"), "utf8");

// cache.addAll() là ALL-OR-NOTHING: chỉ cần MỘT mục 404 là cả lời hứa bị từ
// chối, sự kiện install thất bại, và service worker KHÔNG BAO GIỜ cài được —
// app mất sạch chế độ ngoại tuyến mà không báo lỗi gì trên giao diện.
//
// Đã cắn thật (27/7/2026): "/assets/mobile-home-top-reference.webp" nằm trong
// APP_SHELL sau khi file đã bị chuyển sang design-system/. Máy chủ trả 404, SW
// chết lặng, không test nào hé một tiếng.
test("every APP_SHELL entry actually exists on disk", () => {
  const block = sw.match(/const APP_SHELL = \[([\s\S]*?)\];/);
  assert.ok(block, "không tìm thấy APP_SHELL trong sw.js");

  const entries = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(entries.length > 0, "APP_SHELL rỗng");

  const missing = [];
  for (const entry of entries) {
    if (entry === "/") continue;               // phục vụ từ index.html
    const clean = entry.split("?")[0];          // bỏ chuỗi truy vấn phá cache
    // tokens.css nằm ở gốc repo, server.js phục vụ riêng; còn lại nằm trong public/
    const candidates = [path.join(root, "public", clean), path.join(root, clean.replace(/^\//, ""))];
    if (!candidates.some((f) => fs.existsSync(f))) missing.push(entry);
  }

  assert.deepEqual(
    missing,
    [],
    `${missing.length} mục trong APP_SHELL không tồn tại — cache.addAll sẽ reject và service worker không cài được:\n  ${missing.join("\n  ")}`
  );
});
