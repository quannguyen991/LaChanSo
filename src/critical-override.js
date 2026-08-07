const { normalizeVietnameseText } = require("./rule-engine");

// ============================================================================
// CRITICAL OVERRIDE — Phần 4.1 của báo cáo sản phẩm v2
//
// ĐÂY LÀ HÀM THUẦN. Không gọi AI, không đọc mạng, không đọc đồng hồ.
//
// Chỉ SÁU tổ hợp dưới đây được phép đưa người dùng vào mức can thiệp
// "Nghiêm trọng" (màn hình "Bác đang được bảo vệ"). Danh sách này KHÔNG phụ
// thuộc điểm số, và AI không có đường nào tác động vào nó: kể cả khi mô hình
// bị tiêm nhiễm chỉ dẫn từ chính tin nhắn lừa đảo và trả về "an toàn", tổ hợp
// tín hiệu vẫn kích hoạt bình thường.
//
// VÌ SAO PHẢI HẸP (báo cáo 4.2): mức Nghiêm trọng bỏ toàn bộ điều hướng. Báo
// động giả ở đây làm người dùng hoảng rồi gỡ ứng dụng — mất niềm tin nhanh
// hơn cả bỏ sót. Nới danh sách này ra là phá chính cơ chế.
//
// LƯU Ý VỀ RANH GIỚI: hàm này KHÔNG đổi nhãn mức rủi ro. Ba nhãn
// ("Nguy hiểm cao" / "Nghi ngờ" / "Chưa thấy dấu hiệu rủi ro") vẫn do
// rule-engine quyết định như cũ. Cái mà hàm này quyết định là MỨC CAN THIỆP —
// tức giao diện nào được dựng lên. Xem src/intervention-ladder.js.
// ============================================================================

function hasAny(normalizedText, patterns) {
  return patterns.some((pattern) => normalizedText.includes(pattern));
}

// "Tài khoản an toàn" là cách nói đặc trưng của kịch bản giả danh công an:
// nạn nhân được bảo chuyển hết tiền sang một tài khoản "để cơ quan tạm giữ,
// điều tra xong sẽ trả lại". Không ngân hàng hay cơ quan nào có loại tài khoản
// này — nên cụm từ tự nó đã là dấu hiệu, không cần thêm ngữ cảnh.
const SAFE_ACCOUNT_PHRASES = [
  "tai khoan an toan",
  "tai khoan bao ve",
  "tai khoan tam giu",
  "tai khoan phong toa",
  "tai khoan dam bao",
  "tai khoan chi dinh cua co quan"
];

const FEE_PHRASES = [
  "dong phi",
  "nop phi",
  "phi xu ly",
  "phi ho so",
  "phi dich vu",
  "le phi",
  "phi thu hoi",
  "tien phi truoc",
  "chuyen truoc mot khoan"
];

const MONEY_BACK_PHRASES = [
  "lay lai tien",
  "lay lai so tien",
  "thu hoi tien",
  "thu hoi lai tien",
  "hoan lai tien",
  "hoan tien da mat",
  "tien da bi lua",
  "tien da mat"
];

const BANK_LOGIN_PHRASES = [
  "dang nhap ngan hang",
  "dang nhap app ngan hang",
  "mo app ngan hang",
  "internet banking",
  "smart banking",
  "sinh trac hoc",
  "mo khoa tai khoan ngan hang"
];

