const test = require("node:test");
const assert = require("node:assert/strict");

const {
  LEVELS,
  LEVEL_ORDER,
  BAND_MEDIUM_MIN,
  BAND_HIGH_MIN,
  normalizeScore,
  resolveInterventionLevel,
  screensFor,
  nextScreenAfterCountdown,
  isAtLeast
} = require("../src/intervention-ladder");
const { evaluateRisk, normalizeSignals, classifyScore } = require("../src/rule-engine");
const { detectCriticalOverride } = require("../src/critical-override");

test("thang có đúng năm mức, xếp tăng dần", () => {
  assert.deepEqual(LEVEL_ORDER, [
    "phieu_tin_cay",
    "duong_xac_minh",
    "dung_60_giay",
    "duoc_bao_ve",
    "phuc_hoi"
  ]);
});

test("không tín hiệu nào -> Phiếu tin cậy", () => {
  const level = resolveInterventionLevel({ riskLabel: "Chưa thấy dấu hiệu rủi ro", score: 0 });
  assert.equal(level.level, LEVELS.PHIEU_TIN_CAY);
  assert.equal(level.boDieuHuong, false);
});

test('"Nghi ngờ" -> Đường xác minh', () => {
  const level = resolveInterventionLevel({ riskLabel: "Nghi ngờ", score: 2 });
  assert.equal(level.level, LEVELS.DUONG_XAC_MINH);
});

test('"Nguy hiểm cao" không có override -> Dừng 60 giây, KHÔNG phải màn bảo vệ', () => {
  const level = resolveInterventionLevel({ riskLabel: "Nguy hiểm cao", score: 5 });
  assert.equal(level.level, LEVELS.DUNG_60_GIAY);
  assert.equal(level.boDieuHuong, false);
});

// Đây là ràng buộc trung tâm của Phần 4: điểm số cao tới đâu cũng không tự
// đưa người dùng vào màn hình bỏ hết điều hướng.
test("điểm số dù rất cao vẫn KHÔNG bao giờ tự đẩy lên mức Nghiêm trọng", () => {
  for (const score of [4, 8, 12, 40, 999]) {
    const level = resolveInterventionLevel({ riskLabel: "Nguy hiểm cao", score });
    assert.equal(
      level.level,
      LEVELS.DUNG_60_GIAY,
      `diem=${score} đã tự leo lên ${level.level}`
    );
  }
});

test("chỉ critical override mới mở được mức Nghiêm trọng", () => {
  const level = resolveInterventionLevel({
    riskLabel: "Chưa thấy dấu hiệu rủi ro",
    score: 0,
    criticalOverride: { id: "tai_khoan_an_toan", label: "x", explanation: "y" }
  });
  assert.equal(level.level, LEVELS.DUOC_BAO_VE);
  assert.equal(level.boDieuHuong, true);
  assert.equal(level.route, "#duoc-bao-ve");
  assert.equal(level.criticalOverride.id, "tai_khoan_an_toan");
});

test("người dùng tự khai đã chuyển tiền -> Phục hồi, thắng cả override", () => {
  const level = resolveInterventionLevel({
    riskLabel: "Nguy hiểm cao",
    score: 9,
    criticalOverride: { id: "otp_kem_chuyen_tien", label: "x", explanation: "y" },
    moneyAlreadySent: true
  });
  assert.equal(level.level, LEVELS.PHUC_HOI);
  assert.equal(level.route, "#vua-chuyen-tien");
});

test("mọi mức đều sinh Phiếu tin cậy", () => {
  const cases = [
    { riskLabel: "Chưa thấy dấu hiệu rủi ro", score: 0 },
    { riskLabel: "Nghi ngờ", score: 2 },
    { riskLabel: "Nguy hiểm cao", score: 6 },
    { riskLabel: "Nguy hiểm cao", score: 6, criticalOverride: { id: "a", label: "b", explanation: "c" } },
    { riskLabel: "Nghi ngờ", score: 2, moneyAlreadySent: true }
  ];
  for (const input of cases) {
    assert.equal(resolveInterventionLevel(input).luonSinhPhieuTinCay, true);
  }
});

// Ngưỡng của thang can thiệp phải TRÙNG ranh giới của classifyScore, nếu không
// người dùng sẽ thấy nhãn "Nghi ngờ" nhưng lại nhận màn hình của mức Thấp.
test("ngưỡng quy đổi trùng khớp ranh giới của classifyScore", () => {
  for (let diem = 0; diem <= 12; diem += 1) {
    const riskLabel = classifyScore(diem);
    const normalized = normalizeScore(diem);
    const level = resolveInterventionLevel({ riskLabel, score: diem }).level;

    if (riskLabel === "Nguy hiểm cao") {
      assert.ok(normalized >= BAND_HIGH_MIN, `diem=${diem} nhãn Cao nhưng quy đổi ${normalized} < ${BAND_HIGH_MIN}`);
      assert.equal(level, LEVELS.DUNG_60_GIAY);
    } else if (riskLabel === "Nghi ngờ") {
      assert.ok(normalized >= BAND_MEDIUM_MIN, `diem=${diem} nhãn Nghi ngờ nhưng quy đổi ${normalized} < ${BAND_MEDIUM_MIN}`);
      assert.ok(normalized < BAND_HIGH_MIN, `diem=${diem} nhãn Nghi ngờ nhưng quy đổi ${normalized} >= ${BAND_HIGH_MIN}`);
      assert.equal(level, LEVELS.DUONG_XAC_MINH);
    } else {
      assert.ok(normalized < BAND_MEDIUM_MIN, `diem=${diem} nhãn Thấp nhưng quy đổi ${normalized} >= ${BAND_MEDIUM_MIN}`);
      assert.equal(level, LEVELS.PHIEU_TIN_CAY);
    }
  }
});

