const test = require("node:test");
const assert = require("node:assert/strict");
const scenarios = require("./scenarios.json");
const {
  SIGNAL_KEYS,
  evaluateRisk,
  normalizeSignals,
  detectManipulationTactics,
  applyRecoveryBoost,
  inferSignalsFromText
} = require("../src/rule-engine");

test("normalizes every signal to a strict boolean", () => {
  const signals = normalizeSignals({
    gia_danh_co_quan_nha_nuoc: true,
    ep_thoi_gian_khan_cap: "true",
    ignored: true
  });

  assert.deepEqual(Object.keys(signals), SIGNAL_KEYS);
  assert.equal(signals.gia_danh_co_quan_nha_nuoc, true);
  assert.equal(signals.ep_thoi_gian_khan_cap, false);
  assert.equal(Object.hasOwn(signals, "ignored"), false);
});

test("infers a suspicious family transfer request without an AI provider", () => {
  const signals = inferSignalsFromText("Con gái tôi bên nước ngoài bảo chuyển khoản ngay cho một tài khoản lạ.");
  assert.equal(signals.tu_xung_nguoi_than_nhung_dang_ngo, true);
  assert.equal(signals.doi_chuyen_tien_tai_khoan_ca_nhan, true);
  assert.equal(signals.ep_thoi_gian_khan_cap, true);
  assert.notEqual(evaluateRisk(signals).muc_rui_ro, "Chưa thấy dấu hiệu rủi ro");
});

test("maps signals to plain-language manipulation tactics", () => {
  const tactics = detectManipulationTactics({
    gia_danh_co_quan_nha_nuoc: true,
    ep_thoi_gian_khan_cap: true,
    yeu_cau_giu_bi_mat: true,
    doi_otp_hoac_cai_app_la: true,
    de_doa_bang_hinh_anh_video_rieng_tu: true
  });

  assert.deepEqual(
    tactics.map((tactic) => tactic.id),
    ["gia-danh-quyen-luc", "tao-so-hai", "thuc-ep-thoi-gian", "co-lap-giu-bi-mat"]
  );
  assert.ok(tactics.every((tactic) => tactic.label && tactic.description));
  assert.ok(tactics.length <= 4);
});

for (const scenario of scenarios) {
  test(`classifies fixture: ${scenario.id}`, () => {
    const result = evaluateRisk(scenario.signals);

    assert.equal(result.muc_rui_ro, scenario.expected_risk);

    // Trước đây dòng này là `equal(result.ly_do.length, 3)` — nó khoá đúng
    // hành vi độn cho đủ ba ô, tức khoá luôn cái lỗi khiến một kết quả có hai
    // dấu hiệu thật lại kèm câu "chưa nhận ra dấu hiệu nào".
    // Ràng buộc thật cần khoá: có ít nhất một lý do, nhiều nhất ba, và không
    // lý do nào rỗng.
    assert.ok(result.ly_do.length >= 1 && result.ly_do.length <= 3, `có ${result.ly_do.length} lý do`);
    assert.ok(result.ly_do.every((reason) => reason.trim().length > 0));

    // Đã có dấu hiệu thật thì không được kèm câu trấn an phủ nhận chúng.
    if (result.diem > 0) {
      assert.doesNotMatch(result.ly_do.join(" "), /chưa nhận ra dấu hiệu/i);
    }

    assert.equal(result.hanh_dong.length, 3);
    assert.ok(result.trich_dan.length >= 1);
    assert.ok(result.chien_thuat_thao_tung.length <= 4);
    assert.ok(Number.isInteger(result.diem));
  });
}

test("applyRecoveryBoost leaves a result untouched when no recovery-scam keyword is present", () => {
  const base = evaluateRisk({});
  const boosted = applyRecoveryBoost(base, "Có người gọi điện hỏi thăm sức khỏe.");
  assert.deepEqual(boosted, base);
});

test("applyRecoveryBoost raises a low-risk result to at least Nghi ngờ when a recovery-scam keyword matches", () => {
  const base = evaluateRisk({});
  assert.equal(base.muc_rui_ro, "Chưa thấy dấu hiệu rủi ro");
  const boosted = applyRecoveryBoost(base, "Bên này nói sẽ giúp tôi lấy lại tiền nếu đóng phí xử lý hồ sơ.");
  assert.equal(boosted.muc_rui_ro, "Nghi ngờ");
  assert.ok(boosted.ly_do.length <= 3);
  assert.ok(boosted.trich_dan.length >= 1);
});

