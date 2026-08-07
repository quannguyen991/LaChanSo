// ============================================================================
// PHIẾU TIN CẬY — mục 62 và 5.4 của báo cáo sản phẩm v2
//
// Đây là câu trả lời cho câu hỏi mà mọi ban giám khảo giải AI đều hỏi:
// "vì sao tin được kết quả của mô hình?"
//
// Ba thứ làm nên giá trị của phiếu, đừng bỏ thứ nào:
//
//   1. Mục "Chưa xác minh được" LUÔN hiển thị, kể cả khi rủi ro thấp.
//      Sự khiêm tốn hiển thị được là thứ xây niềm tin nhanh nhất với người
//      cao tuổi. Một hệ thống nói "tôi chắc chắn" về mọi thứ trông giống
//      hệt kẻ lừa đảo.
//   2. Ghi rõ ranh giới giữa phần AI làm và phần bộ luật làm.
//   3. Xuất được thành ảnh để gửi vào nhóm Zalo gia đình.
//
// ---------------------------------------------------------------------------
// RÀNG BUỘC AN TOÀN — phiếu này được thiết kế để CHIA SẺ RA NGOÀI
//
// Phiếu sẽ đi vào nhóm chat gia đình, có thể sang cả máy người khác. Vì vậy
// nó KHÔNG BAO GIỜ được mang theo: mã OTP · mật khẩu · mã PIN · số tài khoản
// đầy đủ. Mọi trường chữ đi qua redactSensitive() trước khi ra khỏi file này.
// Test test/trust-receipt.test.js khoá điều đó.
// ---------------------------------------------------------------------------
// ============================================================================

const MAX_FINDINGS = 3;

// Nhãn mức rủi ro là BẤT BIẾN. Nguồn sự thật là src/rule-engine.js.
// Ở đây chỉ đọc vào, tuyệt đối không đặt lại tên — đặc biệt KHÔNG BAO GIỜ
// đổi nhãn thấp thành "An toàn".
const RISK_LABELS = new Set([
  "Nguy hiểm cao",
  "Nghi ngờ",
  "Chưa thấy dấu hiệu rủi ro"
]);

const AI_BOUNDARY = {
  aiLam: "AI đọc nội dung bác gửi và trích xuất tín hiệu — nó không chấm mức rủi ro.",
  boLuatLam: "Mức rủi ro do các quy tắc cố định trong ứng dụng quyết định, có kiểm thử đầy đủ.",
  khiAiHong: "Khi AI không phản hồi, bộ luật vẫn chạy trên văn bản thô và vẫn cho kết quả."
};

// Câu này bám sát ràng buộc ngôn ngữ ở Phần 7.1: không bao giờ dùng chữ
// "an toàn", và luôn nói rõ kết quả không phải một lời hứa.
const ALWAYS_UNVERIFIED = [
  "Danh tính thật của người liên hệ — Khoan Đã không gọi kiểm chứng thay bác được.",
  "Kết quả này chỉ dựa trên phần bác đưa vào, và không bảo đảm người gửi là đáng tin."
];

/**
 * Che thông tin không được rời khỏi máy người dùng.
 *
 * Thứ tự các bước có chủ đích: che mã OTP TRƯỚC, vì một mã 6 số đứng cạnh chữ
 * "OTP" cũng khớp luôn mẫu số tài khoản nếu chạy ngược lại.
 */
function redactSensitive(value) {
  let text = String(value ?? "");

  // Mã OTP / mã xác nhận / mã PIN đi kèm chữ dẫn -> xoá hẳn phần số.
  text = text.replace(
    /((?:otp|mã\s*otp|ma\s*otp|mã\s*xác\s*nhận|ma\s*xac\s*nhan|mã\s*pin|ma\s*pin|pin|mật\s*khẩu|mat\s*khau|password)\s*(?:là|la|:|=)?\s*)(\d{4,8})\b/gi,
    "$1••••"
  );

  // Số tài khoản (8–19 chữ số, cho phép dấu cách/gạch nhóm) -> chỉ giữ 4 số cuối.
  //
  // Hai ngoại lệ, đều đã cắn trong test:
  //   • "45.000.000đ" là SỐ TIỀN, không phải tài khoản. Nhóm ba chữ số ngăn
  //     bằng dấu chấm/phẩy là cách viết tiền của tiếng Việt.
  //   • "1900 545413" là TỔNG ĐÀI. Che nó đi thì người thân không gọi được
  //     ngân hàng — đúng thứ phiếu này đang cố giúp họ làm.
  // Che nhầm ở đây không nguy hiểm, nhưng làm phiếu vô dụng. Để lọt số tài
  // khoản thì mới nguy hiểm — nên mọi trường hợp còn lại đều che.
  const THOUSANDS_GROUPED = /^\d{1,3}(?:[.,]\d{3})+$/;
  const VN_HOTLINE_PREFIX = /^1[89]00/;

  text = text.replace(/\b(\d[\d\s.-]{6,24}\d)\b/g, (match) => {
    const digits = match.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 19) return match;
    if (THOUSANDS_GROUPED.test(match.trim())) return match;
    if (VN_HOTLINE_PREFIX.test(digits)) return match;
    return `${"*".repeat(Math.max(4, digits.length - 4))}${digits.slice(-4)}`;
  });

  // Mã OTP trần 6 số đứng một mình cạnh ngữ cảnh mã xác nhận.
  text = text.replace(/\b(\d{6})\b(?=[^\d]{0,24}(?:otp|xác nhận|xac nhan))/gi, "••••••");

  return text;
}

