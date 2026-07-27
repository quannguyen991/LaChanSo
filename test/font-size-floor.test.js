const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Sàn cỡ chữ: KHÔNG chữ nào dưới 14px, ở BẤT KỲ bậc cỡ chữ nào.
//
// LỖ HỔNG ĐÃ TỪNG CẮN (26–27/7/2026): bản đầu của test này chỉ kiểm ở gốc 17px.
// Bậc "A" chạy gốc 15px, nên cùng giá trị rem đó tụt xuống dưới sàn mà test vẫn
// báo xanh. Hậu quả thật: nút khẩn cấp đỏ "Bác đang bị thúc ép" render 13,1px và
// CI không hé một tiếng. Một hàng rào chỉ canh một bậc thì không phải hàng rào.
//
// Bậc nhỏ nhất mới là bậc quyết định: 14px / 15px = 0.9333rem.
const ROOT_STEPS = { small: 15, medium: 17, large: 20 };
const ROOT_PX = ROOT_STEPS.medium;   // giữ cho các hàm cũ
const FLOOR_PX = 14;

const css = fs.readFileSync(path.join(__dirname, "..", "public", "styles.css"), "utf8");
const lines = css.split(/\r?\n/);

// Đổi một giá trị font-size sang px ở gốc 17px.
// Trả về null nếu không quy đổi tĩnh được (em, %, vw trần, calc) — những giá
// trị đó phụ thuộc phần tử cha nên test không phán xét.
function toPx(raw, root = ROOT_PX) {
  const value = raw.trim();

  // clamp(min, ưa thích, max) — chỉ min mới quyết định lúc màn hình hẹp nhất
  const clamp = value.match(/^clamp\(\s*([^,]+),/);
  if (clamp) return toPx(clamp[1], root);

  // max(a, b) — lấy giá trị lớn hơn; nếu một nhánh không quy đổi được thì bỏ qua
  const max = value.match(/^max\(\s*([^,]+),\s*([^)]+)\)$/);
  if (max) {
    const a = toPx(max[1], root);
    const b = toPx(max[2], root);
    if (a === null || b === null) return null;
    return Math.max(a, b);
  }

  const rem = value.match(/^([\d.]+)rem$/);
  if (rem) return Number(rem[1]) * root;

  const px = value.match(/^([\d.]+)px$/);
  if (px) return Number(px[1]);

  return null;
}

function violationsAt(root) {
  const found = [];
  lines.forEach((line, index) => {
    const match = line.match(/(?:^|[;{]|\s)font-size:\s*([^;}]+)/);
    if (!match) return;
    const px = toPx(match[1], root);
    if (px === null) return;
    if (px < FLOOR_PX - 0.01) {
      found.push({
        line: index + 1,
        declared: match[1].trim(),
        px: Number(px.toFixed(2)),
        source: line.trim().slice(0, 90)
      });
    }
  });
  return found;
}

// Một test cho MỖI bậc cỡ chữ. Bậc "small" (15px) là bậc chặt nhất và là bậc
// mà bản test cũ bỏ sót hoàn toàn.
for (const [step, root] of Object.entries(ROOT_STEPS)) {
  test(`no font-size falls below ${FLOOR_PX}px at the "${step}" step (${root}px root)`, () => {
    const found = violationsAt(root);
    const report = found
      .map((v) => `  styles.css:${v.line}  ${v.declared} = ${v.px}px\n      ${v.source}`)
      .join("\n");
    assert.equal(
      found.length,
      0,
      `${found.length} declaration(s) below the ${FLOOR_PX}px floor at the "${step}" step:\n${report}`
    );
  });
}

test("the type-scale tokens themselves respect the floor", () => {
  const tokens = fs.readFileSync(path.join(__dirname, "..", "tokens.css"), "utf8");
  const scale = [...tokens.matchAll(/--text-(xs|sm|base|md|lg|xl|2xl|3xl):\s*([^;]+);/g)];
  assert.ok(scale.length >= 8, "type scale is missing from tokens.css");
  for (const [, name, value] of scale) {
    const px = toPx(value);
    assert.ok(px !== null, `--text-${name} (${value.trim()}) cannot be resolved statically`);
    assert.ok(
      px >= FLOOR_PX,
      `--text-${name} is ${px.toFixed(2)}px, below the ${FLOOR_PX}px floor`
    );
  }
});

test("the primary touch target never drops below 56px at any font step", () => {
  const tokens = fs.readFileSync(path.join(__dirname, "..", "tokens.css"), "utf8");
  const match = tokens.match(/--touch-target-primary:\s*([^;]+);/);
  assert.ok(match, "--touch-target-primary is missing");
  // Bậc chữ nhỏ nhất là 15px, nên 3.5rem trần chỉ ra 52,5px — dưới sàn 56px.
  // Vì vậy token BẮT BUỘC phải kẹp bằng max() với một giá trị px tuyệt đối.
  assert.match(
    match[1],
    /max\(\s*56px/,
    `--touch-target-primary is "${match[1].trim()}"; a bare rem drops to 52.5px at the 15px step`
  );
});
