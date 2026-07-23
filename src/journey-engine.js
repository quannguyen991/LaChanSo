const STAGE_ORDER = ["lam_quen", "tao_niem_tin", "gay_so_hai", "co_lap", "yeu_cau_chuyen_tien"];

const EVENT_TYPES = [
  "cuoc_goi_dau_tien",
  "tin_nhan_tiep_theo",
  "link_duoc_gui",
  "yeu_cau_cai_app",
  "yeu_cau_chuyen_thu",
  "yeu_cau_chuyen_them",
  "yeu_cau_giu_bi_mat",
  "khac"
];

const STAGE_LABELS = {
  lam_quen: "Làm quen",
  tao_niem_tin: "Tạo niềm tin",
  gay_so_hai: "Gây sợ hãi",
  co_lap: "Cô lập khỏi gia đình",
  yeu_cau_chuyen_tien: "Yêu cầu chuyển tiền"
};

const STAGE_DESCRIPTIONS = {
  lam_quen: "Mới có liên hệ ban đầu, chưa có nhiều dấu hiệu rõ ràng.",
  tao_niem_tin: "Đối tượng đang liên hệ nhiều lần để tạo sự quen thuộc trước khi đưa ra yêu cầu.",
  gay_so_hai: "Đã xuất hiện lời đe dọa, ép thời gian gấp hoặc tự xưng cơ quan chức năng — dấu hiệu gây sức ép tâm lý.",
  co_lap: "Đã có yêu cầu giữ bí mật, không kể cho người thân — dấu hiệu cô lập khỏi người có thể giúp xác minh.",
  yeu_cau_chuyen_tien: "Đã có yêu cầu chuyển tiền, chuyển thử khoản nhỏ, hoặc chuyển thêm — giai đoạn khai thác tài chính."
};

const NEXT_STEP_SENTENCES = {
  lam_quen: "Đối tượng có thể tiếp tục liên hệ thêm để tạo niềm tin trước khi đưa ra yêu cầu.",
  tao_niem_tin: "Đối tượng có thể bắt đầu dùng lời đe dọa hoặc tạo cảm giác khẩn cấp để gây sức ép.",
  gay_so_hai: "Đối tượng có thể yêu cầu giữ bí mật, không kể cho người thân hoặc cơ quan chức năng.",
  co_lap: "Đối tượng có thể yêu cầu chuyển tiền, chuyển thử một khoản nhỏ, hoặc yêu cầu cài ứng dụng lạ.",
  yeu_cau_chuyen_tien: "Đối tượng có thể tiếp tục yêu cầu chuyển thêm tiền hoặc bịa lý do mới để giữ liên lạc."
};

const JOURNEY_DEFAULT_CITATION =
  "Đây là dự đoán dựa trên các mẫu lừa đảo phổ biến đã ghi nhận, không phải khẳng định chắc chắn — hãy luôn tự xác minh trước khi quyết định.";

const CHUYEN_TIEN_SIGNALS = ["doi_chuyen_tien_tai_khoan_ca_nhan"];
const CHUYEN_TIEN_EVENT_TYPES = ["yeu_cau_chuyen_thu", "yeu_cau_chuyen_them"];
const CO_LAP_SIGNALS = ["yeu_cau_giu_bi_mat"];
const CO_LAP_EVENT_TYPES = ["yeu_cau_giu_bi_mat"];
const GAY_SO_HAI_SIGNALS = [
  "ep_thoi_gian_khan_cap",
  "doa_bat_giu_hoac_cat_tro_cap",
  "gia_danh_co_quan_nha_nuoc",
  "doi_otp_hoac_cai_app_la"
];
const GAY_SO_HAI_EVENT_TYPES = ["yeu_cau_cai_app"];

function collectTrueSignals(events) {
  const signals = {};
  for (const event of events) {
    if (event && event.signals && typeof event.signals === "object") {
      for (const [key, value] of Object.entries(event.signals)) {
        if (value === true) signals[key] = true;
      }
    }
  }
  return signals;
}

function hasAny(keys, set) {
  return keys.some((key) => set[key] === true);
}

function hasAnyType(types, typeSet) {
  return types.some((type) => typeSet.has(type));
}

function computeStageIndex(events) {
  const types = new Set(events.map((event) => event && event.type));
  const signals = collectTrueSignals(events);

  if (hasAny(CHUYEN_TIEN_SIGNALS, signals) || hasAnyType(CHUYEN_TIEN_EVENT_TYPES, types)) {
    return 4;
  }
  if (hasAny(CO_LAP_SIGNALS, signals) || hasAnyType(CO_LAP_EVENT_TYPES, types)) {
    return 3;
  }
  if (hasAny(GAY_SO_HAI_SIGNALS, signals) || hasAnyType(GAY_SO_HAI_EVENT_TYPES, types)) {
    return 2;
  }
  if (events.length >= 2) {
    return 1;
  }
  return 0;
}

function classifyJourney(rawEvents) {
  const events = Array.isArray(rawEvents) ? rawEvents : [];
  const stage = STAGE_ORDER[computeStageIndex(events)];

  return {
    giai_doan: stage,
    nhan_giai_doan: STAGE_LABELS[stage],
    mo_ta: STAGE_DESCRIPTIONS[stage],
    du_doan_buoc_tiep_theo: NEXT_STEP_SENTENCES[stage],
    trich_dan: [JOURNEY_DEFAULT_CITATION]
  };
}

module.exports = {
  STAGE_ORDER,
  STAGE_LABELS,
  EVENT_TYPES,
  classifyJourney
};
