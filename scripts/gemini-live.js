require("dotenv").config();

const scenarios = require("../test/scenarios.json");
const { extractSignals } = require("../src/gemini");
const { evaluateRisk } = require("../src/rule-engine");

async function main() {
  let mismatches = 0;
  for (const scenario of scenarios.slice(0, 3)) {
    const extraction = await extractSignals(scenario.input);
    const result = evaluateRisk(extraction.signals);
    const ok = result.muc_rui_ro === scenario.expected_risk;
    if (!ok) mismatches += 1;
    console.log(
      `[${ok ? "OK" : "SAI"}] ${scenario.id}: ${result.muc_rui_ro} (mong đợi: ${scenario.expected_risk})`,
      extraction.signals
    );
  }
  if (mismatches > 0) {
    throw new Error(`${mismatches} kịch bản Gemini không khớp mức rủi ro mong đợi.`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
