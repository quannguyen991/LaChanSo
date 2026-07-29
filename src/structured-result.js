const { classifyJourney } = require("./journey-engine");

const RISK_LEVELS = {
  "Chưa thấy dấu hiệu rủi ro": "low",
  "Nghi ngờ": "medium",
  "Nguy hiểm cao": "high"
};

const CRITICAL_SIGNAL_KEYS = new Set([
  "doi_otp_hoac_cai_app_la",
  "yeu_cau_chia_se_man_hinh_dieu_khien_tu_xa",
  "de_doa_bang_hinh_anh_video_rieng_tu",
  "cai_app_dich_vu_cong_gia"
]);

const SIGNAL_SCAM_TYPES = {
  gia_danh_co_quan_nha_nuoc: "Giả danh cơ quan",
  doi_chuyen_tien_tai_khoan_ca_nhan: "Yêu cầu chuyển tiền đáng ngờ",
  ep_thoi_gian_khan_cap: "Tạo khẩn cấp",
  doa_bat_giu_hoac_cat_tro_cap: "Đe dọa",
  yeu_cau_giu_bi_mat: "Yêu cầu giữ bí mật",
  doi_otp_hoac_cai_app_la: "Xin OTP hoặc cài app lạ",
  tu_xung_nguoi_than_nhung_dang_ngo: "Giả người thân",
  yeu_cau_chia_se_man_hinh_dieu_khien_tu_xa: "Chiếm quyền thiết bị",
  dau_tu_loi_nhuan_cao_dam_bao: "Đầu tư lợi nhuận cao",
  lam_nhiem_vu_chot_don_hoa_hong: "Việc làm/nhiệm vụ nạp tiền",
  ep_mua_them_hop_dong_de_thoat_hop_dong_cu: "Lừa thu hồi tiền hoặc hợp đồng",
  cai_app_dich_vu_cong_gia: "Ứng dụng giả mạo",
  de_doa_khoa_sim_thue_bao: "Dọa khóa thuê bao",
  gia_danh_ngan_hang_xac_thuc_sinh_trac_hoc: "Giả danh ngân hàng"
};

