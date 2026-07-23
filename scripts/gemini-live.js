require("dotenv").config();

const scenarios = require("../test/scenarios.json");
const { extractSignals } = require("../src/gemini");
const { evaluateRisk } = require("../src/rule-engine");

async function main() {
  for (const scenario of scenarios.slice(0, 3)) {
    const signals = await extractSignals(scenario.input);
    const result = evaluateRisk(signals);
    console.log(`${scenario.id}: ${result.muc_rui_ro}`, signals);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
