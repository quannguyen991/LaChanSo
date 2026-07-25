require("dotenv").config();

const scenarios = require("../test/scenarios.json");
const { extractSignals } = require("../src/gemini");
const { evaluateRisk } = require("../src/rule-engine");

// Safety semantics: for an anti-scam tool, erring HIGH (over-warning) is
// acceptable; erring LOW (missing a scam, "chưa thấy rủi ro" on a dangerous
// case) is the real failure. So the live check fails only on UNDER-detection,
// not on a model being more cautious than the fixture. This keeps the check
// model-agnostic (Gemini, Claude, etc. extract slightly differently).
const RISK_RANK = {
  "Chưa thấy dấu hiệu rủi ro": 0,
  "Nghi ngờ": 1,
  "Nguy hiểm cao": 2
};

async function main() {
  let misses = 0;
  for (const scenario of scenarios.slice(0, 3)) {
    const extraction = await extractSignals(scenario.input);
    const result = evaluateRisk(extraction.signals);
    const actual = RISK_RANK[result.muc_rui_ro] ?? 0;
    const expected = RISK_RANK[scenario.expected_risk] ?? 0;
    const under = actual < expected;
    if (under) misses += 1;
    const tag = under ? "SÓT" : (actual > expected ? "THẬN TRỌNG HƠN" : "OK");
    console.log(
      `[${tag}] ${scenario.id}: ${result.muc_rui_ro} (mong đợi tối thiểu: ${scenario.expected_risk})`,
      extraction.signals
    );
  }
  if (misses > 0) {
    throw new Error(`${misses} kịch bản bị chấm THẤP hơn mức mong đợi — bỏ sót rủi ro.`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
