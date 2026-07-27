const test = require("node:test");
const assert = require("node:assert/strict");
const { token, contrast } = require("../test-utils/oklch-contrast.js");

const bodyPairs = [
  ["ink", "paper"],
  ["ink-2", "paper"],
  ["muted", "paper"],
  ["accent-ink", "accent"],
  ["accent-ink", "accent-bright"],
  ["paper", "success"],
  ["danger-ink", "danger-deep"],
  ["danger", "danger-soft"],
  ["warning", "warning-soft"],
  ["success", "success-soft"]
];

for (const [foreground, background] of bodyPairs) {
  test(`contrast ${foreground} on ${background} is at least 4.5:1`, () => {
    const ratio = contrast(token(foreground), token(background));
    assert.ok(ratio >= 4.5, `${foreground}/${background} only reaches ${ratio.toFixed(2)}:1`);
  });
}

test("two-tone focus ring remains visible on every interactive surface", () => {
  const inner = token("focus-inner");
  const outer = token("focus-outer");
  const surfaces = ["paper", "surface", "accent", "success", "danger-deep"];

  for (const surface of surfaces) {
    const background = token(surface);
    const bestRatio = Math.max(contrast(inner, background), contrast(outer, background));
    assert.ok(bestRatio >= 3, `Focus ring on ${surface} only reaches ${bestRatio.toFixed(2)}:1`);
  }
});
