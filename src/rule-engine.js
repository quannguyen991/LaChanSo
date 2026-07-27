const SIGNAL_RULES = [
  {
    key: "gia_danh_co_quan_nha_nuoc",
    weight: 3,
    reason: "Công an không gọi điện yêu cầu chuyển khoản để điều tra.",
    action: "Cúp máy, không chuyển tiền",
    citation: "Theo cảnh báo của Bộ Công an: lực lượng công an không làm việc, không yêu cầu công dân chuyển tiền qua điện thoại."
  },
  {
    key: "doi_chuyen_tien_tai_khoan_ca_nhan",
    weight: 3,
    reason: "Cơ quan thật không yêu cầu chuyển tiền vào tài khoản cá nhân để 'xác minh'.",
    action: "Không chuyển tiền, xác minh qua số chính thức",
    citation: "Theo cảnh báo của Bộ Công an: lực lượng công an không làm việc, không yêu cầu công dân chuyển tiền qua điện thoại."
  },
  {
    key: "ep_thoi_gian_khan_cap",
    weight: 2,
    reason: "Lừa đảo luôn thúc ép để nạn nhân không kịp suy nghĩ.",
    action: "Bình tĩnh, xin thời gian gọi người thân",
    citation: null
  },
  {
    key: "doa_bat_giu_hoac_cat_tro_cap",
    weight: 3,
    reason: "Đây là chiêu doạ nạt phổ biến để gây hoảng loạn.",
    action: "Không làm theo, gọi người thân xác minh",
    citation: "Theo cảnh báo của Bộ Công an: lực lượng công an không làm việc, không yêu cầu công dân chuyển tiền qua điện thoại."
  },
  {
    key: "yeu_cau_giu_bi_mat",
    weight: 3,
    reason: "Yêu cầu giữ bí mật là dấu hiệu lừa đảo rất rõ.",
    action: "Kể ngay cho người thân",
    citation: "Không cơ quan, ngân hàng hay dịch vụ hợp pháp nào yêu cầu bạn giữ bí mật một giao dịch với người thân."
  },
  {
    key: "doi_otp_hoac_cai_app_la",
    weight: 3,
    critical: true,
    reason: "Không cơ quan nào xin mã OTP hay bắt cài app qua điện thoại.",
    action: "Không cung cấp, không cài, không bấm",
    citation: "Theo cảnh báo của BHXH Việt Nam: cơ quan bảo hiểm xã hội không yêu cầu OTP hay chuyển tiền để chi trả chế độ."
  },
  {
    key: "tu_xung_nguoi_than_nhung_dang_ngo",
    weight: 2,
    reason: "Có thể là giả giọng — nên xác minh lại.",
    action: "Gọi lại đúng số đã lưu của người thân trước",
    citation: "Theo khuyến nghị của Ủy ban Thương mại Liên bang Hoa Kỳ (FTC) về 'family emergency scam': luôn xác minh lại với người thân qua số điện thoại đã lưu trước khi chuyển tiền."
  },
  {
    key: "moi_hoi_thao_qua_tang_mien_phi",
    weight: 1,
    reason: "Mời dự hội thảo hoặc tặng quà/voucher miễn phí thường là bước dẫn dụ ban đầu của lừa đảo sở hữu kỳ nghỉ.",
    action: "Cẩn trọng trước khi tới, không mang theo giấy tờ tùy thân hay sổ tiết kiệm",
    citation: null
  },
  {
    key: "ep_ky_hop_dong_ngay_tai_cho_giam_gia_soc",
    weight: 2,
    reason: "Ép ký hợp đồng ngay tại chỗ kèm giảm giá sốc là chiêu không cho thời gian suy nghĩ.",
    action: "Không ký bất cứ gì tại chỗ, xin mang hợp đồng về đọc kỹ",
    citation: "Theo cảnh báo của cơ quan chức năng: hợp đồng sở hữu kỳ nghỉ thường bị ép ký ngay tại hội thảo, không có thời gian tìm hiểu."
  },
  {
    key: "hop_dong_gia_tri_lon_nhieu_nam",
    weight: 2,
    reason: "Hợp đồng giá trị hàng trăm triệu với thời hạn nhiều năm là rủi ro tài chính lớn, khó hủy.",
    action: "Tham khảo người thân hoặc luật sư trước khi cam kết số tiền lớn, nhiều năm",
    citation: null
  },
  {
    key: "ep_mua_them_hop_dong_de_thoat_hop_dong_cu",
    weight: 3,
    reason: "Yêu cầu mua thêm hợp đồng mới để 'thoát' hợp đồng cũ là thủ đoạn lừa đảo tiếp theo, không phải cách hợp lệ để hủy hợp đồng.",
    action: "Không ký thêm hợp đồng nào, dừng lại và hỏi người thân trước",
    citation: "Nhiều nạn nhân đã bị dẫn dụ ký hàng chục hợp đồng liên tiếp với lý do 'giúp chuyển nhượng' hợp đồng cũ, gây thiệt hại ngày càng lớn."
  },
  {
    key: "goi_dien_lien_tuc_gay_ap_luc",
    weight: 2,
    reason: "Gọi điện liên tục nhiều lần trong thời gian ngắn là cách gây áp lực tâm lý để ép quyết định vội.",
    action: "Không nghe máy liên tục, dành thời gian bình tĩnh trước khi trả lời",
    citation: null
  },
  {
    key: "yeu_cau_chia_se_man_hinh_dieu_khien_tu_xa",
    weight: 3,
    critical: true,
    reason: "Yêu cầu chia sẻ màn hình hoặc cài phần mềm điều khiển từ xa có thể khiến người khác chiếm toàn bộ điện thoại.",
    action: "Không chia sẻ màn hình, không cài phần mềm điều khiển từ xa, tắt máy nếu đang làm theo hướng dẫn này",
    citation: "Ngân hàng, nhà mạng và cơ quan nhà nước không bao giờ yêu cầu khách hàng chia sẻ màn hình hoặc cài ứng dụng điều khiển thiết bị từ xa."
  },
  {
    key: "mao_danh_dich_vu_thiet_yeu_hoac_thue",
    weight: 2,
    reason: "Giả danh điện lực, nước, thuế, phường hoặc bưu điện kèm đe dọa cắt dịch vụ/phạt là chiêu quen thuộc để ép chuyển tiền gấp.",
    action: "Tự gọi lại số hotline chính thức của đơn vị đó để xác minh, không chuyển tiền qua điện thoại",
    citation: null
  },
  {
    key: "dau_tu_loi_nhuan_cao_dam_bao",
    weight: 3,
    reason: "Lời hứa lợi nhuận cao, đều đặn và 'chắc chắn không lỗ' là dấu hiệu kinh điển của mô hình đầu tư lừa đảo.",
    action: "Không chuyển thêm tiền, đặc biệt nếu bị đòi thêm phí mới được rút tiền ra",
    citation: null
  },
  {
    key: "nguoi_quen_qua_mang_chua_gap_mat_xin_tien",
    weight: 2,
    reason: "Người quen qua mạng, chưa từng gặp mặt trực tiếp, liên tục gặp sự cố cần tiền là dấu hiệu lừa tình cảm phổ biến.",
    action: "Đề nghị gọi video xác minh trước, không chuyển tiền cho người chưa từng gặp ngoài đời",
    citation: null
  },
  {
    key: "bao_tin_nguoi_than_gap_nan_qua_ben_thu_ba",
    weight: 2,
    reason: "Tin báo người thân gặp nạn qua một người thứ ba tự xưng (giáo viên, bệnh viện, công an) mà không cho nói chuyện trực tiếp với người thân là dấu hiệu lừa đảo phổ biến.",
    action: "Gọi thẳng cho người thân hoặc một người thân khác để xác minh trước khi chuyển tiền",
    citation: null
  },
  {
    key: "de_doa_bang_hinh_anh_video_rieng_tu",
    weight: 3,
    critical: true,
    reason: "Đe dọa phát tán hình ảnh hoặc video riêng tư nếu không chuyển tiền là hành vi tống tiền, không phải một yêu cầu hợp pháp nào.",
    action: "Không chuyển tiền, lưu lại bằng chứng và trình báo công an — đây là hành vi phạm tội của người đe dọa, không phải lỗi của bác",
    citation: null
  },
  {
    key: "tai_khoan_nguoi_than_bi_hack_muon_tien",
    weight: 3,
    reason: "Tài khoản Zalo/Facebook của chính người thân quen có thể đã bị chiếm để nhắn vay hoặc mượn tiền.",
    action: "Gọi thẳng vào số điện thoại đã lưu của người thân để xác minh, đừng chuyển theo tin nhắn",
    citation: null
  },
  {
    key: "gia_danh_ngan_hang_xac_thuc_sinh_trac_hoc",
    weight: 3,
    reason: "Ngân hàng không gọi hay nhắn bắt 'xác thực sinh trắc học' hoặc 'mở khóa tài khoản' qua link hay ứng dụng lạ.",
    action: "Không bấm link, không cài app; tự tới phòng giao dịch hoặc gọi tổng đài in trên thẻ để kiểm tra",
    citation: null
  },
  {
    key: "cai_app_dich_vu_cong_gia",
    weight: 3,
    critical: true,
    reason: "Bị dẫn dụ cài ứng dụng 'Dịch vụ công', 'VNeID' hay 'Thuế' từ link gửi tới hoặc file APK ngoài kho chính thức là cách phát tán mã độc để chiếm điện thoại.",
    action: "Tuyệt đối không cài app từ link nhận được; chỉ cài từ CH Play/App Store chính thức, tắt máy nếu đang làm theo hướng dẫn",
    citation: null
  },
  {
    key: "de_doa_khoa_sim_thue_bao",
    weight: 2,
    reason: "Đe dọa 'khóa SIM/thuê bao hai chiều nếu không chuẩn hóa ngay' là chiêu ép làm gấp để moi thông tin hoặc tiền.",
    action: "Không làm theo qua điện thoại; tự ra điểm giao dịch chính thức của nhà mạng để kiểm tra",
    citation: null
  },
  {
    key: "lam_nhiem_vu_chot_don_hoa_hong",
    weight: 3,
    reason: "Mời 'làm nhiệm vụ', 'chốt đơn', 'thả tim' để nhận hoa hồng rồi bắt nạp tiền trước là mô hình lừa đảo phổ biến.",
    action: "Không nạp bất kỳ khoản tiền nào để 'làm nhiệm vụ' hay để 'rút hoa hồng' ra",
    citation: null
  }
];

