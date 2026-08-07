const test = require("node:test");
const assert = require("node:assert/strict");

const {
  evaluateRisk,
  evaluateTransferRisk,
  normalizeSignals,
  normalizeTransferSignals,
  inferSignalsFromText
} = require("../src/rule-engine");

// ============================================================================
// KHÔNG TRẤN AN SAI
//
// Hàng rào này sinh ra từ một lỗi ĐO ĐƯỢC TRÊN BẢN PRODUCTION (7/8/2026):
//
//   Đầu vào : "Chị đừng báo cho ai trong nhà nhé."
//   Trả về  : "Chưa thấy lời đe doạ, ép giữ bí mật hoặc xin mã OTP."
//
// Câu trả về là một KHẲNG ĐỊNH rằng không có yêu cầu giữ bí mật, trong khi yêu
// cầu đó nằm ngay trong nội dung. Với người đang bị thúc ép, câu đó là giấy
// phép để chuyển tiền.
//
// Sai lầm gốc: các câu độn được viết như phán quyết về THẾ GIỚI, trong khi
// chúng chỉ được phép nói về thứ HỆ THỐNG NHẬN RA.
// ============================================================================

// Những dấu hiệu mà một câu độn KHÔNG được phép tuyên bố là vắng mặt. Hệ thống
// không có cách nào biết chắc chúng vắng mặt — nó chỉ biết nó không nhận ra.
const SIGNALS_NEVER_TO_DENY = [
  "đe doạ",
  "đe dọa",
  "giữ bí mật",
  "mã OTP",
  "chuyển tiền để điều tra",
  "tên người nhận bất thường",
  "ép chuyển nhiều lần",
  "hứa hoàn phí"
];

function allText(result) {
  return [...(result.ly_do || []), ...(result.hanh_dong || [])].join(" ");
}

test("kết quả rủi ro thấp không tuyên bố vắng mặt một dấu hiệu cụ thể nào", () => {
  const result = evaluateRisk(normalizeSignals({}));
  assert.equal(result.muc_rui_ro, "Chưa thấy dấu hiệu rủi ro");

  const text = allText(result);
  for (const signal of SIGNALS_NEVER_TO_DENY) {
    assert.ok(
      !new RegExp(`Chưa thấy[^.]*${signal}`, "i").test(text),
      `câu độn đang khẳng định không có "${signal}" — hệ thống không biết được điều đó:\n  ${text}`
    );
  }
});

test("luồng chuyển khoản cũng không tuyên bố vắng mặt dấu hiệu", () => {
  const result = evaluateTransferRisk(normalizeTransferSignals({}));
  const text = allText(result);
  for (const signal of SIGNALS_NEVER_TO_DENY) {
    assert.ok(
      !new RegExp(`Chưa thấy[^.]*${signal}`, "i").test(text),
      `câu độn luồng chuyển khoản đang khẳng định không có "${signal}":\n  ${text}`
    );
  }
});

// Đây là ca thật đã bắt được lỗi trên production. Bộ dò từ khoá KHÔNG nhận ra
// câu này (nó không chứa "giu bi mat", "khong duoc ke"…), nên kết quả vẫn là
// mức thấp — điều đó chấp nhận được. Điều KHÔNG chấp nhận được là hệ thống
// nói thêm rằng nó đã kiểm tra và không có yêu cầu giữ bí mật.
test("ca thật từ production: không phủ nhận yêu cầu giữ bí mật đang nằm trong nội dung", () => {
  const text = "Chào chị, hồ sơ của chị đang bị treo, chị cần hoàn tất trong 30 phút nữa. "
    + "Chị đừng báo cho ai trong nhà nhé.";
  const result = evaluateRisk(inferSignalsFromText(text));
  const output = allText(result);

  assert.doesNotMatch(
    output,
    /Chưa thấy[^.]*giữ bí mật/i,
    `hệ thống phủ nhận yêu cầu giữ bí mật trong khi nội dung có câu "đừng báo cho ai trong nhà":\n  ${output}`
  );
});

test("kết quả rủi ro thấp nói rõ giới hạn của chính nó", () => {
  const result = evaluateRisk(normalizeSignals({}));
  const text = allText(result);
  // Phải có ít nhất một câu thừa nhận hệ thống có thể chưa biết hết.
  assert.match(
    text,
    /chưa nhận ra|chưa kể|chưa khẳng định|bất thường/i,
    `kết quả rủi ro thấp phải tự nói ra giới hạn của nó:\n  ${text}`
  );
});

// Ràng buộc bất biến của CLAUDE.md, kiểm luôn ở đây cho chắc.
test('không câu độn nào dùng chữ "an toàn"', () => {
  for (const result of [evaluateRisk(normalizeSignals({})), evaluateTransferRisk(normalizeTransferSignals({}))]) {
    assert.doesNotMatch(allText(result), /an toàn/i);
  }
});

// Đo được sau khi viết lại câu độn: một tình huống khớp ĐÚNG HAI quy tắc ra
// kết quả gồm hai dấu hiệu thật rồi một dòng "chưa nhận ra dấu hiệu nào" —
// dòng thứ ba phủ nhận thẳng hai dòng trên nó.
test("có dấu hiệu thật thì KHÔNG độn thêm câu trấn an cho đủ ba ô", () => {
  const result = evaluateRisk(normalizeSignals({
    ep_thoi_gian_khan_cap: true,
    yeu_cau_giu_bi_mat: true
  }));

  assert.equal(result.ly_do.length, 2, "hai dấu hiệu thật thì hiển thị đúng hai lý do");
  assert.doesNotMatch(
    result.ly_do.join(" "),
    /chưa nhận ra dấu hiệu/i,
    `kết quả tự mâu thuẫn — vừa nêu dấu hiệu vừa nói chưa nhận ra dấu hiệu nào:\n  ${result.ly_do.join("\n  ")}`
  );
});

test("không có dấu hiệu nào thì vẫn có đủ ba câu dè dặt", () => {
  const result = evaluateRisk(normalizeSignals({}));
  assert.equal(result.ly_do.length, 3);
});

test("mức rủi ro cao KHÔNG bị câu độn đẩy dấu hiệu thật ra ngoài", () => {
  const result = evaluateRisk(normalizeSignals({
    gia_danh_co_quan_nha_nuoc: true,
    yeu_cau_giu_bi_mat: true,
    doi_chuyen_tien_tai_khoan_ca_nhan: true
  }));
  assert.equal(result.muc_rui_ro, "Nguy hiểm cao");
  // Ba ô lý do phải là ba dấu hiệu thật, không có chỗ cho câu độn.
  assert.equal(result.ly_do.length, 3);
  assert.doesNotMatch(result.ly_do.join(" "), /Khoan Đã chưa nhận ra/);
});
