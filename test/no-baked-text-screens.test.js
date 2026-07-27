const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// "Chữ nướng vào ảnh" đã ship BA lần (26/7, 27/7 sáng, 27/7 chiều) và CI xanh
// cả ba lần. Hai lần đầu hàng rào là DANH SÁCH ĐEN tên file — nên lần thứ ba
// chỉ cần đặt tên khác là lọt.
//
// Tệp này bắt CẤU TRÚC, không bắt tên. Mẫu vi phạm luôn gồm 3 phần:
//   1. một <img> phủ kín một màn/khối
//   2. chữ thật bị đẩy sang visually-hidden (chỉ trình đọc màn hình thấy)
//   3. <button> RỖNG RUỘT đặt đè lên chỗ nút được VẼ trong ảnh
//
// Bắt được (2) và (3) là bắt được mẫu này, dù ảnh tên gì.

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const cssFiles = fs
  .readdirSync(path.join(root, "public"))
  .filter((f) => f.endsWith(".css"))
  .map((f) => ({ name: f, text: fs.readFileSync(path.join(root, "public", f), "utf8") }));

test("no button is an empty hit area over a picture of a button", () => {
  // Một <button> không có chữ, không có icon, chỉ có aria-label — nghĩa là cái
  // người dùng NHÌN THẤY nằm trong ảnh phía dưới. Chữ trong ảnh không phóng to
  // được, không dịch được, và mất hẳn nếu ảnh lỗi.
  const offenders = [];
  const buttonRe = /<button\b([^>]*)>([\s\S]*?)<\/button>/g;
  let m;
  while ((m = buttonRe.exec(html)) !== null) {
    const [, attrs, inner] = m;
    const hasText = inner.replace(/<[^>]*>/g, "").trim().length > 0;
    const hasIcon = /<(img|svg|span[^>]*class="[^"]*icon)/.test(inner);
    if (hasText || hasIcon) continue;
    if (/type="file"/.test(attrs)) continue;
    const id = (attrs.match(/id="([^"]+)"/) || [])[1];
    const cls = (attrs.match(/class="([^"]+)"/) || [])[1] || "";
    const label = (attrs.match(/aria-label="([^"]+)"/) || [])[1] || "(không nhãn)";
    offenders.push(`  <button ${id ? `id="${id}"` : `class="${cls}"`}> aria-label="${label}"`);
  }
  assert.equal(
    offenders.length,
    0,
    `${offenders.length} nút rỗng ruột — chữ trên nút đang nằm trong ảnh:\n${offenders.join("\n")}`
  );
});

test("no screen hides its real heading to show a picture instead", () => {
  // Chữ thật bị đẩy sang visually-hidden NGAY CẠNH một <img> = ảnh đang đóng
  // vai màn hình. Trình đọc màn hình vẫn đọc được, nhưng bác mắt kém bấm nút
  // phóng chữ thì không có gì to lên.
  const offenders = [];
  const blockRe = /<(article|section|div)\b[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = blockRe.exec(html)) !== null) {
    const inner = m[2];
    const hiddenHeading = /<h[1-6][^>]*class="[^"]*visually-hidden/.test(inner);
    const hasImg = /<img\b/.test(inner);
    if (hiddenHeading && hasImg) {
      const label = (inner.match(/id="([^"]+)"/) || [])[1] || m[0].slice(0, 60);
      offenders.push(`  khối chứa "${label}": tiêu đề visually-hidden + <img>`);
    }
  }
  assert.equal(
    offenders.length,
    0,
    `${offenders.length} khối dùng ảnh thay cho chữ thật:\n${offenders.join("\n")}`
  );
});

test("no image is stretched to fill the viewport", () => {
  // Ảnh neo theo dvh/vh/vw thì kích thước KHÔNG liên quan gì tới cỡ chữ, nên
  // mọi chữ trong ảnh đứng yên khi bấm A / A+ / A++.
  const offenders = [];
  for (const { name, text } of cssFiles) {
    const ruleRe = /([^{}]+)\{([^}]*)\}/g;
    let m;
    while ((m = ruleRe.exec(text)) !== null) {
      const [, selector, body] = m;
      if (!/\b(img|__reference|__scene|__art|__illustration)\b/.test(selector)) continue;
      const viewportSized = /height:\s*[^;]*\b\d+(dvh|vh)\b/.test(body)
        || /width:\s*[^;]*\b100vw\b/.test(body);
      if (viewportSized) {
        offenders.push(`  ${name}: ${selector.trim().slice(0, 70)}`);
      }
    }
  }
  assert.equal(
    offenders.length,
    0,
    `${offenders.length} quy tắc kéo ảnh phủ khung nhìn:\n${offenders.join("\n")}`
  );
});