const MANIPULATION_TACTIC_RULES = [
  {
    id: "gia-danh-quyen-luc",
    label: "Giả danh người có quyền",
    description: "Họ tự xưng là cơ quan hoặc đơn vị quan trọng để bác khó từ chối.",
    signals: ["gia_danh_co_quan_nha_nuoc", "mao_danh_dich_vu_thiet_yeu_hoac_thue", "gia_danh_ngan_hang_xac_thuc_sinh_trac_hoc"]
  },
  {
    id: "tao-so-hai",
    label: "Tạo sợ hãi",
    description: "Họ dùng lời đe dọa hoặc tin dữ để bác hoảng và làm theo ngay.",
    signals: ["doa_bat_giu_hoac_cat_tro_cap", "bao_tin_nguoi_than_gap_nan_qua_ben_thu_ba", "de_doa_bang_hinh_anh_video_rieng_tu", "de_doa_khoa_sim_thue_bao"]
  },
  {
    id: "thuc-ep-thoi-gian",
    label: "Thúc ép thời gian",
    description: "Họ không cho bác đủ thời gian suy nghĩ hoặc hỏi người thân.",
    signals: ["ep_thoi_gian_khan_cap", "goi_dien_lien_tuc_gay_ap_luc", "ep_ky_hop_dong_ngay_tai_cho_giam_gia_soc"]
  },
  {
    id: "co-lap-giu-bi-mat",
    label: "Cô lập và bắt giữ bí mật",
    description: "Họ ngăn bác kể cho người thân để không ai kịp kiểm tra giúp.",
    signals: ["yeu_cau_giu_bi_mat"]
  },
  {
    id: "chiem-quyen-thiet-bi",
    label: "Tìm cách chiếm quyền thiết bị",
    description: "Họ xin OTP, bắt cài ứng dụng lạ hoặc yêu cầu chia sẻ màn hình.",
    signals: ["doi_otp_hoac_cai_app_la", "yeu_cau_chia_se_man_hinh_dieu_khien_tu_xa", "cai_app_dich_vu_cong_gia"]
  },
  {
    id: "dan-du-bang-loi-ich",
    label: "Dẫn dụ bằng quà hoặc lợi nhuận",
    description: "Họ dùng quà miễn phí hoặc lời hứa lợi nhuận cao để tạo lòng tin.",
    signals: ["moi_hoi_thao_qua_tang_mien_phi", "dau_tu_loi_nhuan_cao_dam_bao", "nguoi_quen_qua_mang_chua_gap_mat_xin_tien", "lam_nhiem_vu_chot_don_hoa_hong"]
  },
  {
    id: "ep-giao-dich",
    label: "Ép chuyển tiền hoặc ký cam kết",
    description: "Họ đẩy bác tới một giao dịch khó lấy lại tiền hoặc khó hủy bỏ.",
    signals: ["doi_chuyen_tien_tai_khoan_ca_nhan", "hop_dong_gia_tri_lon_nhieu_nam", "ep_mua_them_hop_dong_de_thoat_hop_dong_cu"]
  },
  {
    id: "gia-danh-nguoi-than",
    label: "Lợi dụng tình cảm gia đình",
    description: "Họ tự xưng là người thân hoặc báo tin khẩn để bác mất bình tĩnh.",
    signals: ["tu_xung_nguoi_than_nhung_dang_ngo", "bao_tin_nguoi_than_gap_nan_qua_ben_thu_ba", "tai_khoan_nguoi_than_bi_hack_muon_tien"]
  }
];

