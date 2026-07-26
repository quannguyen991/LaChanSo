const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Sàn cỡ chữ: KHÔNG chữ nào dưới 14px ở gốc 17px.
// Người dùng là bác trên 70 tuổi, mắt kém. Nút A / A+ / A++ phóng to được,
// nhưng bậc nhỏ nhất (15px) vẫn phải đọc nổi — nên sàn tính ở gốc 17px là
// mức TỐI THIỂU, chưa phải mức an toàn nhất.
const ROOT_PX = 17;
const FLOOR_PX = 14;

const css = fs.readFileSync(path.join(__dirname, "..", "public", "styles.css"), "utf8");
const lines = css.split(/\r?\n/);

// Đổi một giá trị font-size sang px ở gốc 17px.
// Trả về null nếu không quy đổi tĩnh được (em, %, vw trần, calc) — những giá
// trị đó phụ thuộc phần tử cha nên test không phán xét.
function toPx(raw) {
  const value = raw.trim();

  // clamp(min, ưa thích, max) — chỉ min mới quyết định lúc màn hình hẹp nhất
  const clamp = value.match(/^clamp\(\s*([^,]+),/);
  if (clamp) return toPx(clamp[1]);

  // max(a, b) — lấy giá trị lớn hơn; nếu một nhánh không quy đổi được thì bỏ qua
  const max = value.match(/^max\(\s*([^,]+),\s*([^)]+)\)$/);
  if (max) {
    const a = toPx(max[1]);
    const b = toPx(max[2]);
    if (a === null || b === null) return null;
    return Math.max(a, b);
  }

  const rem = value.match(/^([\d.]+)rem$/);
  if (rem) return Number(rem[1]) * ROOT_PX;

  const px = value.match(/^([\d.]+)px$/);
  if (px) return Number(px[1]);

  return null;
}

const violations = [];
lines.forEach((line, index) => {
  const match = line.match(/(?:^|[;{]|\s)font-size:\s*([^;}]+)/);
  if (!match) return;
  const px = toPx(match[1]);
  if (px === null) return;
  if (px < FLOOR_PX - 0.01) {
    violations.push({
      line: index + 1,
      declared: match[1].trim(),
      px: Number(px.toFixed(2)),
      source: line.trim().slice(0, 90)
    });
  }
});

test(`no font-size in styles.css falls below ${FLOOR_PX}px at the ${ROOT_PX}px root`, () => {
  const report = violations
    .map((v) => `  styles.css:${v.line}  ${v.declared} = ${v.px}px\n      ${v.source}`)
    .join("\n");
  assert.equal(
    violations.length,
    0,
    `${violations.length} declaration(s) below the ${FLOOR_PX}px floor:\n${report}`
  );
});

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
