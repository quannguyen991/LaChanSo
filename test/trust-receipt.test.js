const test = require("node:test");
const assert = require("node:assert/strict");

const {
  redactSensitive,
  buildTrustReceipt,
  trustReceiptToShareText
} = require("../src/trust-receipt");
const { evaluateRisk, normalizeSignals } = require("../src/rule-engine");
const { detectCriticalOverride } = require("../src/critical-override");
const { resolveInterventionLevel } = require("../src/intervention-ladder");

const FIXED_NOW = new Date("2026-08-07T07:07:00.000Z");

function receiptFor(rawSignals, options = {}) {
  const signals = normalizeSignals(rawSignals);
  const result = evaluateRisk(signals);
  const criticalOverride = detectCriticalOverride({ signals, text: options.text || "" });
  const intervention = resolveInterventionLevel({
    riskLabel: result.muc_rui_ro,
    score: result.diem,
    criticalOverride
  });
  return buildTrustReceipt({
    result,
    intervention,
    criticalOverride,
    now: FIXED_NOW,
    ...options
  });
}

test('mục "Chưa xác minh được" luôn hiển thị, kể cả khi rủi ro thấp', () => {
  const receipt = receiptFor({});
  assert.equal(receipt.mucCanhBao, "Chưa thấy dấu hiệu rủi ro");
  assert.ok(
    receipt.chuaXacMinhDuoc.length > 0,
    "phiếu rủi ro thấp vẫn phải nói rõ điều gì chưa xác minh được"
  );
});

test('phiếu KHÔNG BAO GIỜ dùng chữ "an toàn"', () => {
  const cases = [{}, { doi_otp_hoac_cai_app_la: true }, { ep_thoi_gian_khan_cap: true }];
  for (const signals of cases) {
    const text = JSON.stringify(receiptFor(signals)).toLowerCase();
    assert.ok(!/\ban toàn\b/.test(text), `phiếu chứa chữ "an toàn": ${text.slice(0, 200)}`);
  }
});

test("phiếu luôn mang câu không bảo đảm người gửi đáng tin", () => {
  const receipt = receiptFor({});
  assert.match(receipt.luuY, /không bảo đảm/);
});

test("tối đa 3 dấu hiệu đã phát hiện", () => {
  const receipt = receiptFor({
    gia_danh_co_quan_nha_nuoc: true,
    yeu_cau_giu_bi_mat: true,
    doa_bat_giu_hoac_cat_tro_cap: true,
    ep_thoi_gian_khan_cap: true,
    doi_chuyen_tien_tai_khoan_ca_nhan: true
  });
  assert.ok(receipt.daPhatHien.length <= 3, `có ${receipt.daPhatHien.length} dấu hiệu`);
});

test("ghi rõ ranh giới AI làm gì và bộ luật làm gì", () => {
  const receipt = receiptFor({});
  assert.match(receipt.cachKetLuan.aiLam, /trích xuất tín hiệu/);
  assert.match(receipt.cachKetLuan.aiLam, /không chấm mức rủi ro/);
  assert.match(receipt.cachKetLuan.boLuatLam, /quy tắc cố định/);
});

test("khi AI hỏng, phiếu nói thẳng là kết quả do bộ luật đưa ra", () => {
  const receipt = receiptFor({}, { aiUnavailable: true });
  assert.equal(receipt.cachKetLuan.aiDaChay, false);
  assert.match(receipt.cachKetLuan.ghiChu, /AI không phản hồi/);
});

test("critical override được ghi vào phiếu", () => {
  const receipt = receiptFor(
    {},
    { text: "Chuyển hết sang tài khoản an toàn của cơ quan điều tra." }
  );
  assert.equal(receipt.cachKetLuan.criticalOverride.id, "tai_khoan_an_toan");
  assert.equal(receipt.mucCanThiep.level, "duoc_bao_ve");
});

// ---------------------------------------------------------------------------
// RÒ RỈ DỮ LIỆU — phiếu này đi vào nhóm chat gia đình. Bốn test dưới đây là
// hàng rào duy nhất chặn nó mang theo thứ không được mang.
// ---------------------------------------------------------------------------

test("che số tài khoản đầy đủ, chỉ giữ 4 số cuối", () => {
  assert.equal(redactSensitive("Số tài khoản 19036688123456"), "Số tài khoản **********3456");
  assert.equal(redactSensitive("STK: 1903 6688 1234"), "STK: ********1234");
});

test("che mã OTP, mã PIN và mật khẩu", () => {
  assert.match(redactSensitive("Mã OTP là 847213"), /••••/);
  assert.match(redactSensitive("otp: 123456"), /••••/);
  assert.match(redactSensitive("Mã PIN 4821"), /••••/);
  assert.match(redactSensitive("mật khẩu: 8891234"), /••••/);
  assert.ok(!redactSensitive("Mã OTP là 847213").includes("847213"));
});

test("số tiền và số điện thoại ngắn không bị che nhầm", () => {
  assert.equal(redactSensitive("Số tiền 45.000.000đ"), "Số tiền 45.000.000đ");
  assert.equal(redactSensitive("Gọi 1900 545413"), "Gọi 1900 545413");
});

test("không trường nào của phiếu chứa mã OTP hay số tài khoản đầy đủ", () => {
  const signals = normalizeSignals({ doi_otp_hoac_cai_app_la: true, doi_chuyen_tien_tai_khoan_ca_nhan: true });
  const result = evaluateRisk(signals);
  const receipt = buildTrustReceipt({
    result: {
      ...result,
      ly_do: ["Họ đọc mã OTP là 847213 rồi bảo chuyển vào 19036688123456.", ...result.ly_do]
    },
    structuredResult: { limitations: ["Số tài khoản 19036688123456 chưa xác minh được."] },
    now: FIXED_NOW
  });

  const serialized = JSON.stringify(receipt);
  assert.ok(!serialized.includes("847213"), "phiếu vẫn chứa mã OTP");
  assert.ok(!serialized.includes("19036688123456"), "phiếu vẫn chứa số tài khoản đầy đủ");
  assert.ok(serialized.includes("3456"), "vẫn nên giữ 4 số cuối để người thân đối chiếu");
});

test("bản chia sẻ cũng đã được che, không phải chỉ bản dữ liệu", () => {
  const receipt = buildTrustReceipt({
    result: {
      muc_rui_ro: "Nguy hiểm cao",
      ly_do: ["Bị yêu cầu đọc mã OTP là 998877."],
      hanh_dong: ["Không chuyển vào 19036688123456."],
      trich_dan: []
    },
    now: FIXED_NOW
  });
  const shared = trustReceiptToShareText(receipt);
  assert.ok(!shared.includes("998877"));
  assert.ok(!shared.includes("19036688123456"));
  assert.match(shared, /Chưa xác minh được:/);
  assert.match(shared, /không bảo đảm/);
});

test("nhãn mức rủi ro lạ bị ép về nhãn thấp, không bao giờ tự bịa nhãn mới", () => {
  const receipt = buildTrustReceipt({ result: { muc_rui_ro: "An toàn tuyệt đối" }, now: FIXED_NOW });
  assert.equal(receipt.mucCanhBao, "Chưa thấy dấu hiệu rủi ro");
});

test("hàm thuần: cùng đầu vào cho cùng phiếu, kể cả dấu thời gian", () => {
  const a = receiptFor({ ep_thoi_gian_khan_cap: true });
  const b = receiptFor({ ep_thoi_gian_khan_cap: true });
  assert.deepEqual(a, b);
  assert.equal(a.thoiDiem, FIXED_NOW.toISOString());
});