const SAFE_REASONS = [
  "Chưa thấy yêu cầu chuyển tiền để điều tra hoặc xác minh.",
  "Chưa thấy lời đe doạ, ép giữ bí mật hoặc xin mã OTP.",
  "Thông tin hiện có chưa đủ để khẳng định đây là lừa đảo."
];

const SAFE_ACTIONS = [
  "Không chuyển tiền nếu vẫn còn điều gì bất thường",
  "Tự gọi lại số chính thức hoặc số người thân đã lưu",
  "Nhờ một người tin cậy kiểm tra cùng trước khi làm tiếp"
];

const DEFAULT_CITATION = "Không cơ quan, ngân hàng hay dịch vụ hợp pháp nào yêu cầu bạn giữ bí mật một giao dịch với người thân.";

const TRANSFER_SIGNAL_RULES = [
  {
    key: "ten_khong_khop_nguoi_tu_xung",
    weight: 3,
    reason: "Tên chủ tài khoản nhận tiền không khớp với người hoặc tổ chức đang tự xưng.",
    action: "Dừng lại, xác minh đúng tên chủ tài khoản trước khi chuyển",
    citation: "Ngân hàng luôn hiển thị tên chủ tài khoản thật khi tra cứu chuyển khoản — hãy đối chiếu kỹ trước khi bấm xác nhận."
  },
  {
    key: "tai_khoan_ca_nhan_nhung_xung_co_quan",
    weight: 3,
    reason: "Tự xưng là cơ quan nhà nước hoặc ngân hàng nhưng lại yêu cầu chuyển vào tài khoản cá nhân.",
    action: "Không chuyển tiền — cơ quan thật không thu tiền qua tài khoản cá nhân",
    citation: "Theo cảnh báo của Bộ Công an: cơ quan nhà nước không thu tiền, phí hay tiền xử phạt qua tài khoản cá nhân."
  },
  {
    key: "bi_hoi_thuc_chuyen_nhieu_lan",
    weight: 2,
    reason: "Bị yêu cầu chuyển nhiều lần liên tiếp với lý do khác nhau.",
    action: "Dừng lại sau lần đầu, xác minh với người thân trước khi chuyển thêm",
    citation: null
  },
  {
    key: "noi_dung_chuyen_khoan_bat_thuong",
    weight: 2,
    reason: "Bị yêu cầu ghi nội dung chuyển khoản khác thường, không liên quan tới lý do chuyển thật.",
    action: "Hỏi lại rõ lý do trước khi làm theo nội dung được yêu cầu ghi",
    citation: null
  },
  {
    key: "hua_hoan_tien_sau_phi",
    weight: 3,
    reason: "Hứa hoàn tiền hoặc trả thưởng sau khi nộp thêm một khoản phí.",
    action: "Không nộp thêm bất kỳ khoản phí nào để 'nhận lại tiền'",
    citation: "Không ai lấy lại tiền đã mất bằng cách yêu cầu bạn đóng thêm phí — đây luôn là dấu hiệu của một vụ lừa đảo tiếp theo."
  }
];