test("applyRecoveryBoost never lowers an already high-risk result", () => {
  const base = evaluateRisk({ gia_danh_co_quan_nha_nuoc: true, doi_chuyen_tien_tai_khoan_ca_nhan: true });
  assert.equal(base.muc_rui_ro, "Nguy hiểm cao");
  const boosted = applyRecoveryBoost(base, "sẽ giúp thu hồi tiền nếu đóng phí xử lý hồ sơ");
  assert.equal(boosted.muc_rui_ro, "Nguy hiểm cao");
});

test("applyRecoveryBoost matches keywords case-insensitively", () => {
  const base = evaluateRisk({});
  const boosted = applyRecoveryBoost(base, "LUẬT SƯ sẽ liên hệ để HOÀN TIỀN cho bác.");
  assert.equal(boosted.muc_rui_ro, "Nghi ngờ");
});

test("a single critical signal alone reaches Nguy hiểm cao (fires the stop-everything warning)", () => {
  for (const key of [
    "doi_otp_hoac_cai_app_la",
    "yeu_cau_chia_se_man_hinh_dieu_khien_tu_xa",
    "de_doa_bang_hinh_anh_video_rieng_tu"
  ]) {
    const result = evaluateRisk({ [key]: true });
    assert.equal(result.muc_rui_ro, "Nguy hiểm cao", `${key} should be high risk alone`);
  }
});

test("a single moderate scam signal is never shown as 'no risk'", () => {
  for (const key of [
    "nguoi_quen_qua_mang_chua_gap_mat_xin_tien",
    "bao_tin_nguoi_than_gap_nan_qua_ben_thu_ba",
    "tu_xung_nguoi_than_nhung_dang_ngo",
    "mao_danh_dich_vu_thiet_yeu_hoac_thue"
  ]) {
    const result = evaluateRisk({ [key]: true });
    assert.notEqual(
      result.muc_rui_ro,
      "Chưa thấy dấu hiệu rủi ro",
      `${key} must not read as safe on its own`
    );
  }
});

test("a lone weight-1 lure signal still stays low risk (no false alarm)", () => {
  const result = evaluateRisk({ moi_hoi_thao_qua_tang_mien_phi: true });
  assert.equal(result.muc_rui_ro, "Chưa thấy dấu hiệu rủi ro");
});

test("only returns citations from the static library", () => {
  const allowed = new Set([
    "Theo cảnh báo của Bộ Công an: lực lượng công an không làm việc, không yêu cầu công dân chuyển tiền qua điện thoại.",
    "Theo cảnh báo của BHXH Việt Nam: cơ quan bảo hiểm xã hội không yêu cầu OTP hay chuyển tiền để chi trả chế độ.",
    "Theo khuyến nghị của Ủy ban Thương mại Liên bang Hoa Kỳ (FTC) về 'family emergency scam': luôn xác minh lại với người thân qua số điện thoại đã lưu trước khi chuyển tiền.",
    "Không cơ quan, ngân hàng hay dịch vụ hợp pháp nào yêu cầu bạn giữ bí mật một giao dịch với người thân.",
    "Theo cảnh báo của cơ quan chức năng: hợp đồng sở hữu kỳ nghỉ thường bị ép ký ngay tại hội thảo, không có thời gian tìm hiểu.",
    "Nhiều nạn nhân đã bị dẫn dụ ký hàng chục hợp đồng liên tiếp với lý do 'giúp chuyển nhượng' hợp đồng cũ, gây thiệt hại ngày càng lớn.",
    "Ngân hàng, nhà mạng và cơ quan nhà nước không bao giờ yêu cầu khách hàng chia sẻ màn hình hoặc cài ứng dụng điều khiển thiết bị từ xa."
  ]);

  for (const scenario of scenarios) {
    for (const citation of evaluateRisk(scenario.signals).trich_dan) {
      assert.ok(allowed.has(citation), `Unexpected citation: ${citation}`);
    }
  }
});
