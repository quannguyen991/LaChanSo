const test = require("node:test");
const assert = require("node:assert/strict");
const { TRANSFER_SIGNAL_KEYS, evaluateTransferRisk, normalizeTransferSignals } = require("../src/rule-engine");
const { extractTransferSignals } = require("../src/gemini");

test("normalizes transfer signals to strict booleans", () => {
  const signals = normalizeTransferSignals({
    ten_khong_khop_nguoi_tu_xung: true,
    hua_hoan_tien_sau_phi: "true",
    ignored: true
  });

  assert.deepEqual(Object.keys(signals), TRANSFER_SIGNAL_KEYS);
  assert.equal(signals.ten_khong_khop_nguoi_tu_xung, true);
  assert.equal(signals.hua_hoan_tien_sau_phi, false);
  assert.equal(Object.hasOwn(signals, "ignored"), false);
});

test("flags a personal account impersonating a state agency as high risk", () => {
  const result = evaluateTransferRisk({
    ten_khong_khop_nguoi_tu_xung: true,
    tai_khoan_ca_nhan_nhung_xung_co_quan: true
  });

  assert.equal(result.muc_rui_ro, "Nguy hiểm cao");
  assert.deepEqual(
    result.chien_thuat_thao_tung.map((tactic) => tactic.id),
    ["gia-danh-chu-tai-khoan"]
  );
  // Hai tín hiệu khớp -> đúng hai lý do thật. Không độn thêm câu trấn an cho
  // đủ ba ô, vì câu đó sẽ phủ nhận chính hai dòng ngay trên nó.
  assert.equal(result.ly_do.length, 2);
  assert.doesNotMatch(result.ly_do.join(" "), /chưa nhận ra dấu hiệu/i);
  assert.equal(result.hanh_dong.length, 3);
  assert.ok(result.trich_dan.length >= 1);
});

test("a transfer with no red flags stays low risk", () => {
  const result = evaluateTransferRisk({});
  assert.equal(result.muc_rui_ro, "Chưa thấy dấu hiệu rủi ro");
  assert.equal(result.diem, 0);
  assert.deepEqual(result.chien_thuat_thao_tung, []);
});

test("extractTransferSignals sends the 5 transfer-check signals and no image part", async () => {
  let capturedRequest;
  const fetchImpl = async (_url, request) => {
    capturedRequest = request;
    return {
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                ...Object.fromEntries(TRANSFER_SIGNAL_KEYS.map((key) => [key, false])),
                tai_khoan_ca_nhan_nhung_xung_co_quan: true
              })
            }]
          }
        }]
      })
    };
  };

  const result = await extractTransferSignals("Người liên hệ tự xưng công an, tài khoản nhận tiền tên cá nhân.", {
    apiKey: "fake-test-key",
    fetchImpl
  });

  assert.equal(result.signals.tai_khoan_ca_nhan_nhung_xung_co_quan, true);
  assert.deepEqual(Object.keys(result.signals), TRANSFER_SIGNAL_KEYS);

  const body = JSON.parse(capturedRequest.body);
  assert.deepEqual(body.generationConfig.responseJsonSchema.required, TRANSFER_SIGNAL_KEYS);
  assert.equal(body.contents[0].parts.length, 1);
  assert.ok(body.contents[0].parts[0].text);
});