const TRANSFER_MANIPULATION_TACTIC_RULES = [
  {
    id: "gia-danh-chu-tai-khoan",
    label: "Làm mờ danh tính người nhận",
    description: "Tên tài khoản không khớp với người hoặc tổ chức đang tự xưng.",
    signals: ["ten_khong_khop_nguoi_tu_xung", "tai_khoan_ca_nhan_nhung_xung_co_quan"]
  },
  {
    id: "ep-chuyen-nhieu-lan",
    label: "Thúc ép chuyển nhiều lần",
    description: "Họ chia giao dịch thành nhiều lần để bác khó dừng lại.",
    signals: ["bi_hoi_thuc_chuyen_nhieu_lan"]
  },
  {
    id: "che-giau-muc-dich",
    label: "Che giấu mục đích giao dịch",
    description: "Họ yêu cầu ghi nội dung chuyển khoản khác với lý do thật.",
    signals: ["noi_dung_chuyen_khoan_bat_thuong"]
  },
  {
    id: "hua-hoan-tien",
    label: "Hứa hoàn tiền sau khi đóng phí",
    description: "Họ dùng lời hứa lấy lại tiền để yêu cầu bác nộp thêm.",
    signals: ["hua_hoan_tien_sau_phi"]
  }
];

const TRANSFER_SAFE_REASONS = [
  "Chưa thấy tên người nhận bất thường so với người đang liên hệ.",
  "Chưa thấy dấu hiệu ép chuyển nhiều lần hoặc hứa hoàn phí.",
  "Thông tin hiện có chưa đủ để khẳng định đây là lừa đảo."
];