const SIGNAL_NEXT_STEPS = {
  doi_otp_hoac_cai_app_la: {
    label: "đọc mã OTP hoặc mã xác nhận",
    reason: "Nội dung đã nhắc tới OTP, mã xác nhận hoặc ứng dụng lạ."
  },
  yeu_cau_chia_se_man_hinh_dieu_khien_tu_xa: {
    label: "chia sẻ màn hình hoặc cài ứng dụng điều khiển từ xa",
    reason: "Đây là bước thường dùng để chiếm quyền điện thoại."
  },
  cai_app_dich_vu_cong_gia: {
    label: "cài APK hoặc ứng dụng ngoài cửa hàng chính thức",
    reason: "Nội dung có dấu hiệu dẫn bác sang ứng dụng giả mạo."
  },
  yeu_cau_giu_bi_mat: {
    label: "không nói với người thân",
    reason: "Yêu cầu giữ bí mật thường xuất hiện trước yêu cầu tiền hoặc thông tin."
  },
  doi_chuyen_tien_tai_khoan_ca_nhan: {
    label: "chuyển thêm tiền hoặc chuyển thử một khoản nhỏ",
    reason: "Đã có dấu hiệu yêu cầu chuyển tiền."
  },
  dau_tu_loi_nhuan_cao_dam_bao: {
    label: "đóng thêm phí để rút tiền hoặc nhận lợi nhuận",
    reason: "Các lời hứa lợi nhuận cao thường chuyển sang yêu cầu nộp phí."
  },
  lam_nhiem_vu_chot_don_hoa_hong: {
    label: "nạp tiền để làm nhiệm vụ tiếp theo",
    reason: "Mô hình nhiệm vụ thường tăng dần số tiền phải nạp."
  }
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function mapRiskLevel(result, signals) {
  if (result.muc_rui_ro !== "Nguy hiểm cao") return RISK_LEVELS[result.muc_rui_ro] || "low";
  return Object.entries(signals || {}).some(([key, value]) => value === true && CRITICAL_SIGNAL_KEYS.has(key))
    ? "critical"
    : "high";
}

function boundedConfidence(result, hasReadableText) {
  const score = Number(result.diem || 0);
  if (!hasReadableText) return 0.45;
  if (result.muc_rui_ro === "Nguy hiểm cao") return Math.min(0.94, 0.74 + score * 0.04);
  if (result.muc_rui_ro === "Nghi ngờ") return Math.min(0.82, 0.58 + score * 0.05);
  return 0.52;
}

function makeJourneyEvents(signals, entities) {
  const events = [{ type: "khac", signals }];
  if (entities.some((entity) => entity.type === "url" || entity.type === "qr_hint")) {
    events.push({ type: "link_duoc_gui", signals });
  }
  if (signals?.yeu_cau_giu_bi_mat === true) events.push({ type: "yeu_cau_giu_bi_mat", signals });
  if (signals?.doi_otp_hoac_cai_app_la === true || signals?.cai_app_dich_vu_cong_gia === true) {
    events.push({ type: "yeu_cau_cai_app", signals });
  }
  if (signals?.doi_chuyen_tien_tai_khoan_ca_nhan === true || entities.some((entity) => entity.type === "bank_account" || entity.type === "money_amount")) {
    events.push({ type: "yeu_cau_chuyen_thu", signals });
  }
  return events;
}

function extractEntities(text) {
  const content = String(text || "");
  const entities = [];
  const urlMatches = content.match(/\bhttps?:\/\/[^\s<>"']+/gi) || [];
  for (const url of urlMatches.slice(0, 5)) {
    entities.push({ type: "url", value: url.replace(/[),.;]+$/, ""), sensitive: false });
  }

  const phoneMatches = content.match(/(?:\+84|0)(?:[\s.-]?\d){8,10}\b/g) || [];
  for (const phone of phoneMatches.slice(0, 5)) {
    entities.push({ type: "phone", value: phone.trim(), sensitive: true });
  }

  const moneyMatches = content.match(/\b\d{1,3}(?:[.,]\d{3})*(?:\s?)(?:đ|dong|vnd|triệu|trieu|nghìn|nghin|k)\b/gi) || [];
  for (const amount of moneyMatches.slice(0, 5)) {
    entities.push({ type: "money_amount", value: amount.trim(), sensitive: true });
  }

  const accountMatches = content.match(/\b\d{8,19}\b/g) || [];
  for (const account of accountMatches.filter((value) => !phoneMatches.some((phone) => phone.includes(value))).slice(0, 5)) {
    entities.push({ type: "bank_account", value: account, sensitive: true });
  }

  if (/\b(?:otp|mã xác nhận|ma xac nhan|smart otp)\b/i.test(content)) {
    entities.push({ type: "otp_mention", value: "Có nhắc tới mã OTP hoặc mã xác nhận", sensitive: true });
  }
  if (/\b(?:qr|mã qr|ma qr|quét mã|quet ma)\b/i.test(content)) {
    entities.push({ type: "qr_hint", value: "Có nhắc tới mã QR", sensitive: false });
  }

  return entities;
}

function buildPredictedNextSteps(signals, journey, entities) {
  const bySignal = Object.entries(signals || {})
    .filter(([, value]) => value === true)
    .map(([key]) => SIGNAL_NEXT_STEPS[key]);

  const byEntity = [];
  if (entities.some((entity) => entity.type === "url" || entity.type === "qr_hint")) {
    byEntity.push({
      label: "bấm link, quét QR hoặc mở trang đăng nhập giả",
      reason: "Nội dung có đường link hoặc nhắc tới mã QR."
    });
  }
  if (journey.giai_doan === "yeu_cau_chuyen_tien") {
    byEntity.push({
      label: "chuyển thêm tiền với một lý do mới",
      reason: "Vụ việc đã ở giai đoạn yêu cầu chuyển tiền."
    });
  }
  byEntity.push({
    label: journey.du_doan_buoc_tiep_theo,
    reason: "Dựa trên giai đoạn hiện tại của vụ việc."
  });

  return unique([...bySignal, ...byEntity].map((step) => step && JSON.stringify(step)))
    .slice(0, 3)
    .map((step) => JSON.parse(step));
}

function buildNextQuestion(result, signals, entities) {
  if (signals?.doi_chuyen_tien_tai_khoan_ca_nhan === true || entities.some((entity) => entity.type === "bank_account")) {
    return {
      question: "Bác đã bấm chuyển tiền chưa?",
      reason: "Câu này giúp Khoan Đã chọn đúng luồng dừng giao dịch hoặc xử lý sau chuyển tiền."
    };
  }
  if (signals?.doi_otp_hoac_cai_app_la === true) {
    return {
      question: "Bác đã đọc mã OTP hoặc cài ứng dụng nào theo hướng dẫn chưa?",
      reason: "Nếu đã làm, bác cần ưu tiên bảo vệ tài khoản và thiết bị."
    };
  }
  if (result.muc_rui_ro === "Chưa thấy dấu hiệu rủi ro") {
    return {
      question: "Người liên hệ có yêu cầu bác chuyển tiền, giữ bí mật hoặc cung cấp mã xác nhận không?",
      reason: "Kết quả thấp không bảo đảm người gửi đáng tin nếu còn thiếu thông tin."
    };
  }
  return {
    question: "Bác có thể gửi thêm ảnh chụp tin nhắn hoặc đường link họ gửi không?",
    reason: "Thông tin bổ sung giúp kiểm tra dấu hiệu rõ hơn."
  };
}

function dataStatus(text, hasMedia, result) {
  if (!text && hasMedia) return "Ảnh chưa đọc rõ.";
  if (!text) return "Cần thêm thông tin.";
  if (result.muc_rui_ro === "Chưa thấy dấu hiệu rủi ro") return "Cần thêm thông tin.";
  return "Đủ dữ liệu để phân tích.";
}

function buildLimitations({ text, hasMedia, aiUnavailable, entities }) {
  const limitations = [
    "Kết quả này dựa trên nội dung bác cung cấp và không bảo đảm người gửi là đáng tin."
  ];
  if (!text && hasMedia) limitations.push("Tệp chưa đọc rõ nên chưa thể loại trừ rủi ro.");
  if (aiUnavailable) limitations.push("Dịch vụ AI tạm thời không phản hồi; kết quả đang dựa trên luật trong ứng dụng.");
  if (entities.some((entity) => entity.type === "url")) limitations.push("Đường link chỉ được trích xuất; cần chạy kiểm tra link để theo dõi chuyển hướng.");
  return limitations.slice(0, 4);
}

function buildStructuredAnalysisResult({ result, signals, text = "", hasMedia = false, aiUnavailable = false, recoveryModeActive = false }) {
  const entities = extractEntities(text);
  const journey = classifyJourney(makeJourneyEvents(signals, entities));
  const riskLevel = mapRiskLevel(result, signals);
  const immediateActions = (result.hanh_dong || []).slice(0, 3).map((label) => ({ label }));
  const manipulationSignals = (result.chien_thuat_thao_tung || []).slice(0, 3).map((signal) => ({
    id: signal.id,
    label: signal.description || signal.label,
    category: signal.label
  }));

  return {
    summary: result.ly_do?.[0] || "Chưa phát hiện dấu hiệu rõ ràng. Kết quả này không bảo đảm người gửi là đáng tin.",
    riskLevel,
    confidence: boundedConfidence(result, Boolean(text)),
    journeyStage: journey.nhan_giai_doan,
    journeyStageCode: journey.giai_doan,
    scamTypes: unique(Object.entries(signals || {})
      .filter(([, value]) => value === true)
      .map(([key]) => SIGNAL_SCAM_TYPES[key])).slice(0, 5),
    manipulationSignals,
    extractedEntities: entities,
    immediateActions,
    predictedNextSteps: buildPredictedNextSteps(signals, journey, entities),
    nextQuestion: buildNextQuestion(result, signals, entities),
    dataStatus: dataStatus(text, hasMedia, result),
    limitations: buildLimitations({ text, hasMedia, aiUnavailable, entities }),
    requiresEmergencyFlow: riskLevel === "high" || riskLevel === "critical",
    requiresRecoveryFlow: recoveryModeActive || /(?:hoàn tiền|thu hồi|lấy lại tiền|phí xử lý hồ sơ)/i.test(text)
  };
}

module.exports = {
  buildStructuredAnalysisResult,
  extractEntities,
  mapRiskLevel
};
