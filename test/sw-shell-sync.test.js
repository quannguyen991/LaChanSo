const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// "Sửa xong mà trình duyệt không đổi" là bẫy số MỘT trong CLAUDE.md.
//
// Cơ chế: `sw.js` precache một danh sách URL CÓ ĐÁNH VERSION. Khi đổi CSS thì
// phải bump cache-bust trong `index.html`. Nếu quên bump luôn trong `sw.js`,
// hai bên trỏ vào hai URL khác nhau:
//   index.html  ->  /khoan-da-2026.css?v=20260807-onboarding-desktop-1
//   sw.js       ->  /khoan-da-2026.css?v=20260801-learning-alerts-1
// Bản offline vẫn dựng bằng CSS CŨ, và không có gì đỏ để báo.
//
// Hàng rào này mô tả CẤU TRÚC SAI (hai danh sách lệch nhau), không liệt kê
// tên file cụ thể — thêm stylesheet mới vào precache là nó tự bảo vệ luôn.

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const sw = fs.readFileSync(path.join(root, "public", "sw.js"), "utf8");

/** Mọi <link rel=stylesheet> cùng chuỗi version của nó, theo index.html. */
function stylesheetsFromHtml() {
  const map = new Map();
  const re = /<link\b[^>]*rel="stylesheet"[^>]*href="(\/[^"?]+\.css)(\?[^"]*)?"/g;
  let m;
  while ((m = re.exec(html)) !== null) map.set(m[1], m[2] || "");
  return map;
}

/** Mọi mục .css trong mảng APP_SHELL của sw.js. */
function stylesheetsFromServiceWorker() {
  const block = sw.match(/const APP_SHELL = \[([\s\S]*?)\];/);
  assert.ok(block, "sw.js phải khai báo mảng APP_SHELL");
  const map = new Map();
  const re = /"(\/[^"?]+\.css)(\?[^"]*)?"/g;
  let m;
  while ((m = re.exec(block[1])) !== null) map.set(m[1], m[2] || "");
  return map;
}

test("sw.js precache trỏ đúng version stylesheet mà index.html đang dùng", () => {
  const inHtml = stylesheetsFromHtml();
  const inSw = stylesheetsFromServiceWorker();
  assert.ok(inSw.size > 0, "APP_SHELL phải precache ít nhất một stylesheet");

  const lech = [];
  for (const [file, swVersion] of inSw) {
    if (!inHtml.has(file)) {
      lech.push(`  ${file}: sw.js precache nhưng index.html KHÔNG còn nạp`);
      continue;
    }
    const htmlVersion = inHtml.get(file);
    if (htmlVersion !== swVersion) {
      lech.push(`  ${file}\n      index.html -> "${htmlVersion || "(không version)"}"\n      sw.js      -> "${swVersion || "(không version)"}"`);
    }
  }

  assert.equal(
    lech.length,
    0,
    `${lech.length} stylesheet lệch giữa index.html và sw.js — bản offline sẽ dựng bằng CSS cũ:\n${lech.join("\n")}`
  );
});

test("đổi stylesheet thì phải bump CACHE_NAME, không được giữ nguyên", () => {
  // Không ghim một con số cụ thể (ghim số thì mọi lần bump đều làm test đỏ).
  // Chỉ khoá: tên cache CÓ đánh số, và số không tụt lùi khỏi mốc đã phát hành.
  const version = sw.match(/khoan-da-shell-v(\d+)/);
  assert.ok(version, "sw.js phải có tên cache dạng khoan-da-shell-v<số>");
  assert.ok(
    Number(version[1]) >= 54,
    `cache version tụt về v${version[1]}; hạ version khiến trình duyệt giữ lại shell cũ`
  );
});