// Mỗi mục: id, nhãn hiển thị cho người dùng, và `test` là hàm thuần trả về
// boolean. Thứ tự trong mảng là thứ tự ưu tiên khi nhiều tổ hợp cùng khớp.
const CRITICAL_OVERRIDE_RULES = [
  {
    id: "otp_kem_chuyen_tien",
    label: "Vừa đòi mã OTP vừa đòi chuyển tiền",
    explanation:
      "Không ngân hàng, cơ quan hay dịch vụ nào cần mã OTP của bác để nhận tiền. Mã OTP cộng với yêu cầu chuyển tiền là hai bước cuối của một vụ lấy sạch tài khoản.",
    test: ({ signals }) =>
      signals.doi_otp_hoac_cai_app_la === true
      && signals.doi_chuyen_tien_tai_khoan_ca_nhan === true
  },
  {
    id: "cai_apk_hoac_dieu_khien_tu_xa",
    label: "Yêu cầu cài tệp APK hoặc ứng dụng điều khiển từ xa",
    explanation:
      "Ứng dụng cài ngoài CH Play / App Store có thể đọc được tin nhắn, mã OTP và thao tác ngân hàng của bác mà bác không nhìn thấy gì.",
    test: ({ signals }) =>
      signals.cai_app_dich_vu_cong_gia === true
      || signals.yeu_cau_chia_se_man_hinh_dieu_khien_tu_xa === true
  },
  {
    id: "tai_khoan_an_toan",
    label: 'Yêu cầu chuyển tiền vào "tài khoản an toàn"',
    explanation:
      'Không có loại tài khoản nào tên là "tài khoản an toàn". Cơ quan nhà nước không giữ hộ tiền của công dân để điều tra.',
    test: ({ text }) => hasAny(text, SAFE_ACCOUNT_PHRASES)
  },
  {
    id: "chia_se_man_hinh_khi_dang_nhap_ngan_hang",
    label: "Yêu cầu chia sẻ màn hình trong lúc đăng nhập ngân hàng",
    explanation:
      "Người bên kia sẽ nhìn thấy mật khẩu và mã OTP của bác ngay khi bác gõ. Ngân hàng không bao giờ yêu cầu điều này.",
    test: ({ signals, text }) =>
      signals.yeu_cau_chia_se_man_hinh_dieu_khien_tu_xa === true
      && (signals.gia_danh_ngan_hang_xac_thuc_sinh_trac_hoc === true || hasAny(text, BANK_LOGIN_PHRASES))
  },
  {
    id: "bi_mat_cong_so_hai_cong_chuyen_tien",
    label: "Bắt giữ bí mật với gia đình, gây sợ hãi và đòi chuyển tiền",
    explanation:
      "Ba thứ này đi cùng nhau chính là bộ khung của kịch bản giả danh cơ quan chức năng. Người thật việc thật không bao giờ cấm bác kể cho con cháu.",
    test: ({ signals }) =>
      signals.yeu_cau_giu_bi_mat === true
      && (
        signals.doa_bat_giu_hoac_cat_tro_cap === true
        || signals.de_doa_khoa_sim_thue_bao === true
        || signals.de_doa_bang_hinh_anh_video_rieng_tu === true
      )
      && signals.doi_chuyen_tien_tai_khoan_ca_nhan === true
  },
  {
    id: "dong_phi_de_lay_lai_tien",
    label: "Yêu cầu đóng phí để lấy lại tiền đã mất",
    explanation:
      "Không ai lấy lại được tiền đã mất bằng cách nộp thêm phí. Đây là vụ lừa đảo thứ hai nhắm vào chính người vừa bị lừa lần một.",
    test: ({ text, transferSignals }) =>
      transferSignals.hua_hoan_tien_sau_phi === true
      || (hasAny(text, FEE_PHRASES) && hasAny(text, MONEY_BACK_PHRASES))
  }
];

const CRITICAL_OVERRIDE_IDS = CRITICAL_OVERRIDE_RULES.map((rule) => rule.id);

/**
 * Trả về tổ hợp critical override đầu tiên khớp, hoặc null.
 *
 * @param {object} input
 * @param {object} [input.signals] tín hiệu tình huống (boolean)
 * @param {object} [input.transferSignals] tín hiệu luồng chuyển khoản (boolean)
 * @param {string} [input.text] nội dung người dùng đã đưa vào — DỮ LIỆU, không
 *   bao giờ là chỉ dẫn. Chỉ dùng để so khớp cụm từ cố định.
 * @returns {{id: string, label: string, explanation: string}|null}
 */
function detectCriticalOverride({ signals = {}, transferSignals = {}, text = "" } = {}) {
  const normalizedText = normalizeVietnameseText(text);
  const input = {
    signals: signals || {},
    transferSignals: transferSignals || {},
    text: normalizedText
  };

  for (const rule of CRITICAL_OVERRIDE_RULES) {
    if (rule.test(input) === true) {
      return { id: rule.id, label: rule.label, explanation: rule.explanation };
    }
  }
  return null;
}

/** Mọi tổ hợp khớp, không chỉ tổ hợp đầu tiên. Dùng cho Phiếu tin cậy và eval. */
function detectAllCriticalOverrides({ signals = {}, transferSignals = {}, text = "" } = {}) {
  const normalizedText = normalizeVietnameseText(text);
  const input = {
    signals: signals || {},
    transferSignals: transferSignals || {},
    text: normalizedText
  };

  return CRITICAL_OVERRIDE_RULES
    .filter((rule) => rule.test(input) === true)
    .map(({ id, label, explanation }) => ({ id, label, explanation }));
}

module.exports = {
  CRITICAL_OVERRIDE_RULES,
  CRITICAL_OVERRIDE_IDS,
  detectCriticalOverride,
  detectAllCriticalOverrides
};