test("mức Nghiêm trọng là MỘT luồng hai màn: đếm ngược rồi tới màn bảo vệ", () => {
  assert.deepEqual(screensFor(LEVELS.DUOC_BAO_VE), [LEVELS.DUNG_60_GIAY, LEVELS.DUOC_BAO_VE]);
  assert.equal(
    nextScreenAfterCountdown(LEVELS.DUOC_BAO_VE, LEVELS.DUNG_60_GIAY),
    LEVELS.DUOC_BAO_VE
  );
});

// Bản đầu của module này để đếm ngược hết giờ là leo thẳng lên màn bảo vệ cho
// MỌI ca mức Cao — tức điểm số tự mở được màn hình bỏ hết điều hướng.
test("mức Cao hết giờ thì DỪNG LẠI, không tự leo sang màn bảo vệ", () => {
  assert.deepEqual(screensFor(LEVELS.DUNG_60_GIAY), [LEVELS.DUNG_60_GIAY]);
  assert.equal(nextScreenAfterCountdown(LEVELS.DUNG_60_GIAY, LEVELS.DUNG_60_GIAY), null);
});

test("các mức khác chỉ có một màn hình", () => {
  assert.deepEqual(screensFor(LEVELS.PHIEU_TIN_CAY), [LEVELS.PHIEU_TIN_CAY]);
  assert.deepEqual(screensFor(LEVELS.DUONG_XAC_MINH), [LEVELS.DUONG_XAC_MINH]);
  assert.deepEqual(screensFor(LEVELS.PHUC_HOI), [LEVELS.PHUC_HOI]);
  assert.equal(nextScreenAfterCountdown(LEVELS.DUONG_XAC_MINH, LEVELS.DUONG_XAC_MINH), null);
});

test("mức can thiệp trả về kèm chuỗi màn hình để giao diện không phải tự đoán", () => {
  const severe = resolveInterventionLevel({
    riskLabel: "Nguy hiểm cao",
    score: 6,
    criticalOverride: { id: "a", label: "b", explanation: "c" }
  });
  assert.deepEqual(severe.manHinh, ["dung_60_giay", "duoc_bao_ve"]);

  const high = resolveInterventionLevel({ riskLabel: "Nguy hiểm cao", score: 6 });
  assert.deepEqual(high.manHinh, ["dung_60_giay"]);
});

test("isAtLeast so sánh đúng thứ tự", () => {
  assert.equal(isAtLeast(LEVELS.DUOC_BAO_VE, LEVELS.DUNG_60_GIAY), true);
  assert.equal(isAtLeast(LEVELS.PHIEU_TIN_CAY, LEVELS.DUONG_XAC_MINH), false);
  assert.equal(isAtLeast(LEVELS.DUNG_60_GIAY, LEVELS.DUNG_60_GIAY), true);
});

// Nối cả chuỗi: tín hiệu -> bộ luật -> override -> thang can thiệp.
test("chuỗi đầy đủ: giả danh công an bắt giữ bí mật đòi chuyển tiền -> mức Nghiêm trọng", () => {
  const signals = normalizeSignals({
    gia_danh_co_quan_nha_nuoc: true,
    yeu_cau_giu_bi_mat: true,
    doa_bat_giu_hoac_cat_tro_cap: true,
    doi_chuyen_tien_tai_khoan_ca_nhan: true,
    ep_thoi_gian_khan_cap: true
  });
  const result = evaluateRisk(signals);
  assert.equal(result.muc_rui_ro, "Nguy hiểm cao");

  const override = detectCriticalOverride({ signals });
  const level = resolveInterventionLevel({
    riskLabel: result.muc_rui_ro,
    score: result.diem,
    criticalOverride: override
  });
  assert.equal(level.level, LEVELS.DUOC_BAO_VE);
});

test("chuỗi đầy đủ: tin nhắn giao hàng bình thường -> Phiếu tin cậy", () => {
  const signals = normalizeSignals({});
  const result = evaluateRisk(signals);
  const override = detectCriticalOverride({ signals, text: "Đơn hàng giao trong hôm nay." });
  const level = resolveInterventionLevel({
    riskLabel: result.muc_rui_ro,
    score: result.diem,
    criticalOverride: override
  });
  assert.equal(level.level, LEVELS.PHIEU_TIN_CAY);
});

test("normalizeScore an toàn với đầu vào rác", () => {
  assert.equal(normalizeScore(undefined), 0);
  assert.equal(normalizeScore(null), 0);
  assert.equal(normalizeScore("abc"), 0);
  assert.equal(normalizeScore(-5), 0);
  assert.equal(normalizeScore(1000), 100);
});
