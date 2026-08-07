// ============================================================================
// THANG CAN THIỆP 5 MỨC — Phần 4 và mục 56 của báo cáo sản phẩm v2
//
// VẤN ĐỀ ĐANG SỬA: trước bản này có bốn cơ chế can thiệp chồng chéo nhau
// (Dừng 60 giây, Decision Firewall, One Tap Rescue, Bảo vệ 72 giờ) và không
// chỗ nào nói cơ chế nào chạy khi nào. Kết quả là hai màn hình khủng hoảng
// cạnh tranh nhau trên cùng một tình huống.
//
// Từ nay CHỈ CÓ MỘT THANG. Một tình huống ra đúng một mức.
//
// ---------------------------------------------------------------------------
// RANH GIỚI VỚI NHÃN MỨC RỦI RO — đọc kỹ trước khi sửa
//
// "Mức rủi ro" và "mức can thiệp" là hai thứ khác nhau:
//
//   Mức rủi ro   = Khoan Đã ĐÁNH GIÁ tình huống thế nào.
//                  Ba nhãn bất biến, do src/rule-engine.js quyết định.
//   Mức can thiệp = Khoan Đã DỰNG GIAO DIỆN nào lên.
//                  Năm mức, do file này quyết định.
//
// File này KHÔNG được đổi nhãn mức rủi ro và không có đường nào để làm vậy —
// nó chỉ đọc nhãn đó vào.
// ---------------------------------------------------------------------------
//
// QUY ĐỔI ĐIỂM: báo cáo ghi ngưỡng 20–44 và 45–69 trên thang 0–100, còn
// rule-engine cộng trọng số 1–3 nên `diem` thực tế chạy khoảng 0–12. Hằng số
// dưới đây quy đổi giữa hai thang sao cho ranh giới TRÙNG KHỚP với ranh giới
// classifyScore() đang dùng (diem 2 -> "Nghi ngờ", diem 4 -> "Nguy hiểm cao"):
//
//   diem 1 -> 13   (dưới 20  -> mức Thấp)
//   diem 2 -> 25   (20–44    -> mức Trung bình)   khớp classifyScore
//   diem 3 -> 38   (20–44    -> mức Trung bình)
//   diem 4 -> 50   (45–69    -> mức Cao)          khớp classifyScore
//
// Đổi hằng số này là đổi ranh giới của cả hai thang cùng lúc. Đừng đổi lẻ.
// ============================================================================

const SCORE_SCALE = 12.5;

const BAND_MEDIUM_MIN = 20;
const BAND_HIGH_MIN = 45;

const LEVELS = {
  PHIEU_TIN_CAY: "phieu_tin_cay",
  DUONG_XAC_MINH: "duong_xac_minh",
  DUNG_60_GIAY: "dung_60_giay",
  DUOC_BAO_VE: "duoc_bao_ve",
  PHUC_HOI: "phuc_hoi"
};

// Thứ tự này là thứ tự TĂNG DẦN của mức can thiệp. Dùng để so sánh, và để
// bảo đảm quy tắc "chỉ được làm tăng cảnh giác, không bao giờ giảm".
const LEVEL_ORDER = [
  LEVELS.PHIEU_TIN_CAY,
  LEVELS.DUONG_XAC_MINH,
  LEVELS.DUNG_60_GIAY,
  LEVELS.DUOC_BAO_VE,
  LEVELS.PHUC_HOI
];

const LEVEL_DETAILS = {
  [LEVELS.PHIEU_TIN_CAY]: {
    level: LEVELS.PHIEU_TIN_CAY,
    ten: "Phiếu tin cậy",
    mucDo: "Thấp",
    nguoiDungThay: "Thẻ kết quả giải thích rõ điều gì đã kiểm tra, điều gì chưa xác minh được.",
    route: null,
    boDieuHuong: false
  },
  [LEVELS.DUONG_XAC_MINH]: {
    level: LEVELS.DUONG_XAC_MINH,
    ten: "Đường xác minh",
    mucDo: "Trung bình",
    nguoiDungThay: "Các bước xác minh qua kênh chính thức, kèm nút gọi tổng đài đã kiểm chứng.",
    route: "#xac-minh",
    boDieuHuong: false
  },
  [LEVELS.DUNG_60_GIAY]: {
    level: LEVELS.DUNG_60_GIAY,
    ten: "Dừng 60 giây",
    mucDo: "Cao",
    nguoiDungThay: "Đếm ngược 60 giây, câu nói từ chối, nút gọi người thân.",
    route: null,
    boDieuHuong: false
  },
  [LEVELS.DUOC_BAO_VE]: {
    level: LEVELS.DUOC_BAO_VE,
    ten: "Bác đang được bảo vệ",
    mucDo: "Nghiêm trọng",
    nguoiDungThay: "Bỏ toàn bộ điều hướng. Ba điều không làm, một nút gọi người thân đích danh, một lối thoát.",
    route: "#duoc-bao-ve",
    boDieuHuong: true
  },
  [LEVELS.PHUC_HOI]: {
    level: LEVELS.PHUC_HOI,
    ten: "Phục hồi và bảo vệ 72 giờ",
    mucDo: "Đã mất tiền",
    nguoiDungThay: "Trợ lý cuộc gọi ngân hàng, danh sách việc cần làm, cảnh báo lừa lần hai.",
    route: "#vua-chuyen-tien",
    boDieuHuong: false
  }
};

/** Quy đổi `diem` của rule-engine sang thang 0–100 mà báo cáo dùng. */
function normalizeScore(rawScore) {
  const score = Number(rawScore);
  if (!Number.isFinite(score) || score <= 0) return 0;
  return Math.min(100, Math.round(score * SCORE_SCALE));
}