const TRANSFER_SAFE_ACTIONS = [
  "Vẫn nên đối chiếu lại tên chủ tài khoản trước khi chuyển",
  "Chuyển số tiền nhỏ trước để xác minh nếu còn nghi ngờ",
  "Hỏi thêm người thân nếu vẫn còn phân vân"
];

const TRANSFER_DEFAULT_CITATION = "Ngân hàng luôn hiển thị tên chủ tài khoản thật khi tra cứu chuyển khoản — hãy đối chiếu kỹ trước khi bấm xác nhận.";

const RECOVERY_SCAM_KEYWORDS = [
  "hoàn tiền",
  "thu hồi",
  "lấy lại tiền",
  "luật sư",
  "điều tra viên",
  "phí xử lý hồ sơ"
];

const RECOVERY_BOOST_REASON =
  "Đây có thể là lừa đảo 'hỗ trợ lấy lại tiền' — không có cơ quan hay dịch vụ nào yêu cầu đóng phí để hoàn tiền đã mất.";
const RECOVERY_BOOST_CITATION =
  "Theo cảnh báo của Ủy ban Thương mại Liên bang Hoa Kỳ (FTC) về 'refund and recovery scams': không ai lấy lại được tiền đã mất bằng cách đóng thêm phí cho một bên tự nhận có thể giúp thu hồi.";

const RISK_RANK = {
  "Chưa thấy dấu hiệu rủi ro": 0,
  "Nghi ngờ": 1,
  "Nguy hiểm cao": 2
};

function applyRecoveryBoost(result, text) {
  const normalized = String(text || "").toLowerCase();
  const matched = RECOVERY_SCAM_KEYWORDS.some((keyword) => normalized.includes(keyword));
  if (!matched) return result;

  const boostedScore = Math.max(result.diem, 3);
  // Recovery boost only ever raises the floor to "Nghi ngờ"; it must never
  // downgrade a result already classified higher (e.g. a critical signal).
  const boostedLabel = RISK_RANK[result.muc_rui_ro] >= RISK_RANK["Nghi ngờ"]
    ? result.muc_rui_ro
    : "Nghi ngờ";

  return {
    ...result,
    muc_rui_ro: boostedLabel,
    diem: boostedScore,
    ly_do: [RECOVERY_BOOST_REASON, ...result.ly_do].slice(0, 3),
    trich_dan: [...new Set([RECOVERY_BOOST_CITATION, ...result.trich_dan])]
  };
}