function cleanList(values, limit) {
  const seen = new Set();
  const out = [];
  for (const raw of values || []) {
    const value = redactSensitive(raw).trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
    if (limit && out.length >= limit) break;
  }
  return out;
}

function normalizeRiskLabel(label) {
  return RISK_LABELS.has(label) ? label : "Chưa thấy dấu hiệu rủi ro";
}

/**
 * Dựng Phiếu tin cậy từ một kết quả phân tích.
 *
 * Hàm thuần: `now` phải được truyền vào, không đọc đồng hồ hệ thống, để phiếu
 * dựng lại được y hệt trong test và trong bộ đánh giá.
 *
 * @param {object} input
 * @param {object} input.result kết quả từ rule-engine (muc_rui_ro, ly_do, ...)
 * @param {object} [input.structuredResult] kết quả có cấu trúc, nếu có
 * @param {object} [input.intervention] mức can thiệp từ intervention-ladder
 * @param {object|null} [input.criticalOverride]
 * @param {boolean} [input.aiUnavailable]
 * @param {string|Date} [input.now]
 */
function buildTrustReceipt({
  result = {},
  structuredResult = null,
  intervention = null,
  criticalOverride = null,
  aiUnavailable = false,
  now = new Date(0)
} = {}) {
  const mucCanhBao = normalizeRiskLabel(result.muc_rui_ro);

  const daPhatHien = cleanList(
    [
      criticalOverride?.label,
      ...(result.chien_thuat_thao_tung || []).map((tactic) => tactic.label),
      ...(result.ly_do || [])
    ],
    MAX_FINDINGS
  );

  const chuaXacMinhDuoc = cleanList(
    [
      ...(structuredResult?.limitations || []),
      ...ALWAYS_UNVERIFIED
    ],
    4
  );

  const nenLamNgay = cleanList(result.hanh_dong || [], MAX_FINDINGS);

  return {
    version: 1,
    mucCanhBao,
    thoiDiem: new Date(now).toISOString(),

    daPhatHien,
    // Bất biến: luôn có ít nhất một dòng ở đây, kể cả khi rủi ro thấp.
    chuaXacMinhDuoc,

    cachKetLuan: {
      ...AI_BOUNDARY,
      aiDaChay: !aiUnavailable,
      ghiChu: aiUnavailable
        ? "Lần này AI không phản hồi. Kết quả hoàn toàn do bộ luật trong máy đưa ra."
        : null,
      soQuyTacDaApDung: Number(result.diem) > 0 ? (result.ly_do || []).length : 0,
      criticalOverride: criticalOverride
        ? { id: criticalOverride.id, label: redactSensitive(criticalOverride.label) }
        : null
    },

    nenLamNgay,
    mucCanThiep: intervention ? { level: intervention.level, ten: intervention.ten } : null,

    // Nguồn tĩnh đã duyệt — không bao giờ lấy nguồn từ chính nội dung đáng ngờ.
    nguonDuLieu: cleanList(result.trich_dan || [], 2),

    // Nhắc lại ở cấp dữ liệu, để bản xuất ảnh không thể quên mất câu này.
    luuY: "Kết quả này không bảo đảm người gửi là đáng tin."
  };
}

/** Dòng chữ đem đi chia sẻ. Đã che dữ liệu nhạy cảm sẵn. */
function trustReceiptToShareText(receipt) {
  const lines = [
    "PHIẾU TIN CẬY — Khoan Đã",
    `Mức cảnh báo: ${receipt.mucCanhBao}`,
    ""
  ];

  if (receipt.daPhatHien.length > 0) {
    lines.push("Đã phát hiện:");
    for (const item of receipt.daPhatHien) lines.push(`• ${item}`);
    lines.push("");
  }

  lines.push("Chưa xác minh được:");
  for (const item of receipt.chuaXacMinhDuoc) lines.push(`• ${item}`);
  lines.push("");

  lines.push("Cách kết luận:");
  lines.push(`• ${receipt.cachKetLuan.aiLam}`);
  lines.push(`• ${receipt.cachKetLuan.boLuatLam}`);

  if (receipt.nenLamNgay.length > 0) {
    lines.push("");
    lines.push("Nên làm ngay:");
    for (const item of receipt.nenLamNgay) lines.push(`• ${item}`);
  }

  lines.push("");
  lines.push(receipt.luuY);

  return redactSensitive(lines.join("\n"));
}

module.exports = {
  MAX_FINDINGS,
  ALWAYS_UNVERIFIED,
  redactSensitive,
  buildTrustReceipt,
  trustReceiptToShareText
};