/**
 * Quyết định mức can thiệp. Hàm thuần.
 *
 * @param {object} input
 * @param {string} [input.riskLabel] một trong ba nhãn bất biến của rule-engine.
 * @param {number} [input.score] `diem` thô từ rule-engine.
 * @param {object|null} [input.criticalOverride] kết quả detectCriticalOverride().
 * @param {boolean} [input.moneyAlreadySent] người dùng TỰ KHAI đã chuyển tiền.
 *   Chỉ người dùng mới đặt được cờ này — hệ thống không suy đoán.
 * @returns {object} chi tiết mức can thiệp, kèm normalizedScore để hiển thị.
 */
function resolveInterventionLevel({
  riskLabel = "",
  score = 0,
  criticalOverride = null,
  moneyAlreadySent = false
} = {}) {
  const normalizedScore = normalizeScore(score);
  const level = pickLevel({ riskLabel, normalizedScore, criticalOverride, moneyAlreadySent });

  return {
    ...LEVEL_DETAILS[level],
    // Chuỗi màn hình đi kèm mức, để giao diện không phải tự suy ra thứ tự.
    manHinh: screensFor(level),
    normalizedScore,
    criticalOverride: criticalOverride ? { ...criticalOverride } : null,
    // Mọi lần phân tích đều tạo phiếu — kể cả ở mức cao nhất (báo cáo, Phần 4).
    luonSinhPhieuTinCay: true
  };
}

function pickLevel({ riskLabel, normalizedScore, criticalOverride, moneyAlreadySent }) {
  // Đã mất tiền là trạng thái của người dùng, không phải mức rủi ro. Nó thắng
  // mọi thứ khác: đếm ngược và cảnh báo lúc này chỉ là trách móc người vừa mất
  // tiền, còn việc cần làm là gọi ngân hàng trong vài phút vàng đầu tiên.
  if (moneyAlreadySent === true) return LEVELS.PHUC_HOI;

  // Mức Nghiêm trọng CHỈ tới từ critical override, KHÔNG bao giờ từ điểm số.
  if (criticalOverride) return LEVELS.DUOC_BAO_VE;

  if (riskLabel === "Nguy hiểm cao" || normalizedScore >= BAND_HIGH_MIN) return LEVELS.DUNG_60_GIAY;
  if (riskLabel === "Nghi ngờ" || normalizedScore >= BAND_MEDIUM_MIN) return LEVELS.DUONG_XAC_MINH;
  return LEVELS.PHIEU_TIN_CAY;
}

// Mục 56: "Dừng 60 giây là màn hình đầu tiên của mức nghiêm trọng. Hết thời
// gian hoặc bấm bỏ qua thì chuyển thẳng sang màn hình bảo vệ. Không triển khai
// thành hai tính năng rời."
//
// Bảng dưới đây mã hoá đúng câu đó: mức Nghiêm trọng có HAI màn hình nối tiếp,
// còn mức Cao chỉ có một. Đếm ngược không phải một tính năng độc lập — nó là
// màn hình số 1 của mức Nghiêm trọng, và cũng là màn hình duy nhất của mức Cao.
//
// CẨN THẬN: bản đầu của file này viết "hết giờ thì lên mức Nghiêm trọng" cho
// MỌI ca mức Cao. Như vậy là điểm số tự leo lên màn hình bỏ hết điều hướng —
// phá đúng ràng buộc trung tâm của Phần 4.
const SCREEN_SEQUENCE = {
  [LEVELS.PHIEU_TIN_CAY]: [LEVELS.PHIEU_TIN_CAY],
  [LEVELS.DUONG_XAC_MINH]: [LEVELS.DUONG_XAC_MINH],
  [LEVELS.DUNG_60_GIAY]: [LEVELS.DUNG_60_GIAY],
  [LEVELS.DUOC_BAO_VE]: [LEVELS.DUNG_60_GIAY, LEVELS.DUOC_BAO_VE],
  [LEVELS.PHUC_HOI]: [LEVELS.PHUC_HOI]
};

/** Chuỗi màn hình của một mức can thiệp, theo thứ tự người dùng gặp. */
function screensFor(level) {
  return [...(SCREEN_SEQUENCE[level] || [LEVELS.PHIEU_TIN_CAY])];
}

/**
 * Màn hình kế tiếp khi đếm ngược hết giờ hoặc người dùng bấm bỏ qua.
 *
 * @param {string} level mức can thiệp đã giải xong (KHÔNG phải màn hình hiện tại)
 * @param {string} currentScreen màn hình đang hiển thị
 * @returns {string|null} màn hình kế tiếp, hoặc null nếu đã là màn cuối
 */
function nextScreenAfterCountdown(level, currentScreen) {
  const screens = screensFor(level);
  const index = screens.indexOf(currentScreen);
  if (index < 0 || index >= screens.length - 1) return null;
  return screens[index + 1];
}

/** So sánh hai mức. Dùng để bảo đảm không bao giờ hạ mức can thiệp xuống. */
function isAtLeast(level, minimumLevel) {
  return LEVEL_ORDER.indexOf(level) >= LEVEL_ORDER.indexOf(minimumLevel);
}

module.exports = {
  LEVELS,
  LEVEL_ORDER,
  LEVEL_DETAILS,
  BAND_MEDIUM_MIN,
  BAND_HIGH_MIN,
  normalizeScore,
  resolveInterventionLevel,
  SCREEN_SEQUENCE,
  screensFor,
  nextScreenAfterCountdown,
  isAtLeast
};