function classifyScore(score) {
  // A single moderate red flag (weight 2) must not fall through to the
  // reassuring "no risk" label, and accumulated signals reach the top tier.
  // Signals marked `critical` bypass this and force "Nguy hiểm cao" directly.
  if (score >= 4) return "Nguy hiểm cao";
  if (score >= 2) return "Nghi ngờ";
  return "Chưa thấy dấu hiệu rủi ro";
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function padToThree(primary, fallbacks) {
  return unique([...primary, ...fallbacks]).slice(0, 3);
}

function detectManipulationTactics(rawSignals = {}, tacticRules = MANIPULATION_TACTIC_RULES) {
  return tacticRules
    .filter((tactic) => tactic.signals.some((key) => rawSignals[key] === true))
    .map(({ id, label, description }) => ({ id, label, description }))
    .slice(0, 4);
}

function makeEvaluator(rules, safeReasons, safeActions, defaultCitation, tacticRules = []) {
  const keys = rules.map((rule) => rule.key);

  function normalize(input = {}) {
    return Object.fromEntries(keys.map((key) => [key, input[key] === true]));
  }

  function evaluate(rawSignals) {
    const signals = normalize(rawSignals);
    const matches = rules.filter((rule) => signals[rule.key]);
    const score = matches.reduce((total, rule) => total + rule.weight, 0);
    const hasCritical = matches.some((rule) => rule.critical);

    return {
      muc_rui_ro: hasCritical ? "Nguy hiểm cao" : classifyScore(score),
      ly_do: padToThree(matches.map((rule) => rule.reason), safeReasons),
      hanh_dong: padToThree(matches.map((rule) => rule.action), safeActions),
      trich_dan: unique([...matches.map((rule) => rule.citation), defaultCitation]),
      chien_thuat_thao_tung: detectManipulationTactics(signals, tacticRules),
      diem: score
    };
  }

  return { keys, normalize, evaluate };
}

const situationEvaluator = makeEvaluator(
  SIGNAL_RULES,
  SAFE_REASONS,
  SAFE_ACTIONS,
  DEFAULT_CITATION,
  MANIPULATION_TACTIC_RULES
);
const transferEvaluator = makeEvaluator(
  TRANSFER_SIGNAL_RULES,
  TRANSFER_SAFE_REASONS,
  TRANSFER_SAFE_ACTIONS,
  TRANSFER_DEFAULT_CITATION,
  TRANSFER_MANIPULATION_TACTIC_RULES
);

const SIGNAL_KEYS = situationEvaluator.keys;
const normalizeSignals = situationEvaluator.normalize;
const evaluateRisk = situationEvaluator.evaluate;

const TRANSFER_SIGNAL_KEYS = transferEvaluator.keys;
const normalizeTransferSignals = transferEvaluator.normalize;
const evaluateTransferRisk = transferEvaluator.evaluate;

function normalizeVietnameseText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "D")
    .toLowerCase();
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

