const test = require("node:test");
const assert = require("node:assert/strict");
const { contrast, token } = require("../test-utils/oklch-contrast.js");

// WCAG 2.2 – 1.4.11 "Non-text Contrast": ranh giới của một thành phần giao diện
// phải đạt >= 3:1 so với nền kề bên. contrast.test.js chỉ kiểm CHỮ, nên trước
// đây một viền thẻ 1,2:1 vẫn pass — mà với mắt đục thủy tinh thể thì đó là
// KHÔNG CÓ VIỀN. Người dùng của sản phẩm này phần lớn trên 70 tuổi.
const MIN_RATIO = 3;

// Chỉ liệt kê những token thật sự là RANH GIỚI của một thành phần.
// --color-sky-line và --color-accent-soft-line cố ý KHÔNG có ở đây: chúng chỉ
// dùng cho hoa văn trang trí (chấm bi, sọc nền). Làm tối chúng sẽ phá tương
// phản chữ --color-accent trên nền hover.
const boundaryPairs = [
  ["rule", "surface"],
  ["rule", "surface-2"],
  ["rule", "paper"],
  ["rule-strong", "surface"],
  ["rule-strong", "surface-2"],
  ["rule-strong", "paper"],
  ["notice-line", "notice-soft"],
  ["notice-line", "warning-soft"],
  ["border-tinted", "surface"],
  ["border-tinted", "sky-soft"],
  ["border-tinted", "accent-soft"],
  ["border-interactive", "surface"],
  ["border-interactive", "accent-soft"],
  ["border-interactive", "sky-soft"]
];

for (const [border, surface] of boundaryPairs) {
  test(`boundary ${border} on ${surface} is at least ${MIN_RATIO}:1`, () => {
    const ratio = contrast(token(border), token(surface));
    assert.ok(
      ratio >= MIN_RATIO,
      `${border} on ${surface} is ${ratio.toFixed(2)}:1, below the ${MIN_RATIO}:1 floor`
    );
  });
}

test("risk aliases point at the tokens the rule engine's labels expect", () => {
  // Màu chỉ là lớp phụ; nhãn chữ mới là nguồn sự thật. Test này chỉ chốt rằng
  // bí danh tồn tại và trỏ đúng, để một lần đổi màu không âm thầm khiến mức
  // "Chưa thấy dấu hiệu rủi ro" mang màu của mức nguy hiểm.
  const fs = require("node:fs");
  const path = require("node:path");
  const tokens = fs.readFileSync(path.join(__dirname, "..", "tokens.css"), "utf8");
  assert.match(tokens, /--color-risk-high:\s*var\(--color-danger\)/);
  assert.match(tokens, /--color-risk-medium:\s*var\(--color-warning\)/);
  assert.match(tokens, /--color-risk-low:\s*var\(--color-success\)/);
  // Nhãn bất biến phải còn nguyên trong ghi chú, để lần sửa sau không xoá mất
  // lời cảnh báo quan trọng nhất của sản phẩm.
  assert.match(tokens, /KHÔNG đổi thành "An toàn"/);
});
