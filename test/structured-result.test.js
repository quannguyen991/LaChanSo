const test = require("node:test");
const assert = require("node:assert/strict");
const { evaluateRisk, inferSignalsFromText } = require("../src/rule-engine");
const { buildStructuredAnalysisResult, extractEntities, mapRiskLevel } = require("../src/structured-result");

test("maps Vietnamese risk labels to stable structured risk levels", () => {
  assert.equal(mapRiskLevel(evaluateRisk({}), {}), "low");
  assert.equal(mapRiskLevel(evaluateRisk({ ep_thoi_gian_khan_cap: true }), { ep_thoi_gian_khan_cap: true }), "medium");
  assert.equal(
    mapRiskLevel(
      evaluateRisk({ gia_danh_co_quan_nha_nuoc: true, doi_chuyen_tien_tai_khoan_ca_nhan: true }),
      { gia_danh_co_quan_nha_nuoc: true, doi_chuyen_tien_tai_khoan_ca_nhan: true }
    ),
    "high"
  );
  assert.equal(
    mapRiskLevel(
      evaluateRisk({ doi_otp_hoac_cai_app_la: true }),
      { doi_otp_hoac_cai_app_la: true }
    ),
    "critical"
  );
});

test("extracts useful entities without exposing OTP values", () => {
  const entities = extractEntities("Bấm https://bad.example/login, gọi 0901234567, chuyển 20 triệu vào 1234567890 và đọc OTP 123456.");

  assert.ok(entities.some((entity) => entity.type === "url" && entity.value === "https://bad.example/login"));
  assert.ok(entities.some((entity) => entity.type === "phone"));
  assert.ok(entities.some((entity) => entity.type === "money_amount"));
  assert.ok(entities.some((entity) => entity.type === "bank_account"));
  assert.ok(entities.some((entity) => entity.type === "otp_mention"));
  assert.doesNotMatch(JSON.stringify(entities.filter((entity) => entity.type === "otp_mention")), /123456/);
});

test("builds a structured result from deterministic rules and journey context", () => {
  const text = "Công an bảo tôi giữ bí mật, cài app lạ rồi chuyển khoản ngay vào tài khoản 1234567890.";
  const signals = inferSignalsFromText(text);
  const result = evaluateRisk(signals);
  const structured = buildStructuredAnalysisResult({ result, signals, text });

  assert.equal(structured.riskLevel, "critical");
  assert.equal(structured.requiresEmergencyFlow, true);
  assert.equal(structured.dataStatus, "Đủ dữ liệu để phân tích.");
  assert.ok(structured.journeyStage);
  assert.ok(structured.manipulationSignals.length <= 3);
  assert.ok(structured.immediateActions.length <= 3);
  assert.ok(structured.predictedNextSteps.length <= 3);
  assert.ok(structured.extractedEntities.some((entity) => entity.type === "bank_account"));
  assert.match(structured.nextQuestion.question, /chuyển tiền|OTP|ảnh/i);
  assert.ok(structured.limitations.every((limitation) => !/An toàn tuyệt đối/i.test(limitation)));
});

test("keeps low-risk structured results cautious and non-empty", () => {
  const signals = inferSignalsFromText("Một người quen nhắn hỏi thăm sức khỏe.");
  const result = evaluateRisk(signals);
  const structured = buildStructuredAnalysisResult({ result, signals, text: "Một người quen nhắn hỏi thăm sức khỏe." });

  assert.equal(structured.riskLevel, "low");
  assert.equal(structured.requiresEmergencyFlow, false);
  assert.ok(structured.predictedNextSteps.length >= 1);
  assert.match(structured.summary, /Chưa|Thông tin/);
  assert.match(structured.limitations.join(" "), /không bảo đảm/);
});

test("recommends explicit next actions without auto-opening extracted links", () => {
  const text = "Cài ứng dụng lạ, đọc OTP 123456, rồi chuyển vào 1234567890 qua https://bad.example.";
  const signals = inferSignalsFromText(text);
  const structured = buildStructuredAnalysisResult({ result: evaluateRisk(signals), signals, text });

  assert.deepEqual(
    structured.recommendedActions.map((action) => action.type),
    ["protect_device", "check_link", "check_transfer"]
  );
  assert.ok(structured.recommendedActions.every((action) => action.route.startsWith("#")));
  assert.doesNotMatch(JSON.stringify(structured.recommendedActions), /fetch|https?:/i);
});
