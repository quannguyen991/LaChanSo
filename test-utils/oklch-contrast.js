// Phép toán tương phản OKLCH dùng CHUNG cho mọi tệp test.
// Tách ra khỏi test/contrast.test.js để ba bộ test không trôi lệch công thức.
// Đặt ngoài test/ vì `node --test` coi mọi .js trong thư mục tên "test" là tệp test.

const fs = require("node:fs");
const path = require("node:path");

const css = fs.readFileSync(path.join(__dirname, "..", "tokens.css"), "utf8");

function token(name) {
  const pattern = new RegExp(`--color-${name}:\\s*oklch\\(([\\d.]+)%\\s+([\\d.]+)\\s+([\\d.]+)`);
  const match = css.match(pattern);
  if (!match) {
    throw new Error(`Missing OKLCH token: ${name}`);
  }
  return {
    l: Number(match[1]) / 100,
    c: Number(match[2]),
    h: Number(match[3]) * Math.PI / 180
  };
}

function luminance(color) {
  const a = color.c * Math.cos(color.h);
  const b = color.c * Math.sin(color.h);
  const lPrime = color.l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = color.l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = color.l - 0.0894841775 * a - 1.291485548 * b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;
  const red = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const green = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const blue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const clamp = (value) => Math.min(1, Math.max(0, value));
  return 0.2126 * clamp(red) + 0.7152 * clamp(green) + 0.0722 * clamp(blue);
}

function contrast(first, second) {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

module.exports = { token, luminance, contrast };