// Deterministic fallback used when the configured LLM is unavailable. It is
// deliberately conservative: it only raises signals backed by words present
// in the user's text, while the regular rule engine still decides the risk.
function inferSignalsFromText(rawText) {
  const text = normalizeVietnameseText(rawText);
  const moneyRequest = hasAny(text, ["chuyen tien", "chuyen khoan", "nop tien", "gui tien", "tai khoan ca nhan"]);
  const familyMention = hasAny(text, ["con gai", "con trai", "con chau", "chau toi", "nguoi than", "bo me", "anh chi em"]);

  return normalizeSignals({
    gia_danh_co_quan_nha_nuoc: hasAny(text, ["cong an", "vien kiem sat", "toa an", "co quan dieu tra", "bao hiem xa hoi", "bhxh"]),
    doi_chuyen_tien_tai_khoan_ca_nhan: moneyRequest,
    ep_thoi_gian_khan_cap: hasAny(text, ["ngay lap tuc", "lam ngay", "chuyen ngay", "chuyen khoan ngay", "gap", "khan cap", "hom nay", "het han"]),
    doa_bat_giu_hoac_cat_tro_cap: hasAny(text, ["bat giam", "bat giu", "khoi to", "cat tro cap", "phong toa tai khoan", "khoa tai khoan"]),
    yeu_cau_giu_bi_mat: hasAny(text, ["giu bi mat", "khong duoc ke", "khong noi voi", "khong bao nguoi than"]),
    doi_otp_hoac_cai_app_la: hasAny(text, ["otp", "ma xac nhan", "ma smart otp", "cai app", "cai ung dung", "file apk"]),
    tu_xung_nguoi_than_nhung_dang_ngo: familyMention && hasAny(text, ["so la", "bao chuyen", "bao gui", "muon tien", "vay tien", "xin tien", "can tien"]),
    moi_hoi_thao_qua_tang_mien_phi: hasAny(text, ["hoi thao", "qua mien phi", "voucher", "ky nghi mien phi"]),
    ep_ky_hop_dong_ngay_tai_cho_giam_gia_soc: hasAny(text, ["ky ngay", "ky tai cho", "giam gia soc", "chi hom nay"]),
    hop_dong_gia_tri_lon_nhieu_nam: hasAny(text, ["hop dong tram trieu", "hop dong nhieu nam", "so huu ky nghi"]),
    ep_mua_them_hop_dong_de_thoat_hop_dong_cu: hasAny(text, ["mua them hop dong", "thoat hop dong cu", "chuyen nhuong hop dong"]),
    goi_dien_lien_tuc_gay_ap_luc: hasAny(text, ["goi lien tuc", "goi nhieu lan", "thuc ep", "gay ap luc"]),
    yeu_cau_chia_se_man_hinh_dieu_khien_tu_xa: hasAny(text, ["chia se man hinh", "dieu khien tu xa", "anydesk", "teamviewer"]),
    mao_danh_dich_vu_thiet_yeu_hoac_thue: hasAny(text, ["dien luc", "tien dien", "tien nuoc", "co quan thue", "buu dien", "phuong bao"]),
    dau_tu_loi_nhuan_cao_dam_bao: hasAny(text, ["loi nhuan cao", "khong lo", "lai deu", "dau tu tien ao", "san dau tu"]),
    nguoi_quen_qua_mang_chua_gap_mat_xin_tien: hasAny(text, ["quen qua mang", "chua gap mat", "ban trai online", "ban gai online"]) && moneyRequest,
    bao_tin_nguoi_than_gap_nan_qua_ben_thu_ba: hasAny(text, ["giao vien bao", "benh vien bao", "tai nan", "cap cuu", "nguoi than gap nan"]),
    de_doa_bang_hinh_anh_video_rieng_tu: hasAny(text, ["anh rieng tu", "video rieng tu", "phat tan anh", "phat tan video", "tong tien"]),
    tai_khoan_nguoi_than_bi_hack_muon_tien: familyMention && hasAny(text, ["zalo", "facebook", "messenger", "tai khoan bi hack"]) && moneyRequest,
    gia_danh_ngan_hang_xac_thuc_sinh_trac_hoc: hasAny(text, ["sinh trac hoc", "nhan vien ngan hang", "mo khoa ngan hang"]),
    cai_app_dich_vu_cong_gia: hasAny(text, ["vneid", "dich vu cong", "ung dung thue"]) && hasAny(text, ["link", "cai", "apk"]),
    de_doa_khoa_sim_thue_bao: hasAny(text, ["khoa sim", "khoa thue bao", "chuan hoa thue bao"]),
    lam_nhiem_vu_chot_don_hoa_hong: hasAny(text, ["lam nhiem vu", "chot don", "tha tim", "nhan hoa hong", "nap tien de rut"])
  });
}

module.exports = {
  SIGNAL_KEYS,
  SIGNAL_RULES,
  MANIPULATION_TACTIC_RULES,
  detectManipulationTactics,
  evaluateRisk,
  normalizeSignals,
  TRANSFER_SIGNAL_KEYS,
  TRANSFER_SIGNAL_RULES,
  TRANSFER_MANIPULATION_TACTIC_RULES,
  evaluateTransferRisk,
  normalizeTransferSignals,
  inferSignalsFromText,
  classifyScore,
  applyRecoveryBoost
};
