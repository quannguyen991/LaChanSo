const STORAGE_KEYS = {
  phone: "la-chan-so:family-phone",
  bankPhone: "la-chan-so:bank-phone",
  keyword: "la-chan-so:family-keyword",
  history: "la-chan-so:history",
  evidence: "la-chan-so:evidence",
  checklist: "la-chan-so:post-transfer-checklist",
  contacts: "la-chan-so:contacts",
  consent: "la-chan-so:consent-personalization",
  saveHistoryDisabled: "la-chan-so:save-history-disabled",
  cases: "la-chan-so:cases",
  recoveryMode: "la-chan-so:recovery-mode",
  fontSize: "khoan-da:font-size",
  voiceGuide: "khoan-da:voice-guide",
  familySharing: "khoan-da:family-sharing",
  retentionPolicy: "khoan-da:retention-policy",
  oneTimeCheck: "khoan-da:one-time-check",
  privacyAudit: "khoan-da:privacy-audit",
  educationProgress: "khoan-da:education-progress",
  reportQueue: "khoan-da:report-queue",
  onboardingComplete: "khoan-da:onboarding-complete",
  account: "khoan-da:account",
  accountSession: "khoan-da:account-session"
};

const ALL_STORAGE_KEYS = Object.values({
  phone: "la-chan-so:family-phone",
  bankPhone: "la-chan-so:bank-phone",
  keyword: "la-chan-so:family-keyword",
  history: "la-chan-so:history",
  evidence: "la-chan-so:evidence",
  checklist: "la-chan-so:post-transfer-checklist",
  contacts: "la-chan-so:contacts",
  consent: "la-chan-so:consent-personalization",
  saveHistoryDisabled: "la-chan-so:save-history-disabled",
  cases: "la-chan-so:cases",
  recoveryMode: "la-chan-so:recovery-mode",
  fontSize: "khoan-da:font-size",
  voiceGuide: "khoan-da:voice-guide",
  familySharing: "khoan-da:family-sharing",
  retentionPolicy: "khoan-da:retention-policy",
  oneTimeCheck: "khoan-da:one-time-check",
  privacyAudit: "khoan-da:privacy-audit",
  educationProgress: "khoan-da:education-progress",
  reportQueue: "khoan-da:report-queue",
  onboardingComplete: "khoan-da:onboarding-complete",
  account: "khoan-da:account",
  accountSession: "khoan-da:account-session"
});

const MAX_CONTACTS = 5;
const MAX_CASES = 5;
const MAX_EVENTS_PER_CASE = 20;
const CONTACT_PERMISSION_LABELS = {
  call_only: "Chỉ gọi hỗ trợ",
  high_alert: "Nhận cảnh báo nguy hiểm cao",
  summary: "Xem tóm tắt khi bác đồng ý",
  evidence: "Xem bằng chứng được chọn",
  recovery: "Hỗ trợ checklist hậu sự cố"
};

const CASE_EVENT_TYPES = [
  { id: "cuoc_goi_dau_tien", label: "Cuộc gọi đầu tiên" },
  { id: "tin_nhan_tiep_theo", label: "Tin nhắn tiếp theo" },
  { id: "link_duoc_gui", label: "Được gửi link" },
  { id: "yeu_cau_cai_app", label: "Yêu cầu cài app" },
  { id: "yeu_cau_chuyen_thu", label: "Yêu cầu chuyển thử" },
  { id: "yeu_cau_chuyen_them", label: "Yêu cầu chuyển thêm" },
  { id: "yeu_cau_giu_bi_mat", label: "Yêu cầu giữ bí mật" },
  { id: "khac", label: "Khác" }
];

const CASE_EVENT_LABELS = Object.fromEntries(CASE_EVENT_TYPES.map((type) => [type.id, type.label]));

const CASE_DESKTOP_DEMO_CASES = [
  {
    id: "demo-police-call",
    label: "Cuộc gọi mạo danh công an",
    status: "Đang xử lý",
    updatedAt: "2025-05-20T14:32:00+07:00",
    requestedAmount: "120.000.000đ",
    demoIcon: "icon-phone",
    demoTone: "high",
    isDemo: true,
    events: [
      { type: "cuoc_goi_dau_tien", text: "Số lạ tự xưng là công an, yêu cầu xác minh thông tin.", createdAt: "2025-05-20T14:32:00+07:00" },
      { type: "yeu_cau_chuyen_them", text: "Đối tượng gây áp lực, yêu cầu chuyển tiền gấp.", createdAt: "2025-05-20T14:36:00+07:00", risk: "Nguy hiểm cao" },
      { type: "yeu_cau_chuyen_thu", text: "Chuyển 120.000.000đ vào số tài khoản lạ.", createdAt: "2025-05-20T14:40:00+07:00", risk: "Nguy hiểm cao" },
      { type: "khac", text: "Đã gọi cho con trai và được hỗ trợ kịp thời.", createdAt: "2025-05-20T15:05:00+07:00" },
      { type: "khac", text: "Lưu hình ảnh, ghi âm cuộc gọi và tin nhắn.", createdAt: "2025-05-20T15:10:00+07:00" }
    ]
  },
  {
    id: "demo-prize-message",
    label: "Tin nhắn trúng thưởng",
    status: "Đã xử lý",
    updatedAt: "2025-05-18T09:15:00+07:00",
    requestedAmount: "-",
    demoIcon: "icon-messages",
    demoTone: "safe",
    isDemo: true,
    events: []
  },
  {
    id: "demo-bank-staff",
    label: "Giả mạo nhân viên ngân hàng",
    status: "Đang xử lý",
    updatedAt: "2025-05-15T16:45:00+07:00",
    requestedAmount: "25.000.000đ",
    demoIcon: "icon-wallet",
    demoTone: "medium",
    isDemo: true,
    events: []
  },
  {
    id: "demo-investment",
    label: "Ưu đãi đầu tư online",
    status: "Đã xử lý",
    updatedAt: "2025-05-10T11:20:00+07:00",
    requestedAmount: "-",
    demoIcon: "icon-shield-check",
    demoTone: "safe",
    isDemo: true,
    events: []
  },
  {
    id: "demo-recruitment",
    label: "Lừa đảo tuyển cộng tác viên",
    status: "Đã đóng",
    updatedAt: "2025-05-05T08:30:00+07:00",
    requestedAmount: "-",
    demoIcon: "icon-user",
    demoTone: "low",
    isDemo: true,
    events: []
  }
];

const SAMPLES = {
  police: "Có người gọi tự xưng là công an phường, nói tôi liên quan vụ rửa tiền, yêu cầu chuyển 80 triệu vào một tài khoản để xác minh trong hôm nay, không được nói với ai.",
  family: "Con tôi gọi điện bảo bị tai nạn, cần 20 triệu gấp để đóng viện phí, giọng hơi lạ, số điện thoại không phải số con hay dùng.",
  vacation: "Tôi được mời dự hội thảo miễn phí tặng vali du lịch, tới nơi bị mời mua gói sở hữu kỳ nghỉ giá 300 triệu trong 20 năm, nếu ký ngay hôm nay được giảm 50%. Nhân viên gọi điện liên tục nhiều lần trong tuần để hối thúc."
};

const RISK_META = {
  "Nguy hiểm cao": {
    key: "high",
    lead: "Có nhiều dấu hiệu lừa đảo rõ ràng. Hãy dừng mọi giao dịch."
  },
  "Nghi ngờ": {
    key: "medium",
    lead: "Có dấu hiệu cần kiểm tra lại trước khi làm theo."
  },
  "Chưa thấy dấu hiệu rủi ro": {
    key: "low",
    lead: "Trong thông tin bác cung cấp, chưa thấy dấu hiệu rủi ro. Nếu vẫn thấy bất thường, bác hãy kiểm tra lại với người thân hoặc đơn vị chính thức."
  }
};

const SIGNAL_LABELS = {
  gia_danh_co_quan_nha_nuoc: "Giả danh cơ quan hoặc đơn vị có thẩm quyền",
  doi_chuyen_tien_tai_khoan_ca_nhan: "Yêu cầu chuyển tiền vào tài khoản cá nhân",
  ep_thoi_gian_khan_cap: "Thúc ép thời gian",
  doa_bat_giu_hoac_cat_tro_cap: "Đe dọa bắt giữ hoặc cắt trợ cấp",
  yeu_cau_giu_bi_mat: "Yêu cầu giữ bí mật với người thân",
  doi_otp_hoac_cai_app_la: "Đòi OTP hoặc cài ứng dụng lạ",
  tu_xung_nguoi_than_nhung_dang_ngo: "Tự xưng người thân nhưng chưa xác minh",
  yeu_cau_chia_se_man_hinh_dieu_khien_tu_xa: "Yêu cầu chia sẻ màn hình/điều khiển từ xa",
  mao_danh_dich_vu_thiet_yeu_hoac_thue: "Mạo danh dịch vụ thiết yếu hoặc thuế",
  dau_tu_loi_nhuan_cao_dam_bao: "Hứa lợi nhuận cao, chắc chắn không lỗ",
  nguoi_quen_qua_mang_chua_gap_mat_xin_tien: "Người quen qua mạng xin tiền",
  bao_tin_nguoi_than_gap_nan_qua_ben_thu_ba: "Báo tin người thân gặp nạn qua người thứ ba",
  de_doa_bang_hinh_anh_video_rieng_tu: "Đe dọa bằng hình ảnh hoặc video riêng tư",
  tai_khoan_nguoi_than_bi_hack_muon_tien: "Tài khoản người thân bị hack để mượn tiền",
  gia_danh_ngan_hang_xac_thuc_sinh_trac_hoc: "Giả danh ngân hàng, đòi xác thực sinh trắc học",
  cai_app_dich_vu_cong_gia: "Dụ cài app Dịch vụ công/VNeID giả",
  de_doa_khoa_sim_thue_bao: "Đe dọa khóa SIM/thuê bao",
  lam_nhiem_vu_chot_don_hoa_hong: "Mời làm nhiệm vụ, chốt đơn nhận hoa hồng"
};

function displayRiskLabel(risk) {
  return risk === "An toàn thấp" ? "Chưa thấy dấu hiệu rủi ro" : risk;
}

const ROUTES = {
  "#trang-chu": "homeView",
  "#canh-bao": "canhBaoView",
  "#kiem-tra": "analysisView",
  "#tin-nhan-la": "analysisView",
  "#chuyen-khoan": "transferView",
  "#kiem-tra-lien-ket": "kiemTraLienKetView",
  "#vua-chuyen-tien": "postTransferView",
  "#bang-chung": "evidenceView",
  "#lich-su": "historyView",
  "#hanh-trinh": "hanhTrinhView",
  "#gia-dinh": "familyView",
  "#xac-minh": "verifyView",
  "#thoat-cuoc-goi": "exitCallView",
  "#quyen-rieng-tu": "privacyView",
  "#bao-cao": "reportView",
  "#ho-tro": "supportView",
  "#huong-dan": "educationView"
};

const COMMON_VERIFY_QUESTIONS = [
  "Anh/chị tên đầy đủ là gì?",
  "Anh/chị thuộc đơn vị hoặc công ty nào?",
  "Tôi có thể gọi lại qua số tổng đài chính thức không?",
  "Tôi có thể trao đổi với người thân trước khi quyết định không?"
];

const VERIFY_CATEGORIES = [
  { id: "bank", label: "Ngân hàng", questions: ["Mã hồ sơ hoặc mã yêu cầu của tôi là gì?", "Vì sao cần tôi đọc mã OTP qua điện thoại?"] },
  { id: "police", label: "Công an giả", questions: ["Số hiệu hoặc đơn vị công tác cụ thể của anh/chị là gì?", "Vì sao tôi phải chuyển tiền để chứng minh vô tội?"] },
  { id: "shipper", label: "Shipper / giao hàng", questions: ["Mã đơn hàng là gì? Tôi có đặt món này không?", "Vì sao phải chuyển khoản trước khi nhận hàng?"] },
  { id: "prize", label: "Trúng thưởng", questions: ["Chương trình do đơn vị nào tổ chức, có văn bản xác nhận không?", "Vì sao tôi phải đóng phí để nhận thưởng?"] },
  { id: "job", label: "Tuyển cộng tác viên", questions: ["Công ty có địa chỉ văn phòng, mã số thuế không?", "Vì sao phải nộp tiền trước khi nhận việc?"] },
  { id: "invest", label: "Đầu tư lợi nhuận cao", questions: ["Giấy phép hoạt động đầu tư do cơ quan nào cấp?", "Vì sao lợi nhuận cao bất thường như vậy?"] },
  { id: "loan", label: "Vay tiền / tín dụng", questions: ["Tổ chức cho vay có giấy phép của Ngân hàng Nhà nước không?", "Vì sao phải đóng phí trước khi giải ngân?"] },
  { id: "relative", label: "Tự xưng người thân", questions: ["Hãy nói mật khẩu gia đình đã đặt trước.", "Tôi sẽ gọi lại đúng số đã lưu của người này trước, được không?"] },
  { id: "other", label: "Khác / chưa rõ", questions: [] }
];

const REPORT_CATEGORIES = VERIFY_CATEGORIES.map((cat) => cat.label);

const EDUCATION_LESSONS = [
  { id: "fake-police", title: "Giả danh công an", topic: "Cơ quan có thẩm quyền", scenario: "Một người tự xưng công an nói bác liên quan vụ án và cần chuyển tiền để xác minh.", choices: ["Chuyển ngay để chứng minh", "Cúp máy và tự gọi số chính thức, hỏi người thân"], correct: 1, explanation: "Cơ quan thật không yêu cầu chuyển tiền hoặc đọc OTP qua điện thoại." },
  { id: "fake-bank", title: "Giả danh ngân hàng", topic: "OTP và tài khoản", scenario: "Tin nhắn nói tài khoản có vấn đề, gửi link và yêu cầu nhập mã OTP.", choices: ["Bấm link và nhập OTP", "Không bấm; tự mở app hoặc gọi số trên thẻ"], correct: 1, explanation: "OTP là chìa khóa giao dịch. Ngân hàng không cần bác đọc OTP cho người gọi." },
  { id: "fake-relative", title: "Giả danh con cháu", topic: "Xác minh người thân", scenario: "Số lạ gọi bằng giọng vội, nói đang gặp nạn và cần tiền ngay.", choices: ["Gọi lại số đã lưu hoặc hỏi mật khẩu gia đình", "Chuyển trước rồi hỏi sau"], correct: 0, explanation: "Hãy tạo khoảng dừng và xác minh qua kênh đã lưu." },
  { id: "shipper", title: "Shipper yêu cầu chuyển khoản", topic: "Giao hàng", scenario: "Người giao hàng yêu cầu chuyển khoản vào tài khoản cá nhân dù bác không nhớ đã đặt món.", choices: ["Từ chối và kiểm tra đơn hàng", "Chuyển khoản nhỏ để giữ đơn"], correct: 0, explanation: "Không chuyển tiền cho đơn hàng bác không tự đặt hoặc chưa kiểm tra." },
  { id: "otp", title: "Mã OTP", topic: "Thông tin bí mật", scenario: "Người gọi bảo đọc 6 số vừa gửi đến để hủy giao dịch.", choices: ["Đọc OTP", "Không đọc và kết thúc cuộc gọi"], correct: 1, explanation: "Không cung cấp OTP, mật khẩu, mã PIN cho bất kỳ ai qua điện thoại." },
  { id: "apk", title: "Cài ứng dụng APK", topic: "Thiết bị", scenario: "Người lạ gửi file APK và bảo cài để nhận quà hoặc hỗ trợ tài khoản.", choices: ["Cài vì họ nói là ứng dụng chính thức", "Không cài; hỏi người thân hoặc đơn vị chính thức"], correct: 1, explanation: "APK ngoài kho chính thức có thể chiếm quyền thiết bị." },
  { id: "screen", title: "Chia sẻ màn hình", topic: "Điều khiển từ xa", scenario: "Người gọi yêu cầu chia sẻ màn hình để hướng dẫn thao tác ngân hàng.", choices: ["Chia sẻ để họ hướng dẫn", "Từ chối và gọi lại số chính thức"], correct: 1, explanation: "Chia sẻ màn hình có thể làm lộ OTP và cho phép người khác điều khiển." },
  { id: "investment", title: "Đầu tư lợi nhuận cao", topic: "Tiền và lời hứa", scenario: "Một nhóm chat hứa lợi nhuận đều đặn, chắc chắn không lỗ nếu nộp phí hôm nay.", choices: ["Nộp thử một khoản", "Không chuyển; xin ý kiến người thân và nguồn chính thức"], correct: 1, explanation: "Lợi nhuận cao chắc chắn và yêu cầu nộp thêm phí là dấu hiệu đáng ngờ." },
  { id: "job", title: "Cộng tác viên làm nhiệm vụ", topic: "Việc làm online", scenario: "Bạn được yêu cầu chuyển tiền đặt cọc để hoàn thành nhiệm vụ và nhận hoa hồng.", choices: ["Chuyển cọc để mở nhiệm vụ", "Không chuyển phí trước khi có hợp đồng rõ ràng"], correct: 1, explanation: "Việc làm hợp pháp không bắt nộp tiền để được nhận việc." },
  { id: "deepfake", title: "Deepfake giọng nói", topic: "Giọng nói không đủ để xác minh", scenario: "Bác nghe giọng giống người thân nhưng số gọi đến là số lạ.", choices: ["Tin ngay vì giọng rất giống", "Gọi lại số đã lưu hoặc hỏi câu mật khẩu gia đình"], correct: 1, explanation: "Giọng nói có thể bị giả. Kênh liên lạc đã lưu đáng tin hơn." },
  { id: "recovery-scam", title: "Lừa đảo lấy lại tiền", topic: "Cảnh giác lần hai", scenario: "Một người hứa lấy lại tiền đã mất nếu bác đóng phí hồ sơ trước.", choices: ["Đóng phí để lấy lại tiền", "Không đóng phí; gọi ngân hàng/cơ quan chính thức"], correct: 1, explanation: "Kẻ gian có thể quay lại bằng lời hứa thu hồi tiền. Không có gì đảm bảo họ lấy lại được tiền." },
  { id: "fake-electricity", title: "Giả danh điện lực", topic: "Dọa cắt điện", scenario: "Một người gọi báo bác sắp bị cắt điện và yêu cầu chuyển tiền ngay vào tài khoản cá nhân.", choices: ["Chuyển ngay để không bị cắt điện", "Tự gọi số tổng đài chính thức để kiểm tra"], correct: 1, explanation: "Không chuyển tiền theo số điện thoại lạ. Hãy tự tìm và gọi kênh chính thức của đơn vị điện lực." },
  { id: "fake-vneid", title: "Giả mạo cập nhật VNeID", topic: "Ứng dụng giả", scenario: "Người lạ gửi đường link và yêu cầu cài ứng dụng để cập nhật định danh điện tử.", choices: ["Cài ứng dụng từ đường link", "Không bấm link; chỉ dùng kho ứng dụng chính thức"], correct: 1, explanation: "Ứng dụng giả có thể chiếm quyền điện thoại và tài khoản ngân hàng. Chỉ cài từ kho ứng dụng chính thức." },
  { id: "fake-biometric", title: "Giả mạo xác thực sinh trắc học", topic: "Chiếm tài khoản", scenario: "Người tự xưng nhân viên ngân hàng đề nghị gọi video để quét khuôn mặt và đọc mã OTP.", choices: ["Làm theo để khỏi khóa tài khoản", "Dừng cuộc gọi và liên hệ ngân hàng chính thức"], correct: 1, explanation: "Ngân hàng không yêu cầu đọc OTP hoặc quét khuôn mặt qua cuộc gọi lạ." },
  { id: "fake-sim", title: "Dọa khóa SIM", topic: "Cập nhật thuê bao", scenario: "Một cuộc gọi báo SIM của bác sắp bị khóa và yêu cầu cung cấp mã xác minh vừa gửi đến máy.", choices: ["Đọc mã để giữ SIM", "Không đọc mã; gọi nhà mạng bằng số chính thức"], correct: 1, explanation: "Mã xác minh có thể được dùng để chiếm tài khoản. Tuyệt đối không đọc mã cho người khác." },
  { id: "fake-teacher", title: "Giả danh giáo viên", topic: "Con cháu gặp nạn", scenario: "Người lạ tự xưng giáo viên báo cháu bị tai nạn, yêu cầu chuyển viện phí gấp.", choices: ["Chuyển tiền ngay", "Gọi trực tiếp cho gia đình và nhà trường để xác minh"], correct: 1, explanation: "Kẻ gian thường tạo tình huống khẩn cấp để bác không kịp kiểm tra. Luôn xác minh qua số đã lưu." },
  { id: "romance-investment", title: "Kết bạn rồi rủ đầu tư", topic: "Tình cảm và đầu tư", scenario: "Người quen trên mạng trò chuyện thân thiết rồi hướng dẫn bác nạp tiền vào một sàn đầu tư lạ.", choices: ["Nạp thử số tiền nhỏ", "Không chuyển tiền và nhờ người thân kiểm tra"], correct: 1, explanation: "Lợi dụng tình cảm để dẫn dụ đầu tư là thủ đoạn phổ biến. Sàn lạ có thể hiển thị lợi nhuận giả và chặn rút tiền." }
];

const elements = {
  homeView: document.querySelector("#homeView"),
  homeSupportButton: document.querySelector("#homeSupportButton"),
  homeAlertFamilyCall: document.querySelector("#homeAlertFamilyCall"),
  homeAlertFamilySms: document.querySelector("#homeAlertFamilySms"),
  mobileSituationForm: document.querySelector("#mobileSituationForm"),
  mobileSituationInput: document.querySelector("#mobileSituationInput"),
  mobileSituationFile: document.querySelector("#mobileSituationFile"),
  mobileSituationFileButton: document.querySelector("#mobileSituationFileButton"),
  mobileSituationVoiceButton: document.querySelector("#mobileSituationVoiceButton"),
  mobileSituationSubmit: document.querySelector("#mobileSituationSubmit"),
  mobileSituationFileStatus: document.querySelector("#mobileSituationFileStatus"),
  mobileSituationError: document.querySelector("#mobileSituationError"),
  homeChatUserMessage: document.querySelector("#homeChatUserMessage"),
  homeChatUserText: document.querySelector("#homeChatUserText"),
  homeSuggestionButtons: document.querySelectorAll("[data-home-suggestion]"),
  mobileQuickResult: document.querySelector("#mobileQuickResult"),
  mobileQuickResultTitle: document.querySelector("#mobileQuickResultTitle"),
  mobileQuickResultLead: document.querySelector("#mobileQuickResultLead"),
  mobileQuickResultReasons: document.querySelector("#mobileQuickResultReasons"),
  mobileQuickResultActions: document.querySelector("#mobileQuickResultActions"),
  mobileQuickResultBranches: document.querySelectorAll("[data-mobile-result-branch]"),
  mobileQuickResultNext: document.querySelector("#mobileQuickResultNext"),
  mobileQuickResultFamily: document.querySelector("#mobileQuickResultFamily"),
  mobileQuickResultDetail: document.querySelector("#mobileQuickResultDetail"),
  mobileQuickResultSaveCase: document.querySelector("#mobileQuickResultSaveCase"),
  voiceGuideToggle: document.querySelector("#voiceGuideToggle"),
  fontSizeButtons: document.querySelectorAll("[data-font-size]"),
  supportView: document.querySelector("#supportView"),
  supportDirectory: document.querySelector("#supportDirectory"),
  educationView: document.querySelector("#educationView"),
  educationList: document.querySelector("#educationList"),
  educationLesson: document.querySelector("#educationLesson"),
  educationLessonMeta: document.querySelector("#educationLessonMeta"),
  educationLessonTitle: document.querySelector("#educationLessonTitle"),
  educationScenario: document.querySelector("#educationScenario"),
  educationChoices: document.querySelector("#educationChoices"),
  educationFeedback: document.querySelector("#educationFeedback"),
  educationSpeakButton: document.querySelector("#educationSpeakButton"),
  educationRetryButton: document.querySelector("#educationRetryButton"),
  educationNextButton: document.querySelector("#educationNextButton"),
  canhBaoView: document.querySelector("#canhBaoView"),
  analysisView: document.querySelector("#analysisView"),
  historyView: document.querySelector("#historyView"),
  transferView: document.querySelector("#transferView"),
  postTransferView: document.querySelector("#postTransferView"),
  evidenceView: document.querySelector("#evidenceView"),
  familyView: document.querySelector("#familyView"),
  verifyView: document.querySelector("#verifyView"),
  privacyView: document.querySelector("#privacyView"),
  reportView: document.querySelector("#reportView"),
  reportCategories: document.querySelector("#reportCategories"),
  reportCallerName: document.querySelector("#reportCallerName"),
  reportPhone: document.querySelector("#reportPhone"),
  reportAccount: document.querySelector("#reportAccount"),
  reportAmountField: document.querySelector("#reportAmountField"),
  reportAmount: document.querySelector("#reportAmount"),
  reportEvidencePicker: document.querySelector("#reportEvidencePicker"),
  reportEvidenceEmpty: document.querySelector("#reportEvidenceEmpty"),
  reportSummary: document.querySelector("#reportSummary"),
  reportCopyButton: document.querySelector("#reportCopyButton"),
  reportDownloadButton: document.querySelector("#reportDownloadButton"),
  reportMarkedSent: document.querySelector("#reportMarkedSent"),
  reportAnonymous: document.querySelector("#reportAnonymous"),
  reportHideAccount: document.querySelector("#reportHideAccount"),
  reportQueueButton: document.querySelector("#reportQueueButton"),
  reportQueueStatus: document.querySelector("#reportQueueStatus"),
  privacyDataList: document.querySelector("#privacyDataList"),
  recoveryBanner: document.querySelector("#recoveryBanner"),
  recoveryBannerText: document.querySelector("#recoveryBannerText"),
  recoveryInactive: document.querySelector("#recoveryInactive"),
  recoveryActive: document.querySelector("#recoveryActive"),
  recoveryActiveStatus: document.querySelector("#recoveryActiveStatus"),
  activateRecovery72Button: document.querySelector("#activateRecovery72Button"),
  activateRecovery7dButton: document.querySelector("#activateRecovery7dButton"),
  endRecoveryButton: document.querySelector("#endRecoveryButton"),
  postTransferRecoveryPrompt: document.querySelector("#postTransferRecoveryPrompt"),
  postTransferActivateRecoveryButton: document.querySelector("#postTransferActivateRecoveryButton"),
  toggleSaveHistory: document.querySelector("#toggleSaveHistory"),
  toggleConsentPersonalization: document.querySelector("#toggleConsentPersonalization"),
  toggleFamilySharing: document.querySelector("#toggleFamilySharing"),
  retentionPolicy: document.querySelector("#retentionPolicy"),
  oneTimeCheckMode: document.querySelector("#oneTimeCheckMode"),
  privacyAuditList: document.querySelector("#privacyAuditList"),
  exportDataButton: document.querySelector("#exportDataButton"),
  deleteAllDataButton: document.querySelector("#deleteAllDataButton"),
  verifyCategories: document.querySelector("#verifyCategories"),
  verifyQuestionsCard: document.querySelector("#verifyQuestionsCard"),
  verifyCategoryTitle: document.querySelector("#verifyCategoryTitle"),
  verifyReadAllButton: document.querySelector("#verifyReadAllButton"),
  verifyQuestionList: document.querySelector("#verifyQuestionList"),
  verifyOkButton: document.querySelector("#verifyOkButton"),
  exitCallView: document.querySelector("#exitCallView"),
  exitCallFamilyButton: document.querySelector("#exitCallFamilyButton"),
  exitCallBankButton: document.querySelector("#exitCallBankButton"),

  kiemTraLienKetView: document.querySelector("#kiemTraLienKetView"),
  linkCheckUrl: document.querySelector("#linkCheckUrl"),
  linkCheckImagePickButton: document.querySelector("#linkCheckImagePickButton"),
  linkCheckImageInput: document.querySelector("#linkCheckImageInput"),
  linkCheckBrand: document.querySelector("#linkCheckBrand"),
  linkCheckError: document.querySelector("#linkCheckError"),
  linkCheckSubmitButton: document.querySelector("#linkCheckSubmitButton"),
  linkCheckResultSection: document.querySelector("#linkCheckResultSection"),
  linkCheckResultSummary: document.querySelector("#linkCheckResultSummary"),
  linkCheckResultTitle: document.querySelector("#linkCheckResultTitle"),
  linkCheckResultChain: document.querySelector("#linkCheckResultChain"),
  linkCheckReasonList: document.querySelector("#linkCheckReasonList"),
  linkCheckActionList: document.querySelector("#linkCheckActionList"),
  linkCheckCitationList: document.querySelector("#linkCheckCitationList"),

  transferForm: document.querySelector("#transferForm"),
  transferContact: document.querySelector("#transferContact"),
  transferAccountName: document.querySelector("#transferAccountName"),
  transferAccountNumber: document.querySelector("#transferAccountNumber"),
  transferAmount: document.querySelector("#transferAmount"),
  transferReason: document.querySelector("#transferReason"),
  transferConversation: document.querySelector("#transferConversation"),
  transferError: document.querySelector("#transferError"),
  transferAnalyzeButton: document.querySelector("#transferAnalyzeButton"),
  transferResultSection: document.querySelector("#transferResultSection"),
  transferResultSummary: document.querySelector("#transferResultSummary"),
  transferResultTitle: document.querySelector("#transferResultTitle"),
  transferResultLead: document.querySelector("#transferResultLead"),
  transferReasonList: document.querySelector("#transferReasonList"),
  transferActionList: document.querySelector("#transferActionList"),
  transferCitationList: document.querySelector("#transferCitationList"),
  transferManipulationMap: document.querySelector("#transferManipulationMap"),
  transferTacticList: document.querySelector("#transferTacticList"),

  postTransferGate: document.querySelector("#postTransferGate"),
  postTransferYesButton: document.querySelector("#postTransferYesButton"),
  postTransferNoButton: document.querySelector("#postTransferNoButton"),
  postTransferNotYet: document.querySelector("#postTransferNotYet"),
  postTransferRescue: document.querySelector("#postTransferRescue"),
  postTransferChecklist: document.querySelector("#postTransferChecklist"),
  postTransferCallButton: document.querySelector("#postTransferCallButton"),
  postTransferBankButton: document.querySelector("#postTransferBankButton"),
  postTransferShareChecklistButton: document.querySelector("#postTransferShareChecklistButton"),
  postTransferCopySummaryButton: document.querySelector("#postTransferCopySummaryButton"),
  rescueTransferTime: document.querySelector("#rescueTransferTime"),
  rescueChannel: document.querySelector("#rescueChannel"),
  rescueSharedSecret: document.querySelector("#rescueSharedSecret"),
  rescueTransactionCode: document.querySelector("#rescueTransactionCode"),
  rescueAmount: document.querySelector("#rescueAmount"),
  rescueAccount: document.querySelector("#rescueAccount"),
  rescueBankName: document.querySelector("#rescueBankName"),
  rescueSaveButton: document.querySelector("#rescueSaveButton"),

  evidenceForm: document.querySelector("#evidenceForm"),
  evidenceCallerName: document.querySelector("#evidenceCallerName"),
  evidencePhone: document.querySelector("#evidencePhone"),
  evidenceLink: document.querySelector("#evidenceLink"),
  evidenceBankName: document.querySelector("#evidenceBankName"),
  evidenceAccount: document.querySelector("#evidenceAccount"),
  evidenceTransactionCode: document.querySelector("#evidenceTransactionCode"),
  evidenceTime: document.querySelector("#evidenceTime"),
  evidenceSummary: document.querySelector("#evidenceSummary"),
  evidenceRetention: document.querySelector("#evidenceRetention"),
  evidenceEditingNotice: document.querySelector("#evidenceEditingNotice"),
  evidenceSubmitButton: document.querySelector("#evidenceSubmitButton"),
  evidenceCancelEditButton: document.querySelector("#evidenceCancelEditButton"),
  evidenceFillFromHistoryButton: document.querySelector("#evidenceFillFromHistoryButton"),
  clearEvidenceButton: document.querySelector("#clearEvidenceButton"),
  evidenceList: document.querySelector("#evidenceList"),
  evidenceEmpty: document.querySelector("#evidenceEmpty"),

  analysisForm: document.querySelector("#analysisForm"),
  situation: document.querySelector("#situation"),
  characterCount: document.querySelector("#characterCount"),
  inputError: document.querySelector("#inputError"),
  analyzeButton: document.querySelector("#analyzeButton"),
  speechButton: document.querySelector("#speechButton"),
  checkHubVoiceButton: document.querySelector("#checkHubVoiceButton"),
  speechButtonLabel: document.querySelector("#speechButtonLabel"),
  imageInput: document.querySelector("#imageInput"),
  imagePickButton: document.querySelector("#imagePickButton"),
  imagePreview: document.querySelector("#imagePreview"),
  imagePreviewThumb: document.querySelector("#imagePreviewThumb"),
  selectedFileName: document.querySelector("#selectedFileName"),
  analysisDropzone: document.querySelector("#analysisDropzone"),
  imageRemoveButton: document.querySelector("#imageRemoveButton"),
  cancelAnalysisButton: document.querySelector("#cancelAnalysisButton"),
  recognizedTextBlock: document.querySelector("#recognizedTextBlock"),
  recognizedTextValue: document.querySelector("#recognizedTextValue"),
  resultSection: document.querySelector("#resultSection"),
  resultEmpathy: document.querySelector("#resultEmpathy"),
  resultSummary: document.querySelector("#resultSummary"),
  resultTitle: document.querySelector("#resultTitle"),
  resultLead: document.querySelector("#resultLead"),
  reasonList: document.querySelector("#reasonList"),
  actionList: document.querySelector("#actionList"),
  citationList: document.querySelector("#citationList"),
  familyPasswordReminder: document.querySelector("#familyPasswordReminder"),
  manipulationMap: document.querySelector("#manipulationMap"),
  manipulationTacticList: document.querySelector("#manipulationTacticList"),
  callFamilyButton: document.querySelector("#callFamilyButton"),
  readResultButton: document.querySelector("#readResultButton"),
  resultConfidence: document.querySelector("#resultConfidence"),
  structuredInsightSection: document.querySelector("#structuredInsightSection"),
  structuredInsightTitle: document.querySelector("#structuredInsightTitle"),
  structuredDataStatus: document.querySelector("#structuredDataStatus"),
  predictedNextStepList: document.querySelector("#predictedNextStepList"),
  resultLimitationList: document.querySelector("#resultLimitationList"),
  structuredNextQuestion: document.querySelector("#structuredNextQuestion"),
  signalSummaryList: document.querySelector("#signalSummaryList"),
  reputationType: document.querySelector("#reputationType"),
  reputationValue: document.querySelector("#reputationValue"),
  reputationCheckButton: document.querySelector("#reputationCheckButton"),
  reputationResult: document.querySelector("#reputationResult"),
  editRecognizedTextButton: document.querySelector("#editRecognizedTextButton"),
  reportWrongResultButton: document.querySelector("#reportWrongResultButton"),
  addResultToCaseButton: document.querySelector("#addResultToCaseButton"),

  historyList: document.querySelector("#historyList"),
  historyEmpty: document.querySelector("#historyEmpty"),
  clearHistoryButton: document.querySelector("#clearHistoryButton"),

  hanhTrinhView: document.querySelector("#hanhTrinhView"),
  caseListPanel: document.querySelector("#caseListPanel"),
  caseDetailPanel: document.querySelector("#caseDetailPanel"),
  createCaseButton: document.querySelector("#createCaseButton"),
  caseList: document.querySelector("#caseList"),
  caseListEmpty: document.querySelector("#caseListEmpty"),
  caseDesktopPreview: document.querySelector("#caseDesktopPreview"),
  backToCaseListButton: document.querySelector("#backToCaseListButton"),
  caseDetailEyebrow: document.querySelector("#caseDetailEyebrow"),
  caseDetailLabel: document.querySelector("#caseDetailLabel"),
  caseMetadataForm: document.querySelector("#caseMetadataForm"),
  caseTitleInput: document.querySelector("#caseTitleInput"),
  caseStatusInput: document.querySelector("#caseStatusInput"),
  caseOrganizationInput: document.querySelector("#caseOrganizationInput"),
  casePhoneInput: document.querySelector("#casePhoneInput"),
  caseAccountInput: document.querySelector("#caseAccountInput"),
  caseAmountInput: document.querySelector("#caseAmountInput"),
  caseMoneyTransferredInput: document.querySelector("#caseMoneyTransferredInput"),
  caseSupporterInput: document.querySelector("#caseSupporterInput"),
  caseShareFinancial: document.querySelector("#caseShareFinancial"),
  caseExportButton: document.querySelector("#caseExportButton"),
  journeyResult: document.querySelector("#journeyResult"),
  journeyStageLabel: document.querySelector("#journeyStageLabel"),
  journeyStageDesc: document.querySelector("#journeyStageDesc"),
  journeyNextStep: document.querySelector("#journeyNextStep"),
  journeyCitation: document.querySelector("#journeyCitation"),
  analyzeJourneyButton: document.querySelector("#analyzeJourneyButton"),
  caseTimeline: document.querySelector("#caseTimeline"),
  caseEventTypePicker: document.querySelector("#caseEventTypePicker"),
  caseEventText: document.querySelector("#caseEventText"),
  caseEventImagePickButton: document.querySelector("#caseEventImagePickButton"),
  caseEventImageInput: document.querySelector("#caseEventImageInput"),
  caseEventImagePreview: document.querySelector("#caseEventImagePreview"),
  caseEventImagePreviewThumb: document.querySelector("#caseEventImagePreviewThumb"),
  caseEventImageRemoveButton: document.querySelector("#caseEventImageRemoveButton"),
  caseEventError: document.querySelector("#caseEventError"),
  caseEventSubmitButton: document.querySelector("#caseEventSubmitButton"),

  familyForm: document.querySelector("#familyForm"),
  clearSettingsButton: document.querySelector("#clearSettingsButton"),
  bankPhone: document.querySelector("#bankPhone"),
  contactList: document.querySelector("#contactList"),
  contactEmpty: document.querySelector("#contactEmpty"),
  contactForm: document.querySelector("#contactForm"),
  contactName: document.querySelector("#contactName"),
  contactRole: document.querySelector("#contactRole"),
  contactPhone: document.querySelector("#contactPhone"),
  contactEmail: document.querySelector("#contactEmail"),
  contactPermission: document.querySelector("#contactPermission"),
  contactExpiry: document.querySelector("#contactExpiry"),
  contactError: document.querySelector("#contactError"),
  familyAuditList: document.querySelector("#familyAuditList"),
  familyKeyword: document.querySelector("#familyKeyword"),
  phoneError: document.querySelector("#phoneError"),
  settingsStatus: document.querySelector("#settingsStatus"),

  dangerDialog: document.querySelector("#dangerDialog"),
  dangerTitle: document.querySelector("#dangerTitle"),
  pressureGuide: document.querySelector("#pressureGuide"),
  pressureStepCount: document.querySelector("#pressureStepCount"),
  pressureStepTitle: document.querySelector("#pressureStepTitle"),
  pressureStepText: document.querySelector("#pressureStepText"),
  pressureStepPrevious: document.querySelector("#pressureStepPrevious"),
  pressureStepNext: document.querySelector("#pressureStepNext"),
  pressureStepSpeak: document.querySelector("#pressureStepSpeak"),
  dangerSmartPause: document.querySelector("#dangerSmartPause"),
  pressurePhraseGrid: document.querySelector("#pressurePhraseGrid"),
  dangerCallButton: document.querySelector("#dangerCallButton"),
  dangerBankCallButton: document.querySelector("#dangerBankCallButton"),
  dangerReadButton: document.querySelector("#dangerReadButton"),
  dangerExitCallButton: document.querySelector("#dangerExitCallButton"),
  dangerCountdown: document.querySelector("#dangerCountdown"),
  pressureCountdown: document.querySelector("#pressureCountdown"),
  pressureCalmButton: document.querySelector("#pressureCalmButton"),
  dangerFollowup: document.querySelector("#dangerFollowup"),
  dangerMainActions: document.querySelector("#dangerMainActions"),
  dangerStillPressuredButton: document.querySelector("#dangerStillPressuredButton"),
  dangerOkNowButton: document.querySelector("#dangerOkNowButton"),
  dangerUploadEvidenceButton: document.querySelector("#dangerUploadEvidenceButton"),
  dangerEvidenceInput: document.querySelector("#dangerEvidenceInput"),
  closeDangerButton: document.querySelector("#closeDangerButton"),
  dangerWhy: document.querySelector("#dangerWhy"),
  dangerScriptLine: document.querySelector("#dangerScriptLine"),
  dangerScriptSpeakButton: document.querySelector("#dangerScriptSpeakButton"),

  onboarding: document.querySelector("#onboarding"),
  onboardingScreens: document.querySelectorAll("[data-onboarding-step]"),
  onboardingNextButtons: document.querySelectorAll("[data-onboarding-next]"),
  onboardingBackButtons: document.querySelectorAll("[data-onboarding-back]"),
  onboardingSkipButtons: document.querySelectorAll("[data-onboarding-skip]"),
  onboardingMethodButtons: document.querySelectorAll("[data-onboarding-method]"),
  onboardingMethodStatus: document.querySelector("#onboardingMethodStatus"),
  onboardingBranchButtons: document.querySelectorAll("[data-onboarding-branch]"),
  onboardingBranchStatus: document.querySelector("#onboardingBranchStatus"),
  finishOnboardingButton: document.querySelector("#finishOnboardingButton"),
  finishOnboardingLaterButton: document.querySelector("#finishOnboardingLaterButton"),
  profileMenu: document.querySelector("#profileMenu"),
  profileMenuButton: document.querySelector("#profileMenuButton"),
  profileIconButton: document.querySelector("#profileIconButton"),
  notificationButton: document.querySelector("#notificationButton"),
  desktopSearchForm: document.querySelector("#desktopSearchForm"),
  desktopSearchInput: document.querySelector("#desktopSearchInput"),
  mobileProfileMenuButton: document.querySelector("#mobileProfileMenuButton"),
  profileMenuClose: document.querySelector("#profileMenuClose"),
  reopenOnboardingButton: document.querySelector("#reopenOnboardingButton"),
  logoutButton: document.querySelector("#logoutButton"),
  deleteAccountButton: document.querySelector("#deleteAccountButton"),
  profileIdentityName: document.querySelector("#profileIdentityName"),
  profileIdentityEmail: document.querySelector("#profileIdentityEmail"),
  authLabels: document.querySelectorAll("[data-auth-label]"),
  authDialog: document.querySelector("#authDialog"),
  authDialogClose: document.querySelector("#authDialogClose"),
  authDialogTitle: document.querySelector("#authDialogTitle"),
  authLoginTab: document.querySelector("#authLoginTab"),
  authRegisterTab: document.querySelector("#authRegisterTab"),
  authForm: document.querySelector("#authForm"),
  authNameField: document.querySelector("#authNameField"),
  authName: document.querySelector("#authName"),
  authEmail: document.querySelector("#authEmail"),
  authPassword: document.querySelector("#authPassword"),
  authPasswordToggle: document.querySelector("#authPasswordToggle"),
  authConfirmField: document.querySelector("#authConfirmField"),
  authPasswordConfirm: document.querySelector("#authPasswordConfirm"),
  authError: document.querySelector("#authError"),
  authSubmitButton: document.querySelector("#authSubmitButton"),
  authModeCopy: document.querySelector("#authModeCopy"),
  authModeSwitch: document.querySelector("#authModeSwitch"),
  caseFilterButtons: document.querySelectorAll("[data-case-filter]"),
  bottomNavItems: document.querySelectorAll(".bottom-nav__item"),
  toast: document.querySelector("#toast"),
  chatWidget: document.querySelector("#chatWidget"),
  chatWidgetButton: document.querySelector("#chatWidgetButton"),
  chatWidgetBadge: document.querySelector("#chatWidgetBadge"),
  chatWidgetWindow: document.querySelector("#chatWidgetWindow"),
  chatWidgetClose: document.querySelector("#chatWidgetClose"),
  chatWidgetMessages: document.querySelector("#chatWidgetMessages"),
  chatWidgetForm: document.querySelector("#chatWidgetForm"),
  chatWidgetInput: document.querySelector("#chatWidgetInput"),
  chatWidgetSend: document.querySelector("#chatWidgetSend")
};

let currentResult = null;
let recognition = null;
let activeSpeechTarget = null;
let activeSpeechButton = null;
let activeSpeechLabel = null;
let activeSpeechPrefix = "";
let speechRecognitionHadResult = false;
let toastTimer = null;
let selectedImage = null;
let selectedFile = null;
let currentAnalysisController = null;
let activeCaseFilter = "all";
let authMode = "login";
let countdownTimer = null;
let currentCaseId = null;
let selectedCaseEventImage = null;
let selectedCaseEventType = CASE_EVENT_TYPES[0].id;
let currentEducationIndex = 0;
let currentEducationChoice = null;
let pressureStepIndex = 0;
let mobileQuickResultPayload = null;
let mobileAnalysisController = null;
let onboardingStep = 1;

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Không đọc được ảnh."));
    };
    img.src = url;
  });
}

async function compressImage(file, maxDimension = 1600, quality = 0.82) {
  const { img, url } = await loadImageElement(file);
  try {
    const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.round(img.naturalWidth * scale) || img.naturalWidth;
    const height = Math.round(img.naturalHeight * scale) || img.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(img, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    return { mimeType: "image/jpeg", data: dataUrl.split(",")[1], previewUrl: dataUrl };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      const comma = value.indexOf(",");
      resolve({ mimeType: file.type, data: comma >= 0 ? value.slice(comma + 1) : value });
    };
    reader.onerror = () => reject(new Error("Không đọc được file."));
    reader.readAsDataURL(file);
  });
}

function clearSelectedImage() {
  selectedImage = null;
  selectedFile = null;
  elements.imageInput.value = "";
  elements.imagePreview.hidden = true;
  elements.imagePreviewThumb.src = "";
  elements.imagePreviewThumb.hidden = false;
  elements.selectedFileName.textContent = "";
}

async function handleImageSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!["image/png", "image/jpeg", "image/webp", "application/pdf"].includes(file.type)) {
    showToast("Chỉ nhận ảnh PNG, JPEG, WEBP hoặc PDF.");
    clearSelectedImage();
    return;
  }

  try {
    const encoded = file.type === "application/pdf"
      ? await readFileAsBase64(file)
      : await compressImage(file);
    selectedImage = encoded;
    selectedFile = file;
    elements.imagePreviewThumb.src = encoded.previewUrl || "";
    elements.imagePreviewThumb.hidden = file.type === "application/pdf";
    elements.selectedFileName.textContent = file.type === "application/pdf" ? `PDF đã chọn: ${file.name}` : file.name;
    elements.imagePreview.hidden = false;
    setInputError();
  } catch {
    showToast("Không đọc được ảnh này. Hãy thử ảnh khác.");
    clearSelectedImage();
  }
}

function getStored(key, fallback = "") {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeStored(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function appendPrivacyAudit(action, detail, shared = false) {
  let entries = [];
  try { entries = JSON.parse(getStored(STORAGE_KEYS.privacyAudit, "[]")); } catch { entries = []; }
  entries.unshift({ action, detail, shared, createdAt: new Date().toISOString() });
  setStored(STORAGE_KEYS.privacyAudit, JSON.stringify(entries.slice(0, 30)));
  renderPrivacyAuditLists();
}

function renderPrivacyAuditLists() {
  const containers = [elements.privacyAuditList, elements.familyAuditList].filter(Boolean);
  let entries = [];
  try { entries = JSON.parse(getStored(STORAGE_KEYS.privacyAudit, "[]")); } catch { entries = []; }
  for (const container of containers) {
    container.replaceChildren();
    if (entries.length === 0) {
      const empty = document.createElement("p");
      empty.className = "field-hint";
      empty.textContent = "Chưa có hoạt động chia sẻ hoặc chỉnh quyền.";
      container.append(empty);
      continue;
    }
    for (const entry of entries.slice(0, 8)) {
      const row = document.createElement("p");
      const stamp = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(entry.createdAt));
      row.textContent = `${stamp} · ${entry.detail}${entry.shared ? " · đã chia sẻ theo xác nhận" : " · chỉ lưu trên máy"}`;
      container.append(row);
    }
  }
}

function getHistory() {
  try {
    const parsed = JSON.parse(getStored(STORAGE_KEYS.history, "[]"));
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    return [];
  }
}

function setHistory(history) {
  return setStored(STORAGE_KEYS.history, JSON.stringify(history.slice(0, 5)));
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimer = setTimeout(() => {
    elements.toast.hidden = true;
  }, 4000);
}

function updateCharacterCount() {
  elements.characterCount.textContent = `${elements.situation.value.length.toLocaleString("vi-VN")} / 5.000`;
}

function setInputError(message = "") {
  elements.inputError.textContent = message;
  elements.inputError.hidden = !message;
  elements.situation.setAttribute("aria-invalid", String(Boolean(message)));
}

function setLoading(isLoading) {
  elements.analyzeButton.disabled = isLoading;
  elements.cancelAnalysisButton.hidden = !isLoading;
  elements.analyzeButton.dataset.loading = String(isLoading);
  elements.analyzeButton.querySelector(".button__label").textContent = isLoading
    ? "Đang phân tích..."
    : "Phân tích";
}

function fillList(container, values) {
  container.replaceChildren();
  for (const value of values) {
    const item = document.createElement("li");
    item.textContent = value;
    container.append(item);
  }
}

function renderManipulationTactics(section, container, tactics = []) {
  container.replaceChildren();
  section.hidden = tactics.length === 0;

  for (const tactic of tactics) {
    const item = document.createElement("li");
    const label = document.createElement("strong");
    const description = document.createElement("span");
    label.textContent = tactic.label;
    description.textContent = tactic.description;
    item.append(label, description);
    container.append(item);
  }
}

function getCases() {
  try {
    const parsed = JSON.parse(getStored(STORAGE_KEYS.cases, "[]"));
    return Array.isArray(parsed) ? parsed.slice(0, MAX_CASES) : [];
  } catch {
    return [];
  }
}

function setCases(cases) {
  return setStored(STORAGE_KEYS.cases, JSON.stringify(cases.slice(0, MAX_CASES)));
}

function applyRetentionPolicy() {
  const policy = getStored(STORAGE_KEYS.retentionPolicy, "never");
  const hours = { "24h": 24, "7d": 24 * 7, "30d": 24 * 30, "90d": 24 * 90 }[policy];
  if (!hours) return;
  const cutoff = Date.now() - hours * 3_600_000;
  const keepRecent = (items) => items.filter((item) => {
    const stamp = new Date(item.updatedAt || item.createdAt || 0).getTime();
    return Number.isFinite(stamp) && stamp >= cutoff;
  });
  setHistory(keepRecent(getHistory()));
  setEvidence(keepRecent(getEvidence()));
  setCases(keepRecent(getCases()));
  try {
    const audits = JSON.parse(getStored(STORAGE_KEYS.privacyAudit, "[]"));
    setStored(STORAGE_KEYS.privacyAudit, JSON.stringify(keepRecent(Array.isArray(audits) ? audits : []).slice(0, 50)));
  } catch {
    removeStored(STORAGE_KEYS.privacyAudit);
  }
}

function getCase(caseId) {
  return getCases().find((item) => item.id === caseId) || null;
}

function createCase() {
  const cases = getCases();
  const newCase = {
    id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
    label: `Vụ việc ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(new Date())}`,
    status: "Đang theo dõi",
    riskLevel: "Chưa đủ dữ liệu",
    impersonatedOrganization: "",
    phone: "",
    account: "",
    requestedAmount: "",
    moneyTransferred: false,
    supporter: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    events: []
  };
  cases.unshift(newCase);
  setCases(cases);
  return newCase;
}

function addEventToCase(caseId, event) {
  const cases = getCases();
  const target = cases.find((item) => item.id === caseId);
  if (!target) return null;
  target.events.unshift({
    id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    ...event
  });
  target.events = target.events.slice(0, MAX_EVENTS_PER_CASE);
  if (event.risk) target.riskLevel = displayRiskLabel(event.risk);
  target.updatedAt = new Date().toISOString();
  setCases(cases);
  return target;
}

function deleteCase(caseId) {
  setCases(getCases().filter((item) => item.id !== caseId));
}

function getContacts() {
  try {
    const parsed = JSON.parse(getStored(STORAGE_KEYS.contacts, "[]"));
    return Array.isArray(parsed) ? parsed.slice(0, MAX_CONTACTS) : [];
  } catch {
    return [];
  }
}

function setContacts(contacts) {
  return setStored(STORAGE_KEYS.contacts, JSON.stringify(contacts.slice(0, MAX_CONTACTS)));
}

function migrateLegacyFamilyPhone() {
  if (getContacts().length > 0) return;
  const legacyPhone = getStored(STORAGE_KEYS.phone).trim();
  if (!legacyPhone) return;
  setContacts([{
    id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
    name: "Người thân",
    role: "Con",
    phone: legacyPhone
  }]);
}

function buildTrustedVerificationMessage() {
  const latest = getHistory()[0];
  const riskSummary = latest?.risk
    ? ` Kết quả tham khảo trên Khoan Đã: ${displayRiskLabel(latest.risk)}.`
    : "";
  return `Bác đang cần con/cháu gọi lại để cùng xác minh một tình huống đáng ngờ.${riskSummary} Không yêu cầu bác gửi OTP, mật khẩu hoặc chuyển tiền qua tin nhắn này.`;
}

async function shareTrustedVerificationRequest(contact) {
  const message = buildTrustedVerificationMessage();
  appendPrivacyAudit("support_request_shared", `Mở chia sẻ để nhờ ${contact.name} xác minh`, false);

  try {
    if (navigator.share) {
      await navigator.share({ title: "Nhờ người thân xác minh", text: message });
      return;
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
      showToast("Đã sao chép lời nhờ xác minh để bác gửi cho người thân.");
      return;
    }
    window.location.href = `sms:${contact.phone.replace(/[^+\d]/g, "")}?body=${encodeURIComponent(message)}`;
  } catch (error) {
    if (error?.name !== "AbortError") {
      showToast("Chưa mở được ứng dụng chia sẻ. Bác hãy gọi trực tiếp cho người thân.");
    }
  }
}

function renderContactList() {
  const contacts = getContacts();
  elements.contactList.replaceChildren();
  elements.contactEmpty.hidden = contacts.length > 0;
  elements.contactForm.hidden = contacts.length >= MAX_CONTACTS;

  // Update contact count
  const countEl = document.querySelector("#contactCount");
  if (countEl) countEl.textContent = `(${contacts.length}/5)`;

  for (const contact of contacts) {
    const row = document.createElement("article");
    row.className = "contact-entry";

    // Avatar with initials
    const avatar = document.createElement("div");
    avatar.className = "contact-entry__avatar";
    avatar.setAttribute("aria-hidden", "true");
    const initials = contact.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    avatar.textContent = initials;

    const info = document.createElement("div");
    info.className = "contact-entry__info";

    const nameRow = document.createElement("div");
    nameRow.className = "contact-entry__name-row";
    const name = document.createElement("p");
    name.className = "contact-entry__name";
    name.textContent = contact.name;

    const roleChip = document.createElement("span");
    roleChip.className = "contact-entry__role-chip";
    roleChip.textContent = contact.role;
    nameRow.append(name, roleChip);

    const phone = document.createElement("p");
    phone.className = "contact-entry__phone";
    phone.innerHTML = `<span class="icon icon-phone" aria-hidden="true"></span>${contact.phone}`;

    info.append(nameRow, phone);

    const actions = document.createElement("div");
    actions.className = "contact-entry__actions";

    const callButton = document.createElement("button");
    callButton.className = "button button-primary contact-entry__call";
    callButton.type = "button";
    callButton.innerHTML = '<span class="icon icon-phone" aria-hidden="true"></span><span>Gọi nhanh</span>';
    callButton.addEventListener("click", () => {
      window.location.href = `tel:${contact.phone.replace(/[^+\d]/g, "")}`;
    });

    const alertButton = document.createElement("button");
    alertButton.className = "button button-secondary contact-entry__alert";
    alertButton.type = "button";
    alertButton.innerHTML = '<span class="icon icon-alert" aria-hidden="true"></span><span>Báo tin</span>';
    alertButton.addEventListener("click", () => shareTrustedVerificationRequest(contact));

    const menuButton = document.createElement("button");
    menuButton.className = "button button-secondary contact-entry__menu";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "Thêm tùy chọn");
    menuButton.textContent = "⋮";
    menuButton.addEventListener("click", (e) => {
      // Simple inline menu - in production this would be a proper dropdown
      const menu = document.createElement("div");
      menu.className = "contact-entry__menu-popup";
      menu.innerHTML = `
        <button type="button" data-action="revoke">Thu hồi quyền</button>
        <button type="button" data-action="delete">Xóa</button>
      `;
      menu.addEventListener("click", (ev) => {
        const action = ev.target.dataset.action;
        if (action === "delete") {
          setContacts(getContacts().filter((item) => item.id !== contact.id));
          appendPrivacyAudit("contact_deleted", `Đã xóa liên hệ ${contact.name}`);
          renderContactList();
        } else if (action === "revoke") {
          const updated = getContacts().map((item) => item.id === contact.id ? { ...item, permissionLevel: "call_only", permissionExpiresAt: null } : item);
          setContacts(updated);
          appendPrivacyAudit("permission_revoked", `Thu hồi quyền của ${contact.name}`);
          renderContactList();
          showToast("Đã thu hồi quyền chia sẻ của liên hệ này.");
        }
        menu.remove();
      });

      // Remove any existing menu
      document.querySelectorAll(".contact-entry__menu-popup").forEach(m => m.remove());

      row.style.position = "relative";
      row.append(menu);
    });

    actions.append(callButton, alertButton, menuButton);
    row.append(avatar, info, actions);
    elements.contactList.append(row);
  }
}

function addContact(event) {
  event.preventDefault();
  const name = elements.contactName.value.trim();
  const role = elements.contactRole.value;
  const phone = elements.contactPhone.value.trim();
  const email = elements.contactEmail.value.trim();
  const permissionLevel = elements.contactPermission.value;
  const expiryOption = elements.contactExpiry.value;
  const phoneIsValid = /^\+?[\d\s().-]{8,20}$/.test(phone);

  if (!name || !phoneIsValid) {
    elements.contactError.textContent = !name
      ? "Hãy nhập tên người thân."
      : "Số điện thoại chưa đúng. Hãy kiểm tra lại.";
    elements.contactError.hidden = false;
    return;
  }
  if (getContacts().length >= MAX_CONTACTS) {
    elements.contactError.textContent = "Đã đủ 5 liên hệ, hãy xóa bớt trước khi thêm mới.";
    elements.contactError.hidden = false;
    return;
  }

  elements.contactError.hidden = true;
  const contacts = getContacts();
  contacts.push({
    id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
    name,
    role,
    phone,
    email,
    permissionLevel,
    permissionExpiresAt: expiryOption === "24h"
      ? new Date(Date.now() + 86_400_000).toISOString()
      : expiryOption === "7d" ? new Date(Date.now() + 7 * 86_400_000).toISOString() : null,
    verified: false,
    addedAt: new Date().toISOString()
  });
  setContacts(contacts);
  elements.contactForm.reset();
  renderContactList();
  appendPrivacyAudit("contact_added", `Đã thêm liên hệ ${name}`);
  showToast("Đã thêm liên hệ.");
}

function primaryContactPhone() {
  const [primary] = getContacts();
  if (primary) return primary.phone.replace(/[^+\d]/g, "");
  return getStored(STORAGE_KEYS.phone).replace(/[^+\d]/g, "");
}

function phoneForCall() {
  return primaryContactPhone();
}

function bankPhoneForCall() {
  return getStored(STORAGE_KEYS.bankPhone).replace(/[^+\d]/g, "");
}

function callFamily() {
  const phone = phoneForCall();
  if (!phone) {
    if (elements.dangerDialog.open) elements.dangerDialog.close();
    showToast("Hãy lưu số người thân trước.");
    window.location.hash = "#gia-dinh";
    return;
  }
  window.location.href = `tel:${phone}`;
}

// Parent taps "Nhắn tin báo" → opens the SMS app pre-filled to the saved
// contact. The browser cannot send it silently, so the parent still taps send;
// nothing leaves the device automatically.
function alertFamilyBySms() {
  const phone = primaryContactPhone();
  if (!phone) {
    showToast("Hãy lưu số con cháu trong Hồ sơ trước.");
    window.location.hash = "#gia-dinh";
    return;
  }
  const message = "Bố/mẹ đang gặp một tình huống đáng ngờ, con gọi lại cho bố/mẹ ngay nhé. Đừng gửi OTP, mật khẩu hay chuyển tiền qua tin nhắn này.";
  appendPrivacyAudit("family_alert_prepared", "Mở tin nhắn báo cho con cháu", false);
  window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
}

function callBank() {
  const phone = bankPhoneForCall();
  if (!phone) {
    if (elements.dangerDialog.open) elements.dangerDialog.close();
    showToast("Hãy chọn đúng tổng đài chính thức của ngân hàng.");
    window.location.hash = "#ho-tro";
    return;
  }
  window.location.href = `tel:${phone}`;
}

const PRESSURE_PHRASE_LABELS = {
  chuyen_ngay: "\"Chuyển ngay trong vài phút\"",
  giu_bi_mat: "\"Không được kể cho ai\"",
  doc_otp: "\"Đọc mã OTP để xác minh\""
};

const PRESSURE_STEPS = [
  { title: "Đặt điện thoại xuống hoặc bật loa ngoài", text: "Bác không cần trả lời ngay. Hãy để điện thoại cách xa tay và hít thở chậm." },
  { title: "Không chuyển tiền, không đọc mã", text: "Không chuyển thêm tiền, không đọc OTP, mật khẩu hoặc mã PIN cho người đang liên hệ." },
  { title: "Nói một câu để kết thúc", text: "Bác có thể nói: Tôi sẽ tự gọi lại bằng số chính thức. Bây giờ tôi xin phép dừng cuộc gọi." },
  { title: "Gọi một người thân đã lưu", text: "Dùng nút Gọi người thân bên dưới. Kể lại ngắn gọn điều họ vừa yêu cầu bác làm." },
  { title: "Gọi ngân hàng bằng số chính thức", text: "Nếu đã mở ứng dụng ngân hàng hoặc cung cấp thông tin, hãy gọi số trên thẻ hoặc số bác đã tự lưu." },
  { title: "Lưu bằng chứng và nhờ hỗ trợ", text: "Giữ lại tin nhắn, số điện thoại và biên lai. Nếu bị đe dọa trực tiếp, gọi 113 hoặc đến công an gần nhất." }
];

let selectedPressurePhrases = new Set();
let lastViewedCaseId = null;

function resetSmartPause() {
  selectedPressurePhrases = new Set();
  elements.pressurePhraseGrid.querySelectorAll(".phrase-chip").forEach((chip) => {
    chip.setAttribute("aria-pressed", "false");
  });
}

function togglePressurePhrase(phrase) {
  if (phrase === "khong_co") {
    selectedPressurePhrases = selectedPressurePhrases.has("khong_co") ? new Set() : new Set(["khong_co"]);
  } else if (selectedPressurePhrases.has(phrase)) {
    selectedPressurePhrases.delete(phrase);
  } else {
    selectedPressurePhrases.delete("khong_co");
    selectedPressurePhrases.add(phrase);
  }

  elements.pressurePhraseGrid.querySelectorAll(".phrase-chip").forEach((chip) => {
    chip.setAttribute("aria-pressed", String(selectedPressurePhrases.has(chip.dataset.phrase)));
  });
}

function logSmartPauseToJourney() {
  const chosen = [...selectedPressurePhrases].filter((phrase) => phrase !== "khong_co");
  if (chosen.length === 0 || !lastViewedCaseId || !getCase(lastViewedCaseId)) return;

  const summary = `Ghi nhận trong lúc Dừng lại: đã nghe câu ${chosen
    .map((phrase) => PRESSURE_PHRASE_LABELS[phrase])
    .join(", ")}.`;
  addEventToCase(lastViewedCaseId, { type: "khac", text: summary, signals: null, risk: null });
}

function stopDangerCountdown() {
  clearInterval(countdownTimer);
  countdownTimer = null;
  elements.dangerFollowup.hidden = true;
  elements.dangerMainActions.hidden = false;
  logSmartPauseToJourney();
  resetSmartPause();
}

function startDangerCountdown() {
  stopDangerCountdown();
  let remaining = 60;
  elements.dangerCountdown.textContent = String(remaining);
  elements.pressureCountdown.textContent = String(remaining);
  countdownTimer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      elements.dangerCountdown.textContent = "0";
      elements.pressureCountdown.textContent = "0";
      clearInterval(countdownTimer);
      countdownTimer = null;
      elements.dangerMainActions.hidden = true;
      elements.dangerFollowup.hidden = false;
      elements.dangerStillPressuredButton.focus();
      return;
    }
    elements.dangerCountdown.textContent = String(remaining);
    elements.pressureCountdown.textContent = String(remaining);
  }, 1000);
}

function renderPressureStep() {
  const step = PRESSURE_STEPS[pressureStepIndex];
  elements.pressureStepCount.textContent = `Bước ${pressureStepIndex + 1}/${PRESSURE_STEPS.length}`;
  elements.pressureStepTitle.textContent = step.title;
  elements.pressureStepText.textContent = step.text;
  elements.pressureStepPrevious.disabled = pressureStepIndex === 0;
  elements.pressureStepNext.textContent = pressureStepIndex === PRESSURE_STEPS.length - 1 ? "Xong" : "Bước tiếp";
}

function openDangerDialog(mode) {
  const isPressureMode = mode === "pressure";
  elements.dangerTitle.textContent = isPressureMode ? "Bác đang bị thúc ép" : "Nguy hiểm cao";
  elements.pressureGuide.hidden = !isPressureMode;
  elements.closeDangerButton.hidden = isPressureMode;
  elements.dangerUploadEvidenceButton.hidden = !isPressureMode;
  elements.dangerDialog.dataset.mode = mode;
  // Mở lại hộp thoại phải luôn thu gọn phần giải thích, nếu không lần cảnh báo
  // sau sẽ đẩy 6 mục cứu người xuống dưới nếp gấp. Chế độ thúc ép thì mở sẵn
  // vì nút chụp bằng chứng nằm trong đó.
  elements.dangerWhy.open = false;
  pressureStepIndex = 0;
  renderPressureStep();
  startDangerCountdown();
  if (!elements.dangerDialog.open) elements.dangerDialog.showModal();
  if (getStored(STORAGE_KEYS.voiceGuide) === "1") {
    window.setTimeout(() => {
      if (isPressureMode) {
        const step = PRESSURE_STEPS[0];
        window.KhoanDaServices.textToSpeechService.speak(`${step.title}. ${step.text}`);
      } else {
        speakResult();
      }
    }, 250);
  }
}

async function analyzeDangerEvidence(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    showToast("Chỉ nhận ảnh PNG, JPEG hoặc WEBP.");
    return;
  }

  showToast("Đang đọc ảnh...");
  try {
    const compressed = await compressImage(file);
    const payload = await window.KhoanDaServices.ocrService.analyzeMedia({
      van_ban: "",
      tep: { mimeType: compressed.mimeType, data: compressed.data }
    });

    const entries = getEvidence();
    entries.unshift({
      id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
      createdAt: new Date().toISOString(),
      phone: "",
      link: "",
      account: "",
      contactTime: "",
      summary: payload.noi_dung_da_doc || "(Ảnh không đọc rõ được nội dung.)",
      riskLevel: payload.muc_rui_ro,
      riskSignals: payload.ly_do || [],
      retentionDays: 30
    });
    setEvidence(entries);
    showToast("Đã đọc ảnh và lưu vào nhật ký bằng chứng.");
  } catch (error) {
    showToast(error.message || "Không đọc được ảnh này.");
  } finally {
    elements.dangerEvidenceInput.value = "";
  }
}

function renderSignalSummary(signals = {}) {
  elements.signalSummaryList.replaceChildren();
  const entries = Object.entries(signals).filter(([, value]) => value === true);
  if (entries.length === 0) {
    const item = document.createElement("li");
    item.className = "signal-item signal-item--clear";
    item.textContent = "Chưa thấy tín hiệu nguy hiểm rõ trong phần bác cung cấp.";
    elements.signalSummaryList.append(item);
    return;
  }
  for (const [key] of entries) {
    const item = document.createElement("li");
    item.className = "signal-item";
    item.innerHTML = '<span class="icon icon-alert" aria-hidden="true"></span>';
    const text = document.createElement("span");
    text.textContent = SIGNAL_LABELS[key] || key;
    item.append(text);
    elements.signalSummaryList.append(item);
  }
}

function renderStructuredInsights(structuredResult) {
  if (!structuredResult) {
    elements.structuredInsightSection.hidden = true;
    return;
  }

  elements.structuredInsightTitle.textContent = structuredResult.summary || "Khoan Đã đã tổng hợp dấu hiệu chính.";
  elements.structuredDataStatus.textContent = structuredResult.dataStatus || "Cần thêm thông tin.";
  fillList(
    elements.predictedNextStepList,
    (structuredResult.predictedNextSteps || []).map((step) => step.label || step).slice(0, 3)
  );
  fillList(elements.resultLimitationList, (structuredResult.limitations || []).slice(0, 3));
  elements.structuredNextQuestion.textContent = structuredResult.nextQuestion?.question
    ? `Câu hỏi tiếp theo: ${structuredResult.nextQuestion.question}`
    : "";
  elements.structuredInsightSection.hidden = false;
}

function renderResult(result, options = {}) {
  const riskLabel = displayRiskLabel(result.muc_rui_ro);
  const meta = RISK_META[riskLabel] || RISK_META["Nghi ngờ"];
  currentResult = { ...result, muc_rui_ro: riskLabel };
  if (result.loi_dong_cam) {
    elements.resultEmpathy.textContent = result.loi_dong_cam;
    elements.resultEmpathy.hidden = false;
  } else {
    elements.resultEmpathy.hidden = true;
  }
  elements.resultTitle.textContent = riskLabel;
  elements.resultLead.textContent = meta.lead;
  elements.resultSummary.dataset.risk = meta.key;
  const signalCount = Object.values(result.tin_hieu || {}).filter(Boolean).length;
  elements.resultConfidence.textContent = signalCount >= 3 ? "Cao" : signalCount >= 1 ? "Trung bình" : "Thấp";
  renderStructuredInsights(result.structuredResult);
  renderSignalSummary(result.tin_hieu || {});
  fillList(elements.reasonList, result.ly_do || []);
  fillList(elements.actionList, result.hanh_dong || []);
  fillList(elements.citationList, result.trich_dan || []);
  renderManipulationTactics(
    elements.manipulationMap,
    elements.manipulationTacticList,
    result.chien_thuat_thao_tung || []
  );
  elements.familyPasswordReminder.hidden = result.tin_hieu?.tu_xung_nguoi_than_nhung_dang_ngo !== true;
  if (result.noi_dung_da_doc) {
    elements.recognizedTextValue.textContent = result.noi_dung_da_doc;
    elements.recognizedTextBlock.hidden = false;
  } else {
    elements.recognizedTextBlock.hidden = true;
  }
  elements.resultSection.hidden = false;

  if (options.focus !== false) {
    elements.resultSection.focus({ preventScroll: true });
    elements.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (meta.key === "high" && options.showDanger !== false) {
    openDangerDialog("analysis");
  } else if (getStored(STORAGE_KEYS.voiceGuide) === "1") {
    window.setTimeout(speakResult, 250);
  }
}

function addHistory(text, result) {
  if (getStored(STORAGE_KEYS.saveHistoryDisabled) === "1" || getStored(STORAGE_KEYS.oneTimeCheck) === "1") return;
  const history = getHistory();
  history.unshift({
    id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
    text,
    risk: result.muc_rui_ro,
    createdAt: new Date().toISOString(),
    result
  });
  setHistory(history);
}

async function checkReputation() {
  const value = elements.reputationValue.value.trim();
  if (!value) {
    elements.reputationResult.textContent = "Hãy nhập số, tài khoản hoặc đường link trước.";
    return;
  }
  elements.reputationCheckButton.disabled = true;
  elements.reputationResult.textContent = "Đang kiểm tra nguồn dữ liệu...";
  try {
    const result = await window.KhoanDaServices.reputationService.lookup({
      loai: elements.reputationType.value,
      gia_tri: value
    });
    const status = result.status === "configured_official"
      ? "Khớp danh sách cấu hình tham khảo"
      : result.status === "caution" ? "Cần thận trọng" : "Chưa có dữ liệu xác minh";
    elements.reputationResult.textContent = `${status}. ${result.moderationNote} Nguồn: ${result.source}${result.isDemoData ? " (dữ liệu minh họa)" : ""}`;
    appendPrivacyAudit("reputation_lookup", `Kiểm tra ${elements.reputationType.value}`, false);
  } catch (error) {
    elements.reputationResult.textContent = error.message;
  } finally {
    elements.reputationCheckButton.disabled = false;
  }
}

function editRecognizedText() {
  if (!currentResult) return;
  const replacement = window.prompt("Sửa nội dung AI đã đọc (không nhập OTP hoặc mật khẩu):", currentResult.noi_dung_da_doc || "");
  if (replacement === null) return;
  currentResult.noi_dung_da_doc = replacement.slice(0, 5000);
  elements.recognizedTextValue.textContent = currentResult.noi_dung_da_doc;
  elements.recognizedTextBlock.hidden = false;
  showToast("Đã cập nhật phần nội dung bác muốn dùng làm bằng chứng.");
}

function reportWrongResult() {
  let queue;
  try {
    const parsed = JSON.parse(getStored(STORAGE_KEYS.reportQueue, "[]"));
    queue = Array.isArray(parsed) ? parsed : [];
  } catch {
    queue = [];
  }
  queue.unshift({ id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()), type: "ai_result_correction", createdAt: new Date().toISOString(), risk: currentResult?.muc_rui_ro || "unknown" });
  setStored(STORAGE_KEYS.reportQueue, JSON.stringify(queue.slice(0, 20)));
  appendPrivacyAudit("ai_correction", "Báo kết quả AI chưa đúng", false);
  showToast("Đã ghi nhận phản hồi trên máy này; chưa gửi tự động đi đâu.");
}

function addCurrentResultToCase() {
  const caseObj = createCase();
  addEventToCase(caseObj.id, { type: "khac", text: currentResult?.noi_dung_da_doc || "Kết quả kiểm tra từ Khoan Đã", signals: currentResult?.tin_hieu || null, risk: currentResult?.muc_rui_ro || null });
  window.location.hash = "#hanh-trinh";
  showCaseDetail(caseObj.id);
}

async function analyze(event) {
  event.preventDefault();
  const text = elements.situation.value.trim();

  if (!text && !selectedImage) {
    setInputError("Hãy kể, nói hoặc tải ảnh tình huống cần kiểm tra.");
    elements.situation.focus();
    return;
  }

  setInputError();
  setLoading(true);
  currentAnalysisController?.abort();
  currentAnalysisController = new AbortController();

  try {
    const payload = await window.KhoanDaServices.scamAnalysisService.analyze({
      van_ban: text,
      tep: selectedImage ? { mimeType: selectedImage.mimeType, data: selectedImage.data } : undefined,
      che_do_phuc_hoi: Boolean(getRecoveryMode())
    }, { signal: currentAnalysisController.signal });

    addHistory(text || payload.noi_dung_da_doc || "Tình huống từ ảnh", payload);
    renderResult(payload);
    clearSelectedImage();
  } catch (error) {
    setInputError(error.message);
    elements.situation.focus();
  } finally {
    setLoading(false);
    currentAnalysisController = null;
  }
}

function setTransferLoading(isLoading) {
  elements.transferAnalyzeButton.disabled = isLoading;
  elements.transferAnalyzeButton.dataset.loading = String(isLoading);
  elements.transferAnalyzeButton.querySelector(".button__label").textContent = isLoading
    ? "Đang kiểm tra..."
    : "Kiểm tra giao dịch";
}

function renderTransferResult(result) {
  const riskLabel = displayRiskLabel(result.muc_rui_ro);
  const meta = RISK_META[riskLabel] || RISK_META["Nghi ngờ"];
  elements.transferResultTitle.textContent = riskLabel;
  elements.transferResultLead.textContent = meta.lead;
  elements.transferResultSummary.dataset.risk = meta.key;
  fillList(elements.transferReasonList, result.ly_do || []);
  fillList(elements.transferActionList, result.hanh_dong || []);
  fillList(elements.transferCitationList, result.trich_dan || []);
  renderManipulationTactics(
    elements.transferManipulationMap,
    elements.transferTacticList,
    result.chien_thuat_thao_tung || []
  );
  elements.transferResultSection.hidden = false;
  elements.transferResultSection.focus({ preventScroll: true });
  elements.transferResultSection.scrollIntoView({ behavior: "smooth", block: "start" });

  if (meta.key === "high") {
    openDangerDialog("analysis");
  }
}

async function analyzeTransfer(event) {
  event.preventDefault();

  const payload = {
    ten_nguoi_lien_he: elements.transferContact.value.trim(),
    ten_chu_tai_khoan: elements.transferAccountName.value.trim(),
    so_tai_khoan: elements.transferAccountNumber.value.trim(),
    so_tien: elements.transferAmount.value.trim(),
    ly_do: elements.transferReason.value.trim(),
    noi_dung_tro_chuyen: elements.transferConversation.value.trim()
  };

  if (!Object.values(payload).some(Boolean)) {
    elements.transferError.textContent = "Hãy điền ít nhất một thông tin để kiểm tra.";
    elements.transferError.hidden = false;
    elements.transferContact.focus();
    return;
  }

  elements.transferError.hidden = true;
  setTransferLoading(true);

  try {
    const result = await window.KhoanDaServices.scamAnalysisService.transfer(payload);
    renderTransferResult(result);
  } catch (error) {
    elements.transferError.textContent = error.message;
    elements.transferError.hidden = false;
  } finally {
    setTransferLoading(false);
  }
}

async function decodeQrFromFile(file) {
  const { img, url } = await loadImageElement(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const decoded = typeof jsQR === "function"
      ? jsQR(imageData.data, imageData.width, imageData.height)
      : null;
    return decoded ? decoded.data : null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function setLinkCheckError(message = "") {
  elements.linkCheckError.textContent = message;
  elements.linkCheckError.hidden = !message;
}

async function handleLinkCheckImageSelected(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    showToast("Chỉ nhận ảnh PNG, JPEG hoặc WEBP.");
    return;
  }

  try {
    const decoded = await decodeQrFromFile(file);
    if (!decoded) {
      showToast("Không đọc được mã QR trong ảnh này. Hãy thử chụp lại rõ hơn.");
      return;
    }
    elements.linkCheckUrl.value = decoded;
    setLinkCheckError();
  } catch {
    showToast("Không đọc được ảnh này. Hãy thử ảnh khác.");
  }
}

function renderLinkCheckResult(result) {
  const riskLabel = displayRiskLabel(result.muc_rui_ro);
  const meta = RISK_META[riskLabel] || RISK_META["Nghi ngờ"];
  elements.linkCheckResultTitle.textContent = riskLabel;
  elements.linkCheckResultChain.textContent = result.chuoi_chuyen_huong?.length
    ? `Chuỗi chuyển hướng: ${result.chuoi_chuyen_huong.join(" → ")}`
    : "";
  elements.linkCheckResultSummary.dataset.risk = meta.key;
  fillList(elements.linkCheckReasonList, result.ly_do || []);
  fillList(elements.linkCheckActionList, result.hanh_dong || []);
  fillList(elements.linkCheckCitationList, result.trich_dan || []);
  elements.linkCheckResultSection.hidden = false;
  elements.linkCheckResultSection.focus({ preventScroll: true });
  elements.linkCheckResultSection.scrollIntoView({ behavior: "smooth", block: "start" });

  if (meta.key === "high") {
    openDangerDialog("analysis");
  }
}

function setLinkCheckLoading(isLoading) {
  elements.linkCheckSubmitButton.disabled = isLoading;
  elements.linkCheckSubmitButton.querySelector(".button__label").textContent = isLoading
    ? "Đang kiểm tra..."
    : "Kiểm tra";
}

async function submitLinkCheck() {
  const duongDan = elements.linkCheckUrl.value.trim();
  if (!duongDan) {
    setLinkCheckError("Hãy dán một đường link hoặc quét mã QR trước.");
    elements.linkCheckUrl.focus();
    return;
  }

  setLinkCheckError();
  setLinkCheckLoading(true);

  try {
    const result = await window.KhoanDaServices.scamAnalysisService.link({
      duong_dan: duongDan,
      thuong_hieu_tu_xung: elements.linkCheckBrand.value.trim()
    });
    renderLinkCheckResult(result);
  } catch (error) {
    setLinkCheckError(error.message);
  } finally {
    setLinkCheckLoading(false);
  }
}

function showPostTransferGate() {
  elements.postTransferGate.hidden = false;
  elements.postTransferNotYet.hidden = true;
  elements.postTransferRescue.hidden = true;
}

function showPostTransferRescue() {
  elements.postTransferGate.hidden = true;
  elements.postTransferNotYet.hidden = true;
  elements.postTransferRescue.hidden = false;
  elements.postTransferRecoveryPrompt.hidden = Boolean(getRecoveryMode());
  restoreChecklist();
}

function showPostTransferNotYet() {
  elements.postTransferGate.hidden = true;
  elements.postTransferRescue.hidden = true;
  elements.postTransferNotYet.hidden = false;
}

function saveRescueEvidence() {
  const entries = getEvidence();
  entries.unshift({
    id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    callerName: "",
    phone: "",
    link: "",
    bankName: elements.rescueBankName.value.trim(),
    account: elements.rescueAccount.value.trim(),
    transactionCode: elements.rescueTransactionCode.value.trim(),
    contactTime: elements.rescueTransferTime.value || "",
    summary: [
      `Số tiền đã chuyển: ${elements.rescueAmount.value.trim() || "(chưa ghi)"}`,
      `Kênh chuyển: ${elements.rescueChannel.value || "(chưa ghi)"}`,
      `Đã cung cấp thông tin/OTP/chia sẻ màn hình: ${elements.rescueSharedSecret.value || "(chưa ghi)"}`
    ].join("\n"),
    retentionDays: 30
  });
  setEvidence(entries);
  showToast("Đã lưu vào nhật ký bằng chứng.");
}

function buildShareableChecklist() {
  const items = [...elements.postTransferChecklist.querySelectorAll(".checklist__item")];
  const lines = [
    "CHECKLIST CỨU HỘ SAU CHUYỂN TIỀN — LÁ CHẮN SỐ",
    "(Để người thân xem và hỗ trợ từ xa)",
    ""
  ];
  items.forEach((item) => {
    const checked = item.querySelector("input[type=checkbox]").checked;
    const title = item.querySelector(".checklist__title").textContent;
    lines.push(`${checked ? "[x]" : "[ ]"} ${title}`);
  });
  return lines.join("\n");
}

function shareChecklist() {
  downloadTextFile("checklist-cuu-ho-khoan-da.txt", buildShareableChecklist());
  showToast("Đã tải checklist — gửi file này cho người thân.");
}

async function copySummaryForBank() {
  const lines = [
    "TÓM TẮT GỬI NGÂN HÀNG — LÁ CHẮN SỐ",
    `Thời điểm báo cáo: ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "full", timeStyle: "short" }).format(new Date())}`,
    `Mã giao dịch: ${elements.rescueTransactionCode.value.trim() || "(chưa ghi)"}`,
    `Số tiền đã chuyển: ${elements.rescueAmount.value.trim() || "(chưa ghi)"}`,
    `Số tài khoản nhận: ${elements.rescueAccount.value.trim() || "(chưa ghi)"}`,
    `Ngân hàng của tôi: ${elements.rescueBankName.value.trim() || "(chưa ghi)"}`,
    `Thời gian chuyển: ${elements.rescueTransferTime.value || "(chưa ghi)"}`,
    `Kênh chuyển: ${elements.rescueChannel.value || "(chưa ghi)"}`,
    `Đã cung cấp OTP/mật khẩu/chia sẻ màn hình: ${elements.rescueSharedSecret.value || "(chưa ghi)"}`,
    "",
    "Đề nghị hỗ trợ tra soát/phong tỏa giao dịch nghi ngờ lừa đảo theo quy trình của ngân hàng."
  ];
  const text = lines.join("\n");
  try {
    await navigator.clipboard.writeText(text);
    showToast("Đã sao chép — dán vào tin nhắn hoặc email gửi ngân hàng.");
  } catch {
    downloadTextFile("tom-tat-gui-ngan-hang.txt", text);
    showToast("Trình duyệt không cho sao chép, đã tải file thay thế.");
  }
}

function restoreChecklist() {
  let checked = [];
  try {
    checked = JSON.parse(getStored(STORAGE_KEYS.checklist, "[]"));
  } catch {
    checked = [];
  }
  elements.postTransferChecklist.querySelectorAll("[data-step-checkbox]").forEach((box) => {
    box.checked = checked.includes(box.dataset.stepCheckbox);
  });
}

function persistChecklist() {
  const checked = [...elements.postTransferChecklist.querySelectorAll("[data-step-checkbox]:checked")]
    .map((box) => box.dataset.stepCheckbox);
  setStored(STORAGE_KEYS.checklist, JSON.stringify(checked));
}

let editingEvidenceId = null;

function purgeExpiredEvidence(entries) {
  const now = Date.now();
  return entries.filter((entry) => {
    if (!entry.retentionDays) return true;
    const ageDays = (now - new Date(entry.createdAt).getTime()) / 86_400_000;
    return ageDays < entry.retentionDays;
  });
}

function getEvidence() {
  let entries;
  try {
    const parsed = JSON.parse(getStored(STORAGE_KEYS.evidence, "[]"));
    entries = Array.isArray(parsed) ? parsed.slice(0, 10) : [];
  } catch {
    entries = [];
  }
  const kept = purgeExpiredEvidence(entries);
  if (kept.length !== entries.length) setEvidence(kept);
  return kept;
}

function setEvidence(entries) {
  return setStored(STORAGE_KEYS.evidence, JSON.stringify(entries.slice(0, 10)));
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildEvidenceDossier(entry) {
  const lines = [
    "HỒ SƠ BẰNG CHỨNG — LÁ CHẮN SỐ",
    "(Công cụ hỗ trợ độc lập, không thuộc cơ quan nhà nước nào)",
    "",
    `Thời gian lưu: ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "full", timeStyle: "short" }).format(new Date(entry.createdAt))}`
  ];
  if (entry.contactTime) lines.push(`Thời gian liên hệ: ${entry.contactTime}`);
  if (entry.callerName) lines.push(`Tên người tự xưng: ${entry.callerName}`);
  if (entry.phone) lines.push(`Số điện thoại liên quan: ${entry.phone}`);
  if (entry.link) lines.push(`Đường link liên quan: ${entry.link}`);
  if (entry.bankName) lines.push(`Ngân hàng liên quan: ${entry.bankName}`);
  if (entry.account) lines.push(`Số tài khoản liên quan: ${entry.account}`);
  if (entry.transactionCode) lines.push(`Mã giao dịch: ${entry.transactionCode}`);
  if (entry.riskLevel) lines.push(`Mức rủi ro theo Khoan Đã: ${displayRiskLabel(entry.riskLevel)}`);
  if (entry.riskSignals?.length) lines.push(`Dấu hiệu phát hiện: ${entry.riskSignals.join("; ")}`);
  lines.push("", "Tóm tắt diễn biến:", entry.summary || "(không có)");
  lines.push("", "Lưu ý: Khoan Đã chưa xác nhận danh tính chủ tài khoản hay kết luận đây chắc chắn là lừa đảo — đây là ghi chép do người dùng và các dấu hiệu hành vi tự động tổng hợp, dùng để tham khảo khi làm việc với ngân hàng/công an.");
  return lines.join("\n");
}

function fillEvidenceForm(entry) {
  elements.evidenceCallerName.value = entry.callerName || "";
  elements.evidencePhone.value = entry.phone || "";
  elements.evidenceLink.value = entry.link || "";
  elements.evidenceBankName.value = entry.bankName || "";
  elements.evidenceAccount.value = entry.account || "";
  elements.evidenceTransactionCode.value = entry.transactionCode || "";
  elements.evidenceTime.value = entry.contactTime || "";
  elements.evidenceSummary.value = entry.summary || "";
  elements.evidenceRetention.value = String(entry.retentionDays ?? 30);
}

function startEditingEvidence(entry) {
  editingEvidenceId = entry.id;
  fillEvidenceForm(entry);
  elements.evidenceEditingNotice.hidden = false;
  elements.evidenceEditingNotice.textContent = "Đang chỉnh sửa mục đã lưu — sửa xong bấm \"Lưu vào nhật ký\".";
  elements.evidenceCancelEditButton.hidden = false;
  elements.evidenceSubmitButton.querySelector("span:last-child").textContent = "Cập nhật mục này";
  elements.evidenceForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelEditingEvidence() {
  editingEvidenceId = null;
  elements.evidenceForm.reset();
  elements.evidenceEditingNotice.hidden = true;
  elements.evidenceCancelEditButton.hidden = true;
  elements.evidenceSubmitButton.querySelector("span:last-child").textContent = "Lưu vào nhật ký";
}

function fillEvidenceFromHistory() {
  const [latest] = getHistory();
  if (!latest) {
    showToast("Chưa có lần kiểm tra nào trong lịch sử.");
    return;
  }
  const reasons = (latest.result?.ly_do || []).join("; ");
  elements.evidenceSummary.value = [
    `Tình huống đã kiểm tra: ${latest.text}`,
    `Mức rủi ro: ${displayRiskLabel(latest.risk)}`,
    reasons ? `Lý do: ${reasons}` : ""
  ].filter(Boolean).join("\n");
  showToast("Đã điền tóm tắt từ lần kiểm tra gần nhất.");
}

function renderEvidenceList() {
  const entries = getEvidence();
  elements.evidenceList.replaceChildren();
  elements.evidenceEmpty.hidden = entries.length > 0;
  elements.clearEvidenceButton.hidden = entries.length === 0;

  for (const entry of entries) {
    const card = document.createElement("article");
    card.className = "evidence-entry";

    const meta = document.createElement("p");
    meta.className = "evidence-entry__meta";
    const stamp = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(entry.createdAt));
    meta.textContent = entry.riskLevel ? `${stamp} · ${displayRiskLabel(entry.riskLevel)}` : stamp;
    card.append(meta);

    const dl = document.createElement("dl");
    const addRow = (label, value) => {
      if (!value) return;
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value;
      dl.append(dt, dd);
    };
    addRow("Tên người tự xưng", entry.callerName);
    addRow("Số điện thoại", entry.phone);
    addRow("Đường link", entry.link);
    addRow("Ngân hàng", entry.bankName);
    addRow("Số tài khoản", entry.account);
    addRow("Mã giao dịch", entry.transactionCode);
    addRow("Thời gian liên hệ", entry.contactTime);
    addRow("Tóm tắt", entry.summary);
    card.append(dl);

    const actions = document.createElement("div");
    actions.className = "evidence-entry__actions";

    const editButton = document.createElement("button");
    editButton.className = "button button-secondary";
    editButton.type = "button";
    editButton.textContent = "Sửa";
    editButton.addEventListener("click", () => startEditingEvidence(entry));

    const exportButton = document.createElement("button");
    exportButton.className = "button button-secondary";
    exportButton.type = "button";
    exportButton.textContent = "Xuất hồ sơ";
    exportButton.addEventListener("click", () => {
      const fileStamp = entry.createdAt.replace(/[:.]/g, "-");
      downloadTextFile(`bang-chung-khoan-da-${fileStamp}.txt`, buildEvidenceDossier(entry));
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "button button-danger-quiet";
    deleteButton.type = "button";
    deleteButton.textContent = "Xóa";
    deleteButton.addEventListener("click", () => {
      setEvidence(getEvidence().filter((item) => item.id !== entry.id));
      if (editingEvidenceId === entry.id) cancelEditingEvidence();
      renderEvidenceList();
    });

    actions.append(editButton, exportButton, deleteButton);
    card.append(actions);
    elements.evidenceList.append(card);
  }
}

function saveEvidence(event) {
  event.preventDefault();
  const fields = {
    callerName: elements.evidenceCallerName.value.trim(),
    phone: elements.evidencePhone.value.trim(),
    link: elements.evidenceLink.value.trim(),
    bankName: elements.evidenceBankName.value.trim(),
    account: elements.evidenceAccount.value.trim(),
    transactionCode: elements.evidenceTransactionCode.value.trim(),
    contactTime: elements.evidenceTime.value,
    summary: elements.evidenceSummary.value.trim(),
    retentionDays: Number(elements.evidenceRetention.value)
  };

  const entries = getEvidence();

  if (editingEvidenceId) {
    const index = entries.findIndex((item) => item.id === editingEvidenceId);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...fields };
    }
    setEvidence(entries);
    cancelEditingEvidence();
    showToast("Đã cập nhật mục bằng chứng.");
  } else {
    entries.unshift({
      id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
      createdAt: new Date().toISOString(),
      ...fields
    });
    setEvidence(entries);
    elements.evidenceForm.reset();
    showToast("Đã lưu vào nhật ký bằng chứng.");
  }
  renderEvidenceList();
}

let currentVerifyQuestions = [];

function renderVerifyCategories() {
  elements.verifyCategories.replaceChildren();
  for (const category of VERIFY_CATEGORIES) {
    const button = document.createElement("button");
    button.className = "sample-button";
    button.type = "button";
    button.textContent = category.label;
    button.addEventListener("click", () => showVerifyQuestions(category));
    elements.verifyCategories.append(button);
  }
}

function showVerifyQuestions(category) {
  elements.verifyCategoryTitle.textContent = category.label;
  currentVerifyQuestions = [...COMMON_VERIFY_QUESTIONS, ...category.questions];
  fillList(elements.verifyQuestionList, currentVerifyQuestions);
  elements.verifyQuestionsCard.hidden = false;
  elements.verifyQuestionsCard.focus({ preventScroll: true });
  elements.verifyQuestionsCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function readAllVerifyQuestions() {
  if (!("speechSynthesis" in window) || currentVerifyQuestions.length === 0) {
    showToast("Trình duyệt này chưa hỗ trợ đọc thành tiếng.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(currentVerifyQuestions.join(". "));
  utterance.lang = "vi-VN";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function resetVerifyView() {
  elements.verifyQuestionsCard.hidden = true;
  currentVerifyQuestions = [];
}

function renderPrivacyDataList() {
  const history = getHistory();
  const evidence = getEvidence();
  const contacts = getContacts();
  const cases = getCases();
  const hasKeyword = Boolean(getStored(STORAGE_KEYS.keyword));
  const hasBankPhone = Boolean(getStored(STORAGE_KEYS.bankPhone));

  const rows = [
    ["Chế độ kiểm tra một lần", getStored(STORAGE_KEYS.oneTimeCheck) === "1" ? "Đang bật — kết quả mới không lưu" : "Đang tắt"],
    ["Chia sẻ gia đình", getStored(STORAGE_KEYS.familySharing) === "1" ? "Chỉ chia sẻ khi bác xác nhận" : "Đang tắt"],
    ["Tự động xóa", getStored(STORAGE_KEYS.retentionPolicy, "never")],
    ["Lịch sử kiểm tra", `${history.length}/5 mục — dùng để xem lại kết quả đã kiểm tra, tự động chỉ giữ 5 lần gần nhất.`],
    ["Nhật ký bằng chứng", `${evidence.length}/10 mục — dùng để chuẩn bị hồ sơ gửi ngân hàng/công an, mỗi mục tự xóa theo thời hạn bạn chọn.`],
    ["Vụ việc (Hành trình)", `${cases.length}/5 vụ việc — ghép nhiều diễn biến để gợi ý giai đoạn và bước tiếp theo có thể xảy ra.`],
    ["Sổ liên hệ an toàn", `${contacts.length}/5 người — dùng cho nút gọi nhanh người thân.`],
    ["Số điện thoại ngân hàng", hasBankPhone ? "Đã lưu" : "Chưa lưu", "Dùng cho nút \"Gọi ngân hàng\"."],
    ["Mật khẩu gia đình", hasKeyword ? "Đã lưu (không hiển thị lại)" : "Chưa lưu", "Dùng để hỏi lại người tự xưng là người thân."]
  ];

  elements.privacyDataList.replaceChildren();
  for (const [label, value] of rows) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    elements.privacyDataList.append(dt, dd);
  }
}

function loadPrivacyToggles() {
  applyRetentionPolicy();
  elements.toggleSaveHistory.checked = getStored(STORAGE_KEYS.saveHistoryDisabled) !== "1";
  elements.toggleConsentPersonalization.checked = getStored(STORAGE_KEYS.consent) === "1";
  elements.toggleFamilySharing.checked = getStored(STORAGE_KEYS.familySharing) === "1";
  elements.retentionPolicy.value = getStored(STORAGE_KEYS.retentionPolicy, "never");
  elements.oneTimeCheckMode.checked = getStored(STORAGE_KEYS.oneTimeCheck) === "1";
  renderPrivacyAuditLists();
  renderPrivacyDataList();
}

function exportAllData() {
  const data = {
    xuatLuc: new Date().toISOString(),
    ghiChu: "Không bao gồm mật khẩu gia đình để tránh lộ nếu file bị người khác xem được.",
    lichSu: getHistory(),
    bangChung: getEvidence(),
    vuViec: getCases(),
    lienHe: getContacts(),
    soNganHang: getStored(STORAGE_KEYS.bankPhone),
    coMatKhauGiaDinh: Boolean(getStored(STORAGE_KEYS.keyword)),
    choPhepCaNhanHoa: getStored(STORAGE_KEYS.consent) === "1"
  };
  downloadTextFile("du-lieu-khoan-da.json", JSON.stringify(data, null, 2));
  showToast("Đã tải xuống toàn bộ dữ liệu của bạn.");
}

function deleteAllData() {
  for (const key of ALL_STORAGE_KEYS) removeStored(key);
  loadPrivacyToggles();
  showToast("Đã xóa toàn bộ dữ liệu trên máy này.");
}

function getRecoveryMode() {
  try {
    const parsed = JSON.parse(getStored(STORAGE_KEYS.recoveryMode, "null"));
    if (!parsed || !parsed.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      removeStored(STORAGE_KEYS.recoveryMode);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function activateRecoveryMode(durationDays) {
  const now = new Date();
  setStored(STORAGE_KEYS.recoveryMode, JSON.stringify({
    activatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + durationDays * 86_400_000).toISOString(),
    durationDays,
    completedSteps: []
  }));
}

function endRecoveryModeEarly() {
  removeStored(STORAGE_KEYS.recoveryMode);
}

function formatRemainingTime(expiresAtIso) {
  const msRemaining = new Date(expiresAtIso).getTime() - Date.now();
  const hoursRemaining = Math.max(0, Math.ceil(msRemaining / 3_600_000));
  if (hoursRemaining >= 24) {
    return `còn khoảng ${Math.ceil(hoursRemaining / 24)} ngày`;
  }
  return `còn khoảng ${hoursRemaining} giờ`;
}

function renderRecoveryBanner() {
  const mode = getRecoveryMode();
  elements.recoveryBanner.hidden = !mode;
  if (mode) {
    elements.recoveryBannerText.textContent = `Đang trong chế độ bảo vệ tăng cường — ${formatRemainingTime(mode.expiresAt)}.`;
  }
}

function renderRecoveryPanel() {
  const mode = getRecoveryMode();
  elements.recoveryInactive.hidden = Boolean(mode);
  elements.recoveryActive.hidden = !mode;
  if (!mode) return;

  elements.recoveryActiveStatus.textContent = `Đang bật — ${formatRemainingTime(mode.expiresAt)}.`;
  const completed = new Set(mode.completedSteps || []);
  elements.recoveryActive.querySelectorAll("[data-recovery-step]").forEach((checkbox) => {
    checkbox.checked = completed.has(checkbox.dataset.recoveryStep);
  });
}

function toggleRecoveryChecklistStep(stepId, checked) {
  const mode = getRecoveryMode();
  if (!mode) return;
  const completed = new Set(mode.completedSteps || []);
  if (checked) completed.add(stepId); else completed.delete(stepId);
  mode.completedSteps = [...completed];
  setStored(STORAGE_KEYS.recoveryMode, JSON.stringify(mode));
}

let reportSelectedCategory = "";
const reportSelectedEvidence = new Set();

function renderReportCategories() {
  elements.reportCategories.replaceChildren();
  for (const label of REPORT_CATEGORIES) {
    const button = document.createElement("button");
    button.className = "sample-button";
    button.type = "button";
    button.setAttribute("aria-pressed", String(label === reportSelectedCategory));
    button.textContent = label;
    button.addEventListener("click", () => {
      reportSelectedCategory = label;
      renderReportCategories();
      updateReportSummary();
    });
    elements.reportCategories.append(button);
  }
}

function renderReportEvidencePicker() {
  const entries = getEvidence();
  elements.reportEvidencePicker.replaceChildren();
  elements.reportEvidenceEmpty.hidden = entries.length > 0;

  for (const entry of entries) {
    const wrapper = document.createElement("label");
    wrapper.className = "evidence-picker-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = reportSelectedEvidence.has(entry.id);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) reportSelectedEvidence.add(entry.id);
      else reportSelectedEvidence.delete(entry.id);
      updateReportSummary();
    });
    const text = document.createElement("span");
    const stamp = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(entry.createdAt));
    text.textContent = `${stamp} — ${entry.summary || entry.callerName || "(không có tóm tắt)"}`;
    wrapper.append(checkbox, text);
    elements.reportEvidencePicker.append(wrapper);
  }
}

function updateReportSummary() {
  const damage = document.querySelector('input[name="reportDamage"]:checked')?.value;
  elements.reportAmountField.hidden = damage !== "lost";

  const evidenceEntries = getEvidence().filter((entry) => reportSelectedEvidence.has(entry.id));

  const lines = [
    "NỘI DUNG CHUẨN BỊ TRÌNH BÁO — LÁ CHẮN SỐ",
    "(Do người dùng tự soạn với sự hỗ trợ của công cụ, chưa gửi tới cơ quan nào)",
    "",
    `Thời điểm soạn: ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "full", timeStyle: "short" }).format(new Date())}`,
    `Loại sự việc: ${reportSelectedCategory || "(chưa chọn)"}`,
    `Tên người/tổ chức tự xưng: ${elements.reportCallerName.value.trim() || "(chưa ghi)"}`,
    `Số điện thoại/tài khoản mạng xã hội liên quan: ${elements.reportPhone.value.trim() || "(chưa ghi)"}`,
    `Số tài khoản nhận tiền: ${elements.reportAccount.value.trim() || "(chưa ghi)"}`,
    `Thiệt hại: ${damage === "lost" ? `Đã chuyển tiền, số tiền: ${elements.reportAmount.value.trim() || "(chưa ghi)"}` : "Chưa mất tiền, chỉ nghi ngờ"}`,
    ""
  ];

  if (evidenceEntries.length > 0) {
    lines.push("Bằng chứng đính kèm (theo thời gian):");
    for (const entry of evidenceEntries) {
      const stamp = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(entry.createdAt));
      lines.push(`- [${stamp}] ${entry.summary || entry.callerName || "(không có tóm tắt)"}`);
    }
    lines.push("");
  }

  lines.push("Khoan Đã chưa xác nhận danh tính đối tượng hay kết luận chắc chắn đây là lừa đảo — nội dung trên do người dùng tự khai và các dấu hiệu hành vi tự động tổng hợp, dùng để tham khảo khi trình báo.");

  elements.reportSummary.value = lines.join("\n");
}

async function copyReportSummary() {
  try {
    await navigator.clipboard.writeText(elements.reportSummary.value);
    showToast("Đã sao chép bản tóm tắt.");
  } catch {
    showToast("Trình duyệt không cho sao chép — hãy dùng nút tải xuống.");
  }
}

function downloadReportSummary() {
  downloadTextFile("bao-cao-khoan-da.txt", elements.reportSummary.value);
  showToast("Đã tải xuống bản tóm tắt.");
}

function queueCommunityReport() {
  let queue = [];
  try {
    const parsed = JSON.parse(getStored(STORAGE_KEYS.reportQueue, "[]"));
    queue = Array.isArray(parsed) ? parsed : [];
  } catch {
    queue = [];
  }
  const account = elements.reportAccount.value.trim();
  const preview = elements.reportHideAccount.checked && account
    ? elements.reportSummary.value.split(account).join("[đã ẩn]")
    : elements.reportSummary.value;
  queue.unshift({
    id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
    type: "community_report",
    status: "Bản nháp",
    anonymized: elements.reportAnonymous.checked,
    accountHidden: elements.reportHideAccount.checked,
    sharedEvidenceIds: [...reportSelectedEvidence],
    preview,
    isDemoData: true,
    createdAt: new Date().toISOString()
  });
  setStored(STORAGE_KEYS.reportQueue, JSON.stringify(queue.slice(0, 20)));
  elements.reportQueueStatus.textContent = "Đã lưu bản nháp trong hàng đợi thử nghiệm trên máy này. Chưa gửi tới cộng đồng hoặc cơ quan chức năng.";
  appendPrivacyAudit("community_report_draft", "Lưu bản nháp báo cáo cộng đồng", false);
}

function resetReportView() {
  reportSelectedCategory = "";
  reportSelectedEvidence.clear();
  elements.reportCallerName.value = "";
  elements.reportPhone.value = "";
  elements.reportAccount.value = "";
  elements.reportAmount.value = "";
  document.querySelector('input[name="reportDamage"][value="none"]').checked = true;
  elements.reportMarkedSent.checked = false;
  elements.reportAnonymous.checked = true;
  elements.reportHideAccount.checked = true;
  elements.reportQueueStatus.textContent = "";
  renderReportCategories();
  renderReportEvidencePicker();
  updateReportSummary();
}

function speakResult() {
  if (!("speechSynthesis" in window)) {
    showToast("Trình duyệt này chưa hỗ trợ đọc thành tiếng.");
    return;
  }

  window.speechSynthesis.cancel();
  const text = currentResult
    ? [
        currentResult.loi_dong_cam,
        `Kết quả: ${currentResult.muc_rui_ro}.`,
        RISK_META[currentResult.muc_rui_ro]?.lead,
        currentResult.chien_thuat_thao_tung?.length
          ? `Cách họ đang gây áp lực: ${currentResult.chien_thuat_thao_tung.map((tactic) => tactic.label).join(", ")}.`
          : "",
        "Ba việc cần làm:",
        ...(currentResult.hanh_dong || [])
      ].filter(Boolean).join(" ")
    : [
        "Bác hãy dừng lại và hít thở chậm.",
        "Không chuyển tiền.",
        "Không đọc mã OTP.",
        "Không cài ứng dụng lạ hoặc chia sẻ màn hình.",
        "Hãy tắt máy và gọi người thân bằng số đã lưu."
      ].join(" ");
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "vi-VN";
  utterance.rate = 0.86;
  window.speechSynthesis.speak(utterance);
}

function speakExitScript(text) {
  if (!("speechSynthesis" in window)) {
    showToast("Trình duyệt này chưa hỗ trợ đọc thành tiếng.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "vi-VN";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function openExitCallView() {
  if (elements.dangerDialog.open) elements.dangerDialog.close();
  window.location.hash = "#thoat-cuoc-goi";
}

function setSpeechControlState(isListening) {
  if (!activeSpeechButton) return;

  activeSpeechButton.setAttribute("aria-pressed", String(isListening));
  if (activeSpeechButton === elements.mobileSituationVoiceButton) {
    activeSpeechButton.setAttribute("aria-label", isListening ? "Dừng ghi âm tình huống" : "Ghi âm tình huống");
    if (isListening) {
      elements.mobileSituationFileStatus.textContent = "Đang nghe...";
      elements.mobileSituationFileStatus.hidden = false;
    } else {
      updateMobileSituationFileStatus();
    }
  } else if (activeSpeechLabel) {
    activeSpeechLabel.textContent = isListening ? "Đang nghe..." : "Nói thay vì gõ";
  }
}

function toggleSpeechRecognition(target, button, label = null) {
  if (!recognition) return;
  if (activeSpeechButton?.getAttribute("aria-pressed") === "true") {
    recognition.stop();
    return;
  }

  activeSpeechTarget = target;
  activeSpeechButton = button;
  activeSpeechLabel = label;
  activeSpeechPrefix = target.value.trim();
  speechRecognitionHadResult = false;
  setSpeechControlState(true);

  try {
    recognition.start();
  } catch {
    setSpeechControlState(false);
    activeSpeechTarget = null;
    activeSpeechButton = null;
    activeSpeechLabel = null;
    activeSpeechPrefix = "";
    speechRecognitionHadResult = false;
    showToast("Không thể bắt đầu ghi âm. Bác hãy thử lại.");
  }
}

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    const showUnsupportedSpeechMessage = () => {
      showToast("Trình duyệt này chưa hỗ trợ nhập bằng giọng nói.");
    };
    elements.speechButton.addEventListener("click", showUnsupportedSpeechMessage);
    elements.mobileSituationVoiceButton.addEventListener("click", showUnsupportedSpeechMessage);
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "vi-VN";
  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.addEventListener("start", () => {
    setSpeechControlState(true);
  });

  recognition.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(" ");
    if (!activeSpeechTarget) return;
    speechRecognitionHadResult = Boolean(transcript.trim());
    const separator = activeSpeechPrefix && transcript ? " " : "";
    const configuredMaxLength = Number(activeSpeechTarget.maxLength);
    const maxLength = configuredMaxLength > 0 ? configuredMaxLength : 5000;
    activeSpeechTarget.value = `${activeSpeechPrefix}${separator}${transcript}`.slice(0, maxLength);
    activeSpeechTarget.dispatchEvent(new Event("input", { bubbles: true }));
  });

  recognition.addEventListener("end", () => {
    const completedTarget = activeSpeechTarget;
    const shouldAnalyzeInline = speechRecognitionHadResult
      && completedTarget === elements.mobileSituationInput
      && Boolean(completedTarget.value.trim());
    setSpeechControlState(false);
    activeSpeechTarget = null;
    activeSpeechButton = null;
    activeSpeechLabel = null;
    activeSpeechPrefix = "";
    speechRecognitionHadResult = false;
    completedTarget?.focus({ preventScroll: true });
    if (shouldAnalyzeInline) analyzeMobileSituationInline();
  });

  recognition.addEventListener("error", () => {
    speechRecognitionHadResult = false;
    showToast("Không nghe rõ. Hãy thử lại hoặc nhập bằng bàn phím.");
  });

  elements.speechButton.addEventListener("click", () => {
    toggleSpeechRecognition(elements.situation, elements.speechButton, elements.speechButtonLabel);
  });
  elements.mobileSituationVoiceButton.addEventListener("click", startMobileSituationRecording);
}

function loadFamilySettings() {
  migrateLegacyFamilyPhone();
  renderContactList();
  elements.bankPhone.value = getStored(STORAGE_KEYS.bankPhone);
  elements.familyKeyword.value = "";
  elements.familyKeyword.placeholder = getStored(STORAGE_KEYS.keyword)
    ? "Đã lưu — nhập để thay đổi"
    : "Một từ chỉ gia đình biết";
  elements.phoneError.hidden = true;
  elements.settingsStatus.textContent = "";
  elements.settingsStatus.dataset.state = "";
}

function saveSettings(event) {
  event.preventDefault();
  const bank = elements.bankPhone.value.trim();
  const keyword = elements.familyKeyword.value.trim();
  const bankIsValid = !bank || /^\+?[\d\s().-]{4,20}$/.test(bank);

  if (!bankIsValid) {
    elements.phoneError.textContent = "Số điện thoại tổng đài chưa đúng. Hãy kiểm tra lại.";
    elements.phoneError.hidden = false;
    elements.bankPhone.setAttribute("aria-invalid", "true");
    elements.bankPhone.focus();
    return;
  }

  elements.phoneError.hidden = true;
  elements.bankPhone.setAttribute("aria-invalid", "false");
  const bankSaved = setStored(STORAGE_KEYS.bankPhone, bank);
  const keywordSaved = !keyword || setStored(STORAGE_KEYS.keyword, keyword);

  if (!bankSaved || !keywordSaved) {
    elements.settingsStatus.textContent = "Không thể lưu trên trình duyệt này.";
    elements.settingsStatus.dataset.state = "error";
    return;
  }

  elements.settingsStatus.textContent = "Đã lưu cài đặt.";
  elements.settingsStatus.dataset.state = "success";
}

function riskKey(risk) {
  return RISK_META[displayRiskLabel(risk)]?.key || "medium";
}

function renderHistory() {
  const history = getHistory();
  elements.historyList.replaceChildren();
  elements.historyEmpty.hidden = history.length > 0;
  elements.clearHistoryButton.hidden = history.length === 0;

  for (const entry of history) {
    const row = document.createElement("article");
    row.className = "history-row";

    const meta = document.createElement("div");
    meta.className = "history-row__meta";
    const tag = document.createElement("span");
    tag.className = "risk-tag";
    tag.dataset.risk = riskKey(entry.risk);
    tag.textContent = displayRiskLabel(entry.risk);
    const time = document.createElement("time");
    time.dateTime = entry.createdAt;
    time.textContent = new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(entry.createdAt));
    meta.append(tag, time);

    const text = document.createElement("p");
    text.textContent = entry.text;

    const button = document.createElement("button");
    button.className = "button button-secondary";
    button.type = "button";
    button.textContent = "Xem lại";
    button.addEventListener("click", () => {
      elements.situation.value = entry.text;
      updateCharacterCount();
      window.location.hash = "#kiem-tra";
      requestAnimationFrame(() => renderResult(entry.result, { showDanger: false }));
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "button button-danger-quiet";
    deleteButton.type = "button";
    deleteButton.textContent = "Xóa";
    deleteButton.addEventListener("click", () => {
      setHistory(getHistory().filter((item) => item.id !== entry.id));
      renderHistory();
    });

    const actions = document.createElement("div");
    actions.className = "history-row__actions";
    actions.append(button, deleteButton);

    row.append(meta, text, actions);
    elements.historyList.append(row);
  }
}


function isDesktopCaseDashboard() {
  return typeof window.matchMedia === "function" && window.matchMedia("(min-width: 64rem)").matches;
}

function formatCaseDate(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function formatCaseTime(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function appendCasePreviewEvidence(container, title, count, iconName, bodyText = "") {
  const card = document.createElement("article");
  card.className = "case-evidence-card";

  const head = document.createElement("div");
  head.className = "case-evidence-card__head";
  const label = document.createElement("strong");
  label.textContent = title;
  const badge = document.createElement("span");
  badge.textContent = count;
  head.append(label, badge);

  const body = document.createElement("div");
  body.className = "case-evidence-card__body";
  const icon = document.createElement("span");
  icon.className = "case-evidence-card__icon";
  icon.innerHTML = `<span class="icon ${iconName}" aria-hidden="true"></span>`;
  const text = document.createElement("p");
  text.textContent = bodyText || "Đã lưu nội dung minh họa để đối chiếu khi cần.";
  body.append(icon, text);

  card.append(head, body);
  container.append(card);
}

function renderCaseDesktopPreview(caseObj) {
  if (!elements.caseDesktopPreview) return;
  if (!caseObj || !isDesktopCaseDashboard()) {
    elements.caseDesktopPreview.hidden = true;
    elements.caseDesktopPreview.replaceChildren();
    return;
  }

  elements.caseDesktopPreview.hidden = false;
  elements.caseDesktopPreview.replaceChildren();

  const header = document.createElement("div");
  header.className = "case-preview-head";
  const title = document.createElement("h2");
  title.textContent = "Chi tiết vụ việc";
  const exportButton = document.createElement("button");
  exportButton.className = "case-preview-export";
  exportButton.type = "button";
  exportButton.innerHTML = '<span class="icon icon-save" aria-hidden="true"></span><span>Xuất hồ sơ</span>';
  exportButton.addEventListener("click", () => {
    if (caseObj.isDemo) {
      showToast("Đây là mẫu minh họa; tạo vụ việc thật để xuất hồ sơ.");
      return;
    }
    showCaseDetail(caseObj.id);
  });
  header.append(title, exportButton);

  const summary = document.createElement("article");
  summary.className = "case-preview-summary";
  const summaryIcon = document.createElement("span");
  summaryIcon.className = "case-preview-summary__icon";
  summaryIcon.innerHTML = `<span class="icon ${caseObj.demoIcon || "icon-route"}" aria-hidden="true"></span>`;
  const summaryText = document.createElement("div");
  const summaryTitle = document.createElement("h3");
  summaryTitle.textContent = caseObj.label;
  const summaryMeta = document.createElement("p");
  summaryMeta.textContent = `${formatCaseDate(caseObj.updatedAt)} • ${formatCaseTime(caseObj.updatedAt)}${caseObj.isDemo ? " • Mẫu minh họa" : ""}`;
  summaryText.append(summaryTitle, summaryMeta);
  const status = document.createElement("span");
  status.className = "case-preview-status";
  status.textContent = caseObj.status || "Đang theo dõi";
  summary.append(summaryIcon, summaryText, status);

  const body = document.createElement("div");
  body.className = "case-preview-body";

  const timeline = document.createElement("div");
  timeline.className = "case-preview-timeline";
  const events = caseObj.events?.length
    ? caseObj.events
    : [{ type: "khac", text: "Chưa có diễn biến mới. Bác có thể thêm cuộc gọi, tin nhắn hoặc bằng chứng vào vụ việc.", createdAt: caseObj.updatedAt }];
  events.slice(0, 5).forEach((event) => {
    const item = document.createElement("article");
    item.className = "case-preview-event";
    const dot = document.createElement("span");
    dot.className = "case-preview-event__dot";
    const icon = document.createElement("span");
    icon.className = "case-preview-event__icon";
    icon.innerHTML = `<span class="icon ${event.type === "cuoc_goi_dau_tien" ? "icon-phone" : event.type.includes("chuyen") ? "icon-wallet" : "icon-shield-check"}" aria-hidden="true"></span>`;
    const copy = document.createElement("div");
    const eventTitle = document.createElement("strong");
    eventTitle.textContent = CASE_EVENT_LABELS[event.type] || event.type;
    const eventText = document.createElement("p");
    eventText.textContent = event.text || "Đã ghi nhận diễn biến.";
    copy.append(eventTitle, eventText);
    const time = document.createElement("time");
    time.dateTime = event.createdAt;
    time.textContent = formatCaseTime(event.createdAt);
    item.append(dot, icon, copy, time);
    timeline.append(item);
  });

  const aside = document.createElement("aside");
  aside.className = "case-preview-aside";
  const evidenceTitle = document.createElement("h3");
  evidenceTitle.textContent = caseObj.isDemo ? "Bằng chứng minh họa (5)" : "Bằng chứng đã lưu";
  const evidenceGrid = document.createElement("div");
  evidenceGrid.className = "case-evidence-grid";
  appendCasePreviewEvidence(evidenceGrid, "Tin nhắn", "2", "icon-messages", "Ảnh chụp đoạn tin nhắn đáng ngờ.");
  appendCasePreviewEvidence(evidenceGrid, "Ảnh chụp", "2", "icon-camera", "Lưu ảnh chuyển khoản hoặc giấy tờ liên quan.");
  appendCasePreviewEvidence(evidenceGrid, "Cuộc gọi", "1", "icon-phone", "Ghi lại thời điểm và nội dung cuộc gọi.");
  appendCasePreviewEvidence(evidenceGrid, "Ghi chú", "1", "icon-route", "Tóm tắt yêu cầu của đối tượng.");

  const support = document.createElement("div");
  support.className = "case-preview-support";
  const supportCopy = document.createElement("div");
  const supportTitle = document.createElement("strong");
  supportTitle.textContent = "Khoan Đã luôn ở đây cùng bác";
  const supportText = document.createElement("p");
  supportText.textContent = "Bác đã làm rất đúng khi lưu lại bằng chứng và báo người thân. Đừng lo, chúng ta sẽ cùng xử lý vụ việc này.";
  supportCopy.append(supportTitle, supportText);
  const mascot = document.createElement("img");
  mascot.src = "/assets/mascot-assistant.webp";
  mascot.alt = "";
  mascot.setAttribute("aria-hidden", "true");
  support.append(supportCopy, mascot);

  aside.append(evidenceTitle, evidenceGrid, support);
  body.append(timeline, aside);
  elements.caseDesktopPreview.append(header, summary, body);
}

function renderCaseList() {
  const allCases = getCases();
  const cases = allCases.filter((item) => {
    if (activeCaseFilter === "checked") return item.events.length > 0;
    if (activeCaseFilter === "saved") return true;
    return true;
  });
  const displayCases = cases;
  elements.caseList.replaceChildren();
  elements.caseListEmpty.hidden = cases.length > 0;
  renderCaseDesktopPreview(displayCases[0] || null);

  displayCases.forEach((item, index) => {
    const row = document.createElement("article");
    const tone = item.demoTone || ["high", "medium", "low", "safe"][index % 4];
    row.className = `history-row case-history-row case-history-row--${tone}`;
    if (item.isDemo) row.classList.add("case-history-row--demo");
    if (index === 0) row.classList.add("is-selected");

    const icon = document.createElement("span");
    icon.className = "case-history-row__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = `<span class="icon ${item.demoIcon || (tone === "high" ? "icon-alert" : tone === "medium" ? "icon-messages" : tone === "low" ? "icon-qr-code" : "icon-user")}"></span>`;

    const meta = document.createElement("div");
    meta.className = "history-row__meta";
    const tag = document.createElement("span");
    tag.className = "case-history-row__tag";
    tag.textContent = item.status || (item.events.length ? "Đã kiểm tra" : "Đã lưu");
    const time = document.createElement("time");
    time.dateTime = item.updatedAt;
    time.textContent = `${formatCaseDate(item.updatedAt)} • ${formatCaseTime(item.updatedAt)}`;
    meta.append(tag, time);

    const title = document.createElement("p");
    title.className = "case-history-row__title";
    title.textContent = item.label;

    const description = document.createElement("small");
    description.className = "case-history-row__description";
    description.textContent = item.events.length
      ? `${item.events.length} diễn biến đã được ghi lại.`
      : "Vụ việc đã lưu, chưa có diễn biến mới.";

    const amount = document.createElement("strong");
    amount.className = "case-history-row__amount";
    amount.textContent = item.requestedAmount || "-";

    const openButton = document.createElement("button");
    openButton.className = "case-history-row__open";
    openButton.type = "button";
    openButton.setAttribute("aria-label", `Xem ${item.label}`);
    openButton.innerHTML = '<span class="icon icon-chevron-right" aria-hidden="true"></span>';
    openButton.addEventListener("click", () => {
      if (item.isDemo) {
        renderCaseDesktopPreview(item);
        elements.caseList.querySelectorAll(".case-history-row").forEach((caseRow) => caseRow.classList.remove("is-selected"));
        row.classList.add("is-selected");
        return;
      }
      showCaseDetail(item.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "case-history-row__delete";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `Xóa ${item.label}`);
    deleteButton.innerHTML = '<span class="icon icon-trash" aria-hidden="true"></span>';
    deleteButton.hidden = Boolean(item.isDemo);
    deleteButton.addEventListener("click", () => {
      deleteCase(item.id);
      renderCaseList();
    });

    const actions = document.createElement("div");
    actions.className = "history-row__actions";
    actions.append(openButton, deleteButton);

    row.append(icon, meta, title, description, amount, actions);
    elements.caseList.append(row);
  });
}

function renderCaseEventTypePicker() {
  elements.caseEventTypePicker.replaceChildren();
  for (const type of CASE_EVENT_TYPES) {
    const button = document.createElement("button");
    button.className = "sample-button";
    button.type = "button";
    button.textContent = type.label;
    button.setAttribute("aria-pressed", String(type.id === selectedCaseEventType));
    button.addEventListener("click", () => {
      selectedCaseEventType = type.id;
      renderCaseEventTypePicker();
    });
    elements.caseEventTypePicker.append(button);
  }
}

function clearSelectedCaseEventImage() {
  selectedCaseEventImage = null;
  elements.caseEventImageInput.value = "";
  elements.caseEventImagePreview.hidden = true;
  elements.caseEventImagePreviewThumb.src = "";
}

async function handleCaseEventImageSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    showToast("Chỉ nhận ảnh PNG, JPEG hoặc WEBP.");
    clearSelectedCaseEventImage();
    return;
  }

  try {
    const compressed = await compressImage(file);
    selectedCaseEventImage = compressed;
    elements.caseEventImagePreviewThumb.src = compressed.previewUrl;
    elements.caseEventImagePreview.hidden = false;
  } catch {
    showToast("Không đọc được ảnh này. Hãy thử ảnh khác.");
    clearSelectedCaseEventImage();
  }
}

function renderCaseTimeline(caseObj) {
  elements.caseTimeline.replaceChildren();
  for (const event of caseObj.events) {
    const row = document.createElement("article");
    row.className = "history-row";

    const meta = document.createElement("div");
    meta.className = "history-row__meta";
    if (event.risk) {
      const tag = document.createElement("span");
      tag.className = "risk-tag";
      tag.dataset.risk = riskKey(event.risk);
      tag.textContent = displayRiskLabel(event.risk);
      meta.append(tag);
    }
    const typeLabel = document.createElement("span");
    typeLabel.textContent = CASE_EVENT_LABELS[event.type] || event.type;
    const time = document.createElement("time");
    time.dateTime = event.createdAt;
    time.textContent = new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(event.createdAt));
    meta.append(typeLabel, time);

    row.append(meta);

    if (event.text) {
      const text = document.createElement("p");
      text.textContent = event.text;
      row.append(text);
    }

    elements.caseTimeline.append(row);
  }
}

function showCaseListPanel() {
  currentCaseId = null;
  elements.caseDetailPanel.hidden = true;
  elements.caseListPanel.hidden = false;
  renderCaseList();
}

function saveCaseMetadata(event) {
  event.preventDefault();
  if (!currentCaseId) return;
  const cases = getCases();
  const target = cases.find((item) => item.id === currentCaseId);
  if (!target) return;
  target.label = elements.caseTitleInput.value.trim().slice(0, 120) || target.label;
  target.status = elements.caseStatusInput.value;
  target.impersonatedOrganization = elements.caseOrganizationInput.value.trim().slice(0, 160);
  target.phone = elements.casePhoneInput.value.trim().slice(0, 40);
  target.account = elements.caseAccountInput.value.trim().slice(0, 80);
  target.requestedAmount = elements.caseAmountInput.value.trim().slice(0, 80);
  target.moneyTransferred = elements.caseMoneyTransferredInput.checked;
  target.supporter = elements.caseSupporterInput.value.trim().slice(0, 120);
  target.updatedAt = new Date().toISOString();
  setCases(cases);
  elements.caseDetailLabel.textContent = target.label;
  showToast("Đã lưu thông tin vụ việc trên máy này.");
}

function exportCurrentCase() {
  const caseObj = getCase(currentCaseId);
  if (!caseObj) return;
  const includeFinancial = elements.caseShareFinancial.checked;
  const lines = [
    "TÓM TẮT VỤ VIỆC — LÁ CHẮN SỐ",
    `Tiêu đề: ${caseObj.label}`,
    `Trạng thái: ${caseObj.status || "Đang theo dõi"}`,
    `Mức rủi ro hiện tại: ${caseObj.riskLevel || "Chưa đủ dữ liệu"}`,
    `Người/tổ chức bị giả danh: ${caseObj.impersonatedOrganization || "(chưa ghi)"}`,
    `Số điện thoại liên quan: ${caseObj.phone || "(chưa ghi)"}`,
    `Đã chuyển tiền: ${caseObj.moneyTransferred ? "Có" : "Chưa/không rõ"}`,
    `Người thân đang hỗ trợ: ${caseObj.supporter || "(chưa ghi)"}`
  ];
  if (includeFinancial) {
    lines.push(`Tài khoản liên quan: ${caseObj.account || "(chưa ghi)"}`);
    lines.push(`Số tiền được yêu cầu: ${caseObj.requestedAmount || "(chưa ghi)"}`);
  } else {
    lines.push("Tài khoản và số tiền: đã ẩn theo lựa chọn của người dùng");
  }
  lines.push("", "DÒNG THỜI GIAN");
  for (const item of [...caseObj.events].reverse()) {
    lines.push(`- ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(item.createdAt))}: ${CASE_EVENT_LABELS[item.type] || item.type}${item.text ? ` — ${item.text}` : ""}`);
  }
  lines.push("", "Tệp này do người dùng chủ động tạo; LÁ CHẮN SỐ chưa xác minh danh tính đối tượng.");
  downloadTextFile(`vu-viec-khoan-da-${caseObj.id}.txt`, lines.join("\n"));
  appendPrivacyAudit("case_export", `Tạo bản chia sẻ chọn lọc cho ${caseObj.label}`, true);
  showToast("Đã tạo file; bác tự chọn người nhận.");
}

function showCaseDetail(caseId) {
  const caseObj = getCase(caseId);
  if (!caseObj) {
    showCaseListPanel();
    return;
  }
  currentCaseId = caseId;
  lastViewedCaseId = caseId;
  elements.caseListPanel.hidden = true;
  elements.caseDetailPanel.hidden = false;
  elements.caseDetailLabel.textContent = caseObj.label;
  elements.caseTitleInput.value = caseObj.label;
  elements.caseStatusInput.value = caseObj.status || "Đang theo dõi";
  elements.caseOrganizationInput.value = caseObj.impersonatedOrganization || "";
  elements.casePhoneInput.value = caseObj.phone || "";
  elements.caseAccountInput.value = caseObj.account || "";
  elements.caseAmountInput.value = caseObj.requestedAmount || "";
  elements.caseMoneyTransferredInput.checked = caseObj.moneyTransferred === true;
  elements.caseSupporterInput.value = caseObj.supporter || "";
  elements.caseShareFinancial.checked = false;
  elements.journeyResult.hidden = true;
  elements.caseEventText.value = "";
  clearSelectedCaseEventImage();
  setCaseEventError();
  selectedCaseEventType = CASE_EVENT_TYPES[0].id;
  renderCaseEventTypePicker();
  renderCaseTimeline(caseObj);
  elements.caseDetailLabel.focus?.({ preventScroll: true });
}

function setCaseEventError(message = "") {
  elements.caseEventError.textContent = message;
  elements.caseEventError.hidden = !message;
}

async function submitCaseEvent() {
  if (!currentCaseId) return;
  const text = elements.caseEventText.value.trim();

  setCaseEventError();
  elements.caseEventSubmitButton.disabled = true;

  try {
    let signals = null;
    let risk = null;

    if (text || selectedCaseEventImage) {
      const payload = await window.KhoanDaServices.scamAnalysisService.analyze({
        van_ban: text,
        tep: selectedCaseEventImage
          ? { mimeType: selectedCaseEventImage.mimeType, data: selectedCaseEventImage.data }
          : undefined
      });
      signals = payload.tin_hieu || null;
      risk = payload.muc_rui_ro || null;
    }

    addEventToCase(currentCaseId, { type: selectedCaseEventType, text, signals, risk });
    elements.caseEventText.value = "";
    clearSelectedCaseEventImage();
    renderCaseTimeline(getCase(currentCaseId));
    showToast("Đã thêm diễn biến vào vụ việc.");
  } catch (error) {
    setCaseEventError(error.message);
  } finally {
    elements.caseEventSubmitButton.disabled = false;
  }
}

async function analyzeJourney() {
  const caseObj = getCase(currentCaseId);
  if (!caseObj || caseObj.events.length === 0) {
    showToast("Hãy thêm ít nhất một diễn biến trước.");
    return;
  }

  elements.analyzeJourneyButton.disabled = true;
  try {
    const payload = await window.KhoanDaServices.scamAnalysisService.journey({
      su_kien: caseObj.events.map((event) => ({ loai: event.type, tin_hieu: event.signals }))
    });
    elements.journeyStageLabel.textContent = `Giai đoạn hiện tại: ${payload.nhan_giai_doan}`;
    elements.journeyStageDesc.textContent = payload.mo_ta;
    elements.journeyNextStep.textContent = payload.du_doan_buoc_tiep_theo;
    elements.journeyCitation.textContent = payload.trich_dan?.[0] || "";
    elements.journeyResult.hidden = false;
  } catch (error) {
    showToast(error.message);
  } finally {
    elements.analyzeJourneyButton.disabled = false;
  }
}

function updateBottomNav(hash) {
  const parentRoute = hash === "#tin-nhan-la" || hash === "#kiem-tra-lien-ket" || hash === "#chuyen-khoan" || hash === "#xac-minh" || hash === "#thoat-cuoc-goi"
    ? "#kiem-tra"
    : hash === "#lich-su" || hash === "#bang-chung" || hash === "#vua-chuyen-tien"
      ? "#hanh-trinh"
      : hash === "#canh-bao"
        ? "#huong-dan"
        : hash === "#quyen-rieng-tu" || hash === "#ho-tro"
          ? "#gia-dinh"
          : hash;
  elements.bottomNavItems.forEach((item) => {
    if (item.dataset.route === parentRoute) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

function getEducationProgress() {
  try { return JSON.parse(getStored(STORAGE_KEYS.educationProgress, "{}")) || {}; } catch { return {}; }
}

function saveEducationProgress(progress) {
  setStored(STORAGE_KEYS.educationProgress, JSON.stringify(progress));
}

function renderEducationList() {
  const progress = getEducationProgress();
  elements.educationList.replaceChildren();

  // Update lesson count
  const countEl = document.querySelector("#educationLessonCount");
  if (countEl) countEl.textContent = EDUCATION_LESSONS.length;

  // Emoji icons for each lesson type
  const icons = ["👮", "🏦", "👨‍👩‍👧", "📦", "🔢", "📱", "🖥️", "💰", "💼", "🎭", "🔄", "⚡", "🆔", "👤", "📞", "👨‍🏫", "💕"];

  EDUCATION_LESSONS.forEach((lesson, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "education-card";
    card.setAttribute("aria-pressed", String(index === currentEducationIndex));

    const isCompleted = !!progress[lesson.id];
    const progressPercent = isCompleted ? 100 : 0;
    const statusText = isCompleted ? "Đã học ✓" : "Chưa học";
    const statusClass = isCompleted ? "education-card__status--completed" : "";

    card.innerHTML = `
      <div class="education-card__icon">${icons[index] || "📚"}</div>
      <div class="education-card__content">
        <div class="education-card__number">${index + 1}. ${lesson.title}</div>
        <div class="education-card__topic">${lesson.topic}</div>
        <div class="education-card__progress">
          <div class="education-card__progress-bar">
            <div class="education-card__progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <div class="education-card__status ${statusClass}">${statusText}</div>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      currentEducationIndex = index;
      currentEducationChoice = null;
      renderEducationLesson();
      renderEducationList();
      elements.educationLesson.scrollIntoView({ behavior: "smooth" });
    });

    elements.educationList.append(card);
  });
}

function renderEducationLesson() {
  const lesson = EDUCATION_LESSONS[currentEducationIndex];
  if (!lesson) return;
  elements.educationLesson.hidden = false;
  elements.educationLessonMeta.textContent = `${currentEducationIndex + 1}/${EDUCATION_LESSONS.length} · ${lesson.topic}`;
  elements.educationLessonTitle.textContent = lesson.title;
  elements.educationScenario.textContent = lesson.scenario;
  elements.educationFeedback.hidden = currentEducationChoice === null;
  elements.educationFeedback.textContent = currentEducationChoice === null ? "" : (currentEducationChoice === lesson.correct ? `Đúng hướng. ${lesson.explanation}` : `Bác thử dừng lại và chọn lại. ${lesson.explanation}`);
  elements.educationChoices.replaceChildren();
  lesson.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button-secondary education-choice";
    button.setAttribute("aria-pressed", String(currentEducationChoice === index));
    button.textContent = choice;
    button.addEventListener("click", () => {
      currentEducationChoice = index;
      if (index === lesson.correct) {
        const progress = getEducationProgress();
        progress[lesson.id] = { completedAt: new Date().toISOString() };
        saveEducationProgress(progress);
      }
      renderEducationLesson();
      renderEducationList();
    });
    elements.educationChoices.append(button);
  });
}

function renderEducation() {
  renderEducationList();
  renderEducationLesson();
}

async function renderSupportDirectory() {
  elements.supportDirectory.replaceChildren();
  const loading = document.createElement("p");
  loading.className = "field-hint";
  loading.textContent = "Đang tải danh bạ hỗ trợ...";
  elements.supportDirectory.append(loading);
  let directory;
  try {
    directory = await window.KhoanDaServices.supportDirectoryService.getAll();
  } catch (error) {
    loading.textContent = `${error.message} Hãy dùng số trên thẻ ngân hàng hoặc gọi người thân đã lưu.`;
    return;
  }
  elements.supportDirectory.replaceChildren();
  for (const configuredItem of directory) {
    const item = configuredItem.kind === "saved-bank"
      ? { ...configuredItem, phone: bankPhoneForCall() }
      : configuredItem;
    const card = document.createElement("article");
    card.className = "support-entry";
    const title = document.createElement("h2");
    title.textContent = item.name;
    const purpose = document.createElement("p");
    purpose.textContent = item.purpose;
    const source = document.createElement("p");
    source.className = "field-hint";
    source.textContent = `Nguồn: ${item.source} · cập nhật ${item.updatedAt || "chưa rõ"}`;
    const actions = document.createElement("div");
    actions.className = "form-actions";
    if (item.phone) {
      const call = document.createElement("a");
      call.className = "button button-call";
      call.href = `tel:${item.phone}`;
      call.textContent = `Gọi ${item.displayPhone || item.phone}`;
      actions.append(call);
      const copy = document.createElement("button");
      copy.className = "button button-secondary";
      copy.type = "button";
      copy.textContent = "Sao chép số";
      copy.addEventListener("click", () => navigator.clipboard?.writeText(item.phone).then(() => showToast("Đã sao chép số.")));
      actions.append(copy);
    }
    if (item.website) {
      const link = document.createElement("a");
      link.className = "button button-secondary";
      link.href = item.website;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Mở website";
      actions.append(link);
    }
    card.append(title, purpose, source, actions);
    elements.supportDirectory.append(card);
  }
}

function applyFontSize(size) {
  const safe = ["small", "medium", "large"].includes(size) ? size : "medium";
  document.documentElement.dataset.fontSize = safe;
  setStored(STORAGE_KEYS.fontSize, safe);
  elements.fontSizeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.fontSize === safe)));
}

function getAccount() {
  try {
    const account = JSON.parse(getStored(STORAGE_KEYS.account, "null"));
    return account && account.email && account.passwordHash ? account : null;
  } catch {
    return null;
  }
}

function isAuthenticated() {
  return getStored(STORAGE_KEYS.accountSession) === "1" && Boolean(getAccount());
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  if (window.crypto?.subtle) {
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function renderAuthState() {
  const account = getAccount();
  const authenticated = isAuthenticated();
  document.documentElement.dataset.authenticated = String(authenticated);
  elements.authLabels.forEach((label) => { label.textContent = authenticated ? "" : "Đăng nhập"; });
  elements.profileMenuButton.setAttribute("aria-label", authenticated ? "Mở hồ sơ" : "Đăng nhập");
  elements.mobileProfileMenuButton.setAttribute("aria-label", authenticated ? "Mở hồ sơ" : "Đăng nhập");
  elements.profileIdentityName.textContent = account?.name || "Tài khoản của bác";
  elements.profileIdentityEmail.textContent = account?.email || "";
}

function setAuthMode(mode) {
  authMode = mode === "register" ? "register" : "login";
  const registering = authMode === "register";
  elements.authDialogTitle.textContent = registering ? "Tạo tài khoản mới" : "Chào mừng quay lại";
  elements.authNameField.hidden = !registering;
  elements.authConfirmField.hidden = !registering;
  elements.authName.required = registering;
  elements.authPasswordConfirm.required = registering;
  elements.authPassword.autocomplete = registering ? "new-password" : "current-password";
  elements.authSubmitButton.textContent = registering ? "Tạo tài khoản" : "Đăng nhập";
  elements.authModeCopy.firstChild.textContent = registering ? "Đã có tài khoản? " : "Chưa có tài khoản? ";
  elements.authModeSwitch.textContent = registering ? "Đăng nhập" : "Tạo tài khoản";
  elements.authLoginTab.setAttribute("aria-selected", String(!registering));
  elements.authRegisterTab.setAttribute("aria-selected", String(registering));
  elements.authError.hidden = true;
}

function openAuthDialog(mode = getAccount() ? "login" : "register") {
  setProfileMenu(false);
  setAuthMode(mode);
  elements.authForm.reset();
  elements.authPassword.type = "password";
  elements.authPasswordToggle.classList.remove("is-visible");
  elements.authPasswordToggle.setAttribute("aria-pressed", "false");
  elements.authPasswordToggle.setAttribute("aria-label", "Hiện mật khẩu");
  const account = getAccount();
  if (account && mode === "login") elements.authEmail.value = account.email;
  if (!elements.authDialog.open) elements.authDialog.showModal();
  requestAnimationFrame(() => (mode === "register" ? elements.authName : elements.authEmail).focus({ preventScroll: true }));
}

function closeAuthDialog() {
  if (elements.authDialog.open) elements.authDialog.close();
}

async function submitAuth(event) {
  event.preventDefault();
  elements.authError.hidden = true;
  const name = elements.authName.value.trim();
  const email = elements.authEmail.value.trim().toLowerCase();
  const password = elements.authPassword.value;

  if (!email || !email.includes("@") || password.length < 6) {
    elements.authError.textContent = "Hãy nhập email hợp lệ và mật khẩu có ít nhất 6 ký tự.";
    elements.authError.hidden = false;
    return;
  }

  const passwordHash = await hashPassword(password);
  if (authMode === "register") {
    if (!name || password !== elements.authPasswordConfirm.value) {
      elements.authError.textContent = !name ? "Hãy nhập họ và tên." : "Hai mật khẩu chưa khớp nhau.";
      elements.authError.hidden = false;
      return;
    }
    setStored(STORAGE_KEYS.account, JSON.stringify({ name, email, passwordHash, createdAt: new Date().toISOString() }));
  } else {
    const account = getAccount();
    if (!account || account.email !== email || account.passwordHash !== passwordHash) {
      elements.authError.textContent = account ? "Email hoặc mật khẩu chưa đúng." : "Thiết bị này chưa có tài khoản. Hãy chọn Tạo tài khoản.";
      elements.authError.hidden = false;
      return;
    }
  }

  setStored(STORAGE_KEYS.accountSession, "1");
  renderAuthState();
  closeAuthDialog();
  showToast(authMode === "register" ? "Đã tạo tài khoản và đăng nhập." : "Đăng nhập thành công.");
}

function handleProfileTrigger() {
  if (isAuthenticated()) setProfileMenu(elements.profileMenu.hidden);
  else openAuthDialog();
}

function logout() {
  removeStored(STORAGE_KEYS.accountSession);
  setProfileMenu(false);
  renderAuthState();
  showToast("Đã đăng xuất.");
}

function deleteAccount() {
  removeStored(STORAGE_KEYS.account);
  removeStored(STORAGE_KEYS.accountSession);
  setProfileMenu(false);
  renderAuthState();
  showToast("Đã xóa tài khoản khỏi thiết bị này.");
}

function setProfileMenu(open, { restoreFocus = false } = {}) {
  const shouldOpen = Boolean(open);
  elements.profileMenu.hidden = !shouldOpen;
  elements.profileMenuButton.setAttribute("aria-expanded", String(shouldOpen));
  elements.mobileProfileMenuButton.setAttribute("aria-expanded", String(shouldOpen));
  elements.profileIconButton?.setAttribute("aria-expanded", String(shouldOpen));
  if (shouldOpen) {
    elements.profileMenu.querySelector("a, button")?.focus({ preventScroll: true });
  } else if (restoreFocus) {
    const trigger = window.matchMedia("(max-width: 40rem)").matches
      ? elements.mobileProfileMenuButton
      : elements.profileMenuButton;
    trigger.focus({ preventScroll: true });
  }
}

let onboardingTransitionToken = 0;

function renderOnboardingStep(step, { focus = true } = {}) {
  const nextStep = Math.min(5, Math.max(1, Number(step) || 1));
  const previousStep = onboardingStep;
  const activeScreen = elements.onboarding.querySelector(`[data-onboarding-step="${previousStep}"]:not([hidden])`);
  const nextScreen = elements.onboarding.querySelector(`[data-onboarding-step="${nextStep}"]`);
  const shouldAnimate = activeScreen && nextScreen && activeScreen !== nextScreen
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const direction = nextStep > previousStep ? "forward" : "back";
  const token = ++onboardingTransitionToken;

  onboardingStep = nextStep;
  elements.onboardingScreens.forEach((screen) => {
    screen.classList.remove("is-entering-forward", "is-entering-back", "is-leaving-forward", "is-leaving-back");
    if (screen !== activeScreen && screen !== nextScreen) {
      screen.hidden = true;
      screen.setAttribute("aria-hidden", "true");
    }
  });

  const focusHeading = () => {
    if (!focus || token !== onboardingTransitionToken) return;
    const heading = nextScreen?.querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  };

  if (!shouldAnimate) {
    if (activeScreen && activeScreen !== nextScreen) {
      activeScreen.hidden = true;
      activeScreen.setAttribute("aria-hidden", "true");
    }
    nextScreen.hidden = false;
    nextScreen.setAttribute("aria-hidden", "false");
    window.requestAnimationFrame(focusHeading);
    return;
  }

  activeScreen.classList.add(`is-leaving-${direction}`);
  activeScreen.setAttribute("aria-hidden", "true");
  nextScreen.hidden = false;
  nextScreen.setAttribute("aria-hidden", "false");
  nextScreen.classList.add(`is-entering-${direction}`);

  window.setTimeout(() => {
    if (token !== onboardingTransitionToken) return;
    activeScreen.hidden = true;
    activeScreen.classList.remove(`is-leaving-${direction}`);
    nextScreen.classList.remove(`is-entering-${direction}`);
    focusHeading();
  }, 380);
}

function openOnboarding() {
  setProfileMenu(false);
  elements.onboarding.hidden = false;
  document.body.dataset.onboarding = "true";
  renderOnboardingStep(1);
}

function completeOnboarding() {
  setStored(STORAGE_KEYS.onboardingComplete, "1");
  elements.onboarding.hidden = true;
  delete document.body.dataset.onboarding;
  if (!ROUTES[window.location.hash]) window.location.hash = "#trang-chu";
  route();
  document.querySelector("#homeTitle")?.focus({ preventScroll: true });
}

function chooseOnboardingMethod(button) {
  elements.onboardingMethodButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  elements.onboardingMethodStatus.textContent = `${button.dataset.onboardingMethod}: bác chỉ chọn thử cách kiểm tra, ứng dụng chưa xin quyền và chưa gửi dữ liệu.`;
}

function chooseOnboardingBranch(button) {
  elements.onboardingBranchButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  if (button.dataset.onboardingBranch === "transferred") {
    elements.onboardingBranchStatus.textContent = "Khoan Đã sẽ ưu tiên hướng dẫn gọi ngân hàng, lưu bằng chứng và nhờ người thân hỗ trợ.";
    elements.onboardingBranchStatus.dataset.state = "danger";
  } else {
    elements.onboardingBranchStatus.textContent = "Tốt rồi. Hãy dừng cuộc gọi, không chuyển tiền và tự gọi lại người thân qua số đã lưu.";
    elements.onboardingBranchStatus.dataset.state = "safe";
  }
}

function loadAccessibilityPreferences() {
  applyFontSize(getStored(STORAGE_KEYS.fontSize, "medium"));
  const enabled = getStored(STORAGE_KEYS.voiceGuide, "0") === "1";
  elements.voiceGuideToggle.setAttribute("aria-pressed", String(enabled));
  elements.voiceGuideToggle.classList.toggle("is-enabled", enabled);
}

const ROUTE_SEQUENCE = Object.keys(ROUTES);
let currentRouteHash = null;
let activeRouteTransition = null;

function route() {
  const nextHash = ROUTES[window.location.hash] ? window.location.hash : "#trang-chu";
  const previousHash = currentRouteHash;

  // A danger dialog belongs to the view that opened it; never let it cover a new route.
  if (previousHash && previousHash !== nextHash && elements.dangerDialog.open) {
    elements.dangerDialog.close();
  }

  const nextIndex = ROUTE_SEQUENCE.indexOf(nextHash);
  const previousIndex = ROUTE_SEQUENCE.indexOf(previousHash);
  const direction = previousIndex >= 0 && nextIndex < previousIndex ? "back" : "forward";
  const apply = () => applyRoute(nextHash);
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  currentRouteHash = nextHash;
  document.documentElement.dataset.routeDirection = direction;

  if (!previousHash || previousHash === nextHash || prefersReducedMotion) {
    activeRouteTransition?.skipTransition?.();
    activeRouteTransition = null;
    apply();
    return;
  }

  if (typeof document.startViewTransition === "function") {
    activeRouteTransition?.skipTransition?.();
    try {
      const transition = document.startViewTransition(apply);
      activeRouteTransition = transition;
      transition.updateCallbackDone.catch(() => {});
      transition.finished.then(
        () => {
          if (activeRouteTransition === transition) activeRouteTransition = null;
        },
        () => {
          if (activeRouteTransition === transition) activeRouteTransition = null;
        }
      );
    } catch {
      activeRouteTransition = null;
      apply();
    }
  } else {
    apply();
    const activeView = elements[ROUTES[nextHash]];
    activeView?.animate?.(
      [
        { opacity: 0, transform: `translate3d(${direction === "back" ? "-1rem" : "1rem"}, 0, 0)` },
        { opacity: 1, transform: "translate3d(0, 0, 0)" }
      ],
      { duration: 340, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
  }
}

function applyRoute(hash) {
  setProfileMenu(false);
  const activeKey = ROUTES[hash];
  document.documentElement.dataset.route = hash.slice(1);

  for (const [key, el] of Object.entries(elements)) {
    if (key.endsWith("View") && el) {
      el.hidden = key !== activeKey;
    }
  }

  updateBottomNav(hash);

  if (hash === "#lich-su") {
    renderHistory();
    document.querySelector("#historyTitle").focus?.({ preventScroll: true });
  } else if (hash === "#hanh-trinh") {
    showCaseListPanel();
    document.querySelector("#hanhTrinhTitle").focus?.({ preventScroll: true });
  } else if (hash === "#vua-chuyen-tien") {
    showPostTransferGate();
    document.querySelector("#postTransferTitle").focus?.({ preventScroll: true });
  } else if (hash === "#bang-chung") {
    if (!elements.evidenceTime.value) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      elements.evidenceTime.value = now.toISOString().slice(0, 16);
    }
    renderEvidenceList();
    document.querySelector("#evidenceTitle").focus?.({ preventScroll: true });
  } else if (hash === "#chuyen-khoan") {
    document.querySelector("#transferTitle").focus?.({ preventScroll: true });
  } else if (hash === "#kiem-tra-lien-ket") {
    document.querySelector("#linkCheckTitle").focus?.({ preventScroll: true });
  } else if (hash === "#gia-dinh") {
    loadFamilySettings();
    document.querySelector("#familyTitle").focus?.({ preventScroll: true });
  } else if (hash === "#quyen-rieng-tu") {
    loadPrivacyToggles();
    renderRecoveryPanel();
    document.querySelector("#privacyTitle").focus?.({ preventScroll: true });
  } else if (hash === "#bao-cao") {
    resetReportView();
    document.querySelector("#reportTitle").focus?.({ preventScroll: true });
  } else if (hash === "#ho-tro") {
    renderSupportDirectory();
    document.querySelector("#supportTitle").focus?.({ preventScroll: true });
  } else if (hash === "#huong-dan") {
    renderEducation();
    document.querySelector("#educationTitle").focus?.({ preventScroll: true });
  } else if (hash === "#canh-bao") {
    document.querySelector("#canhBaoTitle").focus?.({ preventScroll: true });
  } else if (hash === "#xac-minh") {
    resetVerifyView();
    document.querySelector("#verifyTitle").focus?.({ preventScroll: true });
  } else if (hash === "#thoat-cuoc-goi") {
    document.querySelector("#exitCallTitle").focus?.({ preventScroll: true });
  } else if (hash === "#kiem-tra" || hash === "#tin-nhan-la") {
    document.querySelector("#pageTitle").focus?.({ preventScroll: true });
  } else if (hash === "#trang-chu") {
    renderRecoveryBanner();
    document.querySelector("#homeTitle").focus?.({ preventScroll: true });
  }

  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  document.documentElement.style.scrollBehavior = previousScrollBehavior;
}

function setMobileSituationError(message = "") {
  elements.mobileSituationError.textContent = message;
  elements.mobileSituationError.hidden = !message;
  elements.mobileSituationInput.setAttribute("aria-invalid", message ? "true" : "false");
}

// Chỉ cập nhật dòng "Đã chọn: ..." — KHÔNG được xóa thông báo lỗi, vì hàm này
// còn chạy trong finally sau khi phân tích hỏng; xóa lỗi ở đó sẽ khiến màn hình
// im lặng hoàn toàn và người dùng bấm đi bấm lại.
function updateMobileSituationFileStatus() {
  const file = elements.mobileSituationFile.files?.[0];
  elements.mobileSituationFileStatus.textContent = file ? `Đã chọn: ${file.name}` : "";
  elements.mobileSituationFileStatus.hidden = !file;
}

// Người dùng vừa chọn tệp = đã khắc phục "chưa nhập gì", lúc đó mới xóa lỗi.
function handleMobileSituationFileChange() {
  updateMobileSituationFileStatus();
  if (elements.mobileSituationFile.files?.[0]) setMobileSituationError();
}

function clearMobileQuickResult() {
  mobileQuickResultPayload = null;
  elements.mobileQuickResult.hidden = true;
  elements.mobileQuickResultReasons.replaceChildren();
  elements.mobileQuickResultActions.replaceChildren();
  elements.mobileQuickResultNext.hidden = true;
  elements.mobileQuickResultNext.replaceChildren();
  elements.mobileQuickResultBranches.forEach((button) => button.setAttribute("aria-pressed", "false"));
}

function renderMobileQuickResult(result) {
  const riskLabel = displayRiskLabel(result.muc_rui_ro);
  const meta = RISK_META[riskLabel] || RISK_META["Nghi ngờ"];
  mobileQuickResultPayload = { ...result, muc_rui_ro: riskLabel };
  elements.mobileQuickResult.dataset.risk = meta.key;
  elements.mobileQuickResultTitle.textContent = riskLabel;
  elements.mobileQuickResultLead.textContent = meta.lead;
  elements.mobileQuickResultReasons.replaceChildren();

  const reasons = (result.ly_do || []).slice(0, 3);
  for (const reason of reasons.length ? reasons : ["Chưa thấy tín hiệu nguy hiểm rõ trong nội dung bác vừa nói."]) {
    const item = document.createElement("li");
    item.textContent = reason;
    elements.mobileQuickResultReasons.append(item);
  }

  elements.mobileQuickResultActions.replaceChildren();
  const actions = (result.hanh_dong || []).slice(0, 3);
  for (const action of actions.length ? actions : ["Tạm dừng và xác minh qua kênh chính thức."]) {
    const item = document.createElement("li");
    item.textContent = action;
    elements.mobileQuickResultActions.append(item);
  }

  elements.mobileQuickResult.hidden = false;
  elements.mobileQuickResult.focus({ preventScroll: true });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  elements.mobileQuickResult.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
}

function normalizeSituationText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "D")
    .toLowerCase();
}

function buildLocalGuidanceFallback(text, { hasFile = false } = {}) {
  const normalized = normalizeSituationText(text);
  const hasMoneyRequest = /(chuyen tien|chuyen khoan|gui tien|nop tien|muon tien|vay tien)/.test(normalized);
  const hasCriticalSignal = /(otp|ma xac nhan|cai app|cai ung dung|apk|chia se man hinh|anydesk|teamviewer|cong an|toa an|vien kiem sat)/.test(normalized);
  const hasPressure = /(gap|ngay lap tuc|lam ngay|chuyen ngay|giu bi mat|khong noi voi|khoa tai khoan|bat giu)/.test(normalized);
  const suspicious = hasFile || hasMoneyRequest || hasCriticalSignal || hasPressure || /^https?:\/\//i.test(text);
  const highRisk = hasCriticalSignal || (hasMoneyRequest && hasPressure);

  return {
    muc_rui_ro: highRisk ? "Nguy hiểm cao" : suspicious ? "Nghi ngờ" : "Chưa thấy dấu hiệu rủi ro",
    ly_do: highRisk
      ? [
          "Nội dung có yêu cầu nhạy cảm hoặc dấu hiệu gây áp lực cần dừng lại ngay.",
          "Người liên hệ có thể đang cố khiến bác hành động trước khi kịp xác minh.",
          "Không thể xem một yêu cầu chuyển tiền, mã xác nhận hoặc cài ứng dụng là an toàn khi chưa kiểm tra độc lập."
        ]
      : suspicious
        ? [
            "Tình huống có chi tiết cần xác minh lại qua một kênh độc lập.",
            "Chưa đủ căn cứ để tin người gửi, đường link hoặc tệp đính kèm là an toàn.",
            "Dừng lại kiểm tra sẽ giúp tránh quyết định vội vàng."
          ]
        : [
            "Chưa thấy dấu hiệu lừa đảo rõ trong nội dung bác vừa cung cấp.",
            "Thông tin hiện tại vẫn chưa đủ để khẳng định người liên hệ hoàn toàn đáng tin.",
            "Bác nên xác minh thêm nếu có yêu cầu tiền, mã xác nhận hoặc thông tin cá nhân."
          ],
    hanh_dong: [
      "Tạm dừng và không chuyển tiền, không cung cấp OTP hay mật khẩu.",
      "Tự gọi lại người thân hoặc đơn vị liên quan bằng số điện thoại chính thức đã lưu.",
      "Nhờ một người thân đáng tin xem lại tình huống trước khi quyết định."
    ],
    trich_dan: [],
    tin_hieu: {},
    noi_dung_da_doc: text || undefined,
    che_do_du_phong: true
  };
}

function formatLocalGuidanceReply(result) {
  const opening = result.muc_rui_ro === "Chưa thấy dấu hiệu rủi ro"
    ? "Cháu chưa thấy dấu hiệu lừa đảo rõ, nhưng mình vẫn nên xác minh thêm trước khi làm theo."
    : "Tình huống này có điểm cần thận trọng. Bác nên dừng lại và chưa làm theo yêu cầu của người liên hệ.";
  const steps = (result.hanh_dong || []).slice(0, 3).map((action, index) => `${index + 1}. ${action}`).join(" ");
  return `${opening} ${steps}`.trim();
}

async function analyzeMobileSituationInline() {
  const text = elements.mobileSituationInput.value.trim();
  const file = elements.mobileSituationFile.files?.[0];
  if (!text && !file) return;

  // Đang chạy dở thì bỏ qua lần bấm mới: bấm liên tiếp sẽ hủy chính yêu cầu
  // sắp trả về, khiến người dùng kẹt trong trạng thái chờ vô tận.
  if (mobileAnalysisController) return;
  mobileAnalysisController = new AbortController();
  elements.mobileSituationVoiceButton.disabled = true;
  elements.mobileSituationSubmit.disabled = true;
  elements.mobileSituationSubmit.dataset.busy = "true";
  elements.mobileSituationFileStatus.textContent = "Đang kiểm tra, bác chờ một chút...";
  elements.mobileSituationFileStatus.hidden = false;
  setMobileSituationError();
  elements.homeChatUserText.textContent = text || `Đã gửi tệp: ${file.name}`;
  elements.homeChatUserMessage.hidden = false;

  try {
    let result;
    const standaloneUrl = text && /^https?:\/\/\S+$/i.test(text) ? text : "";
    if (standaloneUrl && !file) {
      result = await window.KhoanDaServices.scamAnalysisService.link({
        duong_dan: standaloneUrl,
        thuong_hieu_tu_xung: ""
      }, { signal: mobileAnalysisController.signal });
    } else {
      let media;
      if (file) {
        if (!["image/png", "image/jpeg", "image/webp", "application/pdf"].includes(file.type)) {
          throw new Error("Chỉ nhận ảnh PNG, JPEG, WEBP hoặc PDF.");
        }
        media = file.type === "application/pdf" ? await readFileAsBase64(file) : await compressImage(file);
      }
      result = await window.KhoanDaServices.scamAnalysisService.analyze({
        van_ban: text,
        tep: media ? { mimeType: media.mimeType, data: media.data } : undefined,
        che_do_phuc_hoi: Boolean(getRecoveryMode())
      }, { signal: mobileAnalysisController.signal });
    }
    addHistory(text || result.noi_dung_da_doc || file?.name || "Tình huống đã gửi", result);
    renderMobileQuickResult(result);
    // Xóa tệp đã dùng, nếu không lần kiểm tra sau sẽ âm thầm gửi lại ảnh cũ
    // kèm nội dung mới và cho ra kết luận về một tình huống pha trộn.
    elements.mobileSituationFile.value = "";
    if (riskKey(result.muc_rui_ro) === "high") openDangerDialog("analysis");
  } catch (error) {
    if (error?.name !== "AbortError") {
      const fallback = buildLocalGuidanceFallback(text, { hasFile: Boolean(file) });
      addHistory(text || file?.name || "Tình huống đã gửi", fallback);
      renderMobileQuickResult(fallback);
      elements.mobileSituationFile.value = "";
    }
  } finally {
    elements.mobileSituationVoiceButton.disabled = false;
    elements.mobileSituationSubmit.disabled = false;
    delete elements.mobileSituationSubmit.dataset.busy;
    mobileAnalysisController = null;
    updateMobileSituationFileStatus();
  }
}

function handleMobileResultBranch(button) {
  elements.mobileQuickResultBranches.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  elements.mobileQuickResultNext.hidden = false;
  elements.mobileQuickResultNext.replaceChildren();

  if (button.dataset.mobileResultBranch === "transferred") {
    const text = document.createElement("p");
    text.textContent = "Ưu tiên dừng giao dịch tiếp theo và liên hệ ngân hàng ngay.";
    const link = document.createElement("a");
    link.className = "button button-danger";
    link.href = "#vua-chuyen-tien";
    link.textContent = "Mở Khoan Đã SOS";
    elements.mobileQuickResultNext.append(text, link);
    return;
  }

  const list = document.createElement("ol");
  const steps = button.dataset.mobileResultBranch === "unsure"
    ? ["Không thực hiện thêm giao dịch.", "Kiểm tra ứng dụng ngân hàng hoặc gọi hotline chính thức.", "Nhờ người thân xem cùng."]
    : ["Dừng cuộc gọi.", "Không chuyển tiền hoặc đọc OTP.", "Gọi người thân và tự gọi lại số chính thức."];
  for (const step of steps) {
    const item = document.createElement("li");
    item.textContent = step;
    list.append(item);
  }
  elements.mobileQuickResultNext.append(list);
}

function saveMobileResultToCase() {
  if (!mobileQuickResultPayload) return;
  const caseObj = createCase();
  addEventToCase(caseObj.id, {
    type: "khac",
    text: elements.mobileSituationInput.value.trim() || mobileQuickResultPayload.noi_dung_da_doc || "Tình huống từ Trang chủ",
    signals: mobileQuickResultPayload.tin_hieu || null,
    risk: mobileQuickResultPayload.muc_rui_ro || null
  });
  showToast("Đã lưu vào Vụ việc trên thiết bị này.");
}

function openMobileQuickResultDetails() {
  if (!mobileQuickResultPayload) return;
  elements.situation.value = elements.mobileSituationInput.value.trim();
  elements.situation.dispatchEvent(new Event("input", { bubbles: true }));
  window.location.hash = "#kiem-tra";
  // Hộp cảnh báo đã bật một lần ở trang chủ rồi; bật lại đè lên đúng phần
  // hướng dẫn mà người dùng vừa chủ động mở ra để đọc.
  window.setTimeout(() => renderResult(mobileQuickResultPayload, { showDanger: false }), 350);
}

function submitMobileSituation(event) {
  event.preventDefault();
  const text = elements.mobileSituationInput.value.trim();
  const hasFile = Boolean(elements.mobileSituationFile.files?.length);

  if (!text && !hasFile) {
    setMobileSituationError("Hãy nhập nội dung hoặc chọn một ảnh/PDF.");
    elements.mobileSituationInput.focus();
    return;
  }

  setMobileSituationError();
  analyzeMobileSituationInline();
}

function startMobileSituationRecording() {
  setMobileSituationError();
  toggleSpeechRecognition(elements.mobileSituationInput, elements.mobileSituationVoiceButton);
}

elements.analysisForm.addEventListener("submit", analyze);
elements.checkHubVoiceButton.addEventListener("click", () => {
  if (elements.checkHubVoiceButton.tagName !== "BUTTON") return;
  elements.analysisForm.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => elements.speechButton.click(), 280);
});
elements.mobileSituationForm.addEventListener("submit", submitMobileSituation);
elements.mobileSituationInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  elements.mobileSituationForm.requestSubmit();
});
elements.mobileSituationFileButton.addEventListener("click", () => elements.mobileSituationFile.click());
elements.mobileSituationFile.addEventListener("change", handleMobileSituationFileChange);
elements.mobileSituationInput.addEventListener("input", () => {
  clearMobileQuickResult();
  if (elements.mobileSituationInput.value.trim()) setMobileSituationError();
});
elements.mobileSituationInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    elements.mobileSituationForm.requestSubmit();
  }
});
elements.mobileQuickResultFamily.addEventListener("click", callFamily);
elements.mobileQuickResultDetail.addEventListener("click", openMobileQuickResultDetails);
elements.mobileQuickResultSaveCase.addEventListener("click", saveMobileResultToCase);
elements.mobileQuickResultBranches.forEach((button) => button.addEventListener("click", () => handleMobileResultBranch(button)));
elements.homeSuggestionButtons.forEach((button) => button.addEventListener("click", () => {
  elements.mobileSituationInput.value = button.dataset.homeSuggestion === "call"
    ? "Có người gọi cho tôi và yêu cầu làm theo ngay."
    : "Tôi vừa nhận một tin nhắn lạ và muốn kiểm tra.";
  elements.mobileSituationInput.dispatchEvent(new Event("input", { bubbles: true }));
  elements.mobileSituationInput.focus({ preventScroll: true });
}));

const desktopHomeComposer = document.querySelector("#desktopHomeComposer");
const desktopHomeInput = document.querySelector("#desktopHomeInput");
desktopHomeComposer?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = desktopHomeInput?.value.trim();
  if (!value) {
    desktopHomeInput?.focus();
    return;
  }
  elements.mobileSituationInput.value = value;
  elements.mobileSituationInput.dispatchEvent(new Event("input", { bubbles: true }));
  elements.mobileSituationForm.requestSubmit();
});

elements.homeSupportButton.addEventListener("click", callFamily);
elements.homeAlertFamilyCall?.addEventListener("click", callFamily);
elements.homeAlertFamilySms?.addEventListener("click", alertFamilyBySms);
elements.situation.addEventListener("input", () => {
  updateCharacterCount();
  if (elements.situation.value.trim()) setInputError();
});
elements.imagePickButton.addEventListener("click", () => elements.imageInput.click());
elements.imageInput.addEventListener("change", handleImageSelected);
elements.imageRemoveButton.addEventListener("click", clearSelectedImage);
elements.callFamilyButton.addEventListener("click", callFamily);
elements.dangerCallButton.addEventListener("click", callFamily);
elements.dangerBankCallButton.addEventListener("click", callBank);
elements.dangerReadButton.addEventListener("click", speakResult);
elements.dangerScriptSpeakButton.addEventListener("click", () => speakExitScript(elements.dangerScriptLine.textContent));
elements.dangerExitCallButton.addEventListener("click", openExitCallView);
elements.readResultButton.addEventListener("click", speakResult);
elements.familyForm.addEventListener("submit", saveSettings);
elements.contactForm.addEventListener("submit", addContact);
elements.toggleSaveHistory.addEventListener("change", () => {
  setStored(STORAGE_KEYS.saveHistoryDisabled, elements.toggleSaveHistory.checked ? "0" : "1");
});
elements.toggleConsentPersonalization.addEventListener("change", () => {
  setStored(STORAGE_KEYS.consent, elements.toggleConsentPersonalization.checked ? "1" : "0");
});
elements.exportDataButton.addEventListener("click", exportAllData);
elements.deleteAllDataButton.addEventListener("click", deleteAllData);
[elements.reportCallerName, elements.reportPhone, elements.reportAccount, elements.reportAmount].forEach((field) => {
  field.addEventListener("input", updateReportSummary);
});
document.querySelectorAll('input[name="reportDamage"]').forEach((radio) => {
  radio.addEventListener("change", updateReportSummary);
});
elements.reportCopyButton.addEventListener("click", copyReportSummary);
elements.reportDownloadButton.addEventListener("click", downloadReportSummary);
elements.reportQueueButton.addEventListener("click", queueCommunityReport);
elements.reportMarkedSent.addEventListener("change", () => {
  if (elements.reportMarkedSent.checked) {
    showToast("Đã ghi nhận — chúc bạn xử lý thuận lợi.");
  }
});
elements.clearSettingsButton.addEventListener("click", () => {
  const cleared = removeStored(STORAGE_KEYS.bankPhone) && removeStored(STORAGE_KEYS.keyword);
  elements.bankPhone.value = "";
  elements.familyKeyword.value = "";
  elements.familyKeyword.placeholder = "Một từ chỉ gia đình biết";
  elements.settingsStatus.dataset.state = cleared ? "success" : "error";
  elements.settingsStatus.textContent = cleared
    ? "Đã xóa toàn bộ dữ liệu đã lưu."
    : "Không thể xóa dữ liệu trên trình duyệt này.";
});
elements.dangerDialog.addEventListener("close", stopDangerCountdown);
elements.pressurePhraseGrid.querySelectorAll(".phrase-chip").forEach((chip) => {
  chip.addEventListener("click", () => togglePressurePhrase(chip.dataset.phrase));
});
elements.closeDangerButton.addEventListener("click", () => elements.dangerDialog.close());
elements.pressureCalmButton.addEventListener("click", () => {
  stopDangerCountdown();
  elements.dangerDialog.close();
});
elements.dangerStillPressuredButton.addEventListener("click", callFamily);
elements.dangerOkNowButton.addEventListener("click", () => elements.dangerDialog.close());
elements.dangerUploadEvidenceButton.addEventListener("click", () => elements.dangerEvidenceInput.click());
elements.dangerEvidenceInput.addEventListener("change", analyzeDangerEvidence);
elements.pressureStepPrevious.addEventListener("click", () => {
  pressureStepIndex = Math.max(0, pressureStepIndex - 1);
  renderPressureStep();
});
elements.pressureStepNext.addEventListener("click", () => {
  if (pressureStepIndex === PRESSURE_STEPS.length - 1) {
    elements.dangerDialog.close();
    return;
  }
  pressureStepIndex += 1;
  renderPressureStep();
});
elements.pressureStepSpeak.addEventListener("click", () => {
  const step = PRESSURE_STEPS[pressureStepIndex];
  window.KhoanDaServices.textToSpeechService.speak(`${step.title}. ${step.text}`);
});
document.querySelectorAll("[data-open-pressure-mode]").forEach((button) => {
  button.addEventListener("click", () => openDangerDialog("pressure"));
});
elements.verifyReadAllButton.addEventListener("click", readAllVerifyQuestions);
elements.verifyOkButton.addEventListener("click", () => {
  showToast("Vẫn nên tự gọi lại qua số chính thức nếu còn nghi ngờ.");
});
document.querySelectorAll(".exit-script__read").forEach((button) => {
  button.addEventListener("click", () => speakExitScript(button.dataset.script));
});
elements.exitCallFamilyButton.addEventListener("click", callFamily);
elements.exitCallBankButton.addEventListener("click", callBank);
renderVerifyCategories();
elements.transferForm.addEventListener("submit", analyzeTransfer);
elements.postTransferYesButton.addEventListener("click", showPostTransferRescue);
elements.postTransferNoButton.addEventListener("click", showPostTransferNotYet);
elements.postTransferCallButton.addEventListener("click", callFamily);
elements.postTransferBankButton.addEventListener("click", callBank);
elements.rescueSaveButton.addEventListener("click", saveRescueEvidence);
elements.postTransferShareChecklistButton.addEventListener("click", shareChecklist);
elements.postTransferCopySummaryButton.addEventListener("click", copySummaryForBank);
elements.postTransferChecklist.addEventListener("change", persistChecklist);
elements.evidenceForm.addEventListener("submit", saveEvidence);
elements.evidenceFillFromHistoryButton.addEventListener("click", fillEvidenceFromHistory);
elements.evidenceCancelEditButton.addEventListener("click", cancelEditingEvidence);
elements.clearEvidenceButton.addEventListener("click", () => {
  setEvidence([]);
  cancelEditingEvidence();
  renderEvidenceList();
  showToast("Đã xóa tất cả hồ sơ bằng chứng.");
});
elements.clearHistoryButton.addEventListener("click", () => {
  setHistory([]);
  renderHistory();
  showToast("Đã xóa lịch sử.");
});
document.querySelectorAll("[data-sample]").forEach((button) => {
  button.addEventListener("click", () => {
    elements.situation.value = SAMPLES[button.dataset.sample];
    updateCharacterCount();
    setInputError();
    elements.situation.focus();
  });
});
elements.createCaseButton.addEventListener("click", () => {
  const newCase = createCase();
  showCaseDetail(newCase.id);
});
elements.backToCaseListButton.addEventListener("click", showCaseListPanel);
elements.caseEventImagePickButton.addEventListener("click", () => elements.caseEventImageInput.click());
elements.caseEventImageInput.addEventListener("change", handleCaseEventImageSelected);
elements.caseEventImageRemoveButton.addEventListener("click", clearSelectedCaseEventImage);
elements.caseEventSubmitButton.addEventListener("click", submitCaseEvent);
elements.caseMetadataForm.addEventListener("submit", saveCaseMetadata);
elements.caseExportButton.addEventListener("click", exportCurrentCase);
elements.analyzeJourneyButton.addEventListener("click", analyzeJourney);
elements.linkCheckImagePickButton.addEventListener("click", () => elements.linkCheckImageInput.click());
elements.linkCheckImageInput.addEventListener("change", handleLinkCheckImageSelected);
elements.linkCheckSubmitButton.addEventListener("click", submitLinkCheck);
elements.activateRecovery72Button.addEventListener("click", () => {
  activateRecoveryMode(3);
  renderRecoveryPanel();
  showToast("Đã bật chế độ bảo vệ tăng cường trong 72 giờ.");
});
elements.activateRecovery7dButton.addEventListener("click", () => {
  activateRecoveryMode(7);
  renderRecoveryPanel();
  showToast("Đã bật chế độ bảo vệ tăng cường trong 7 ngày.");
});
elements.endRecoveryButton.addEventListener("click", () => {
  endRecoveryModeEarly();
  renderRecoveryPanel();
  showToast("Đã kết thúc chế độ bảo vệ tăng cường.");
});
elements.postTransferActivateRecoveryButton.addEventListener("click", () => {
  activateRecoveryMode(3);
  elements.postTransferRecoveryPrompt.hidden = true;
  showToast("Đã bật chế độ bảo vệ tăng cường trong 72 giờ.");
});
elements.recoveryActive.querySelectorAll("[data-recovery-step]").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    toggleRecoveryChecklistStep(checkbox.dataset.recoveryStep, checkbox.checked);
  });
});

elements.fontSizeButtons.forEach((button) => button.addEventListener("click", () => applyFontSize(button.dataset.fontSize)));
elements.profileMenuButton.addEventListener("click", handleProfileTrigger);
elements.profileIconButton?.addEventListener("click", handleProfileTrigger);
elements.notificationButton?.addEventListener("click", () => {
  window.location.hash = "#canh-bao";
});
elements.desktopSearchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = elements.desktopSearchInput.value.trim();
  if (!query) {
    window.location.hash = "#kiem-tra";
    return;
  }
  window.location.hash = "#kiem-tra";
  window.setTimeout(() => {
    elements.situation.value = query;
    updateCharacterCount();
    elements.situation.focus();
  }, 0);
});
elements.mobileProfileMenuButton.addEventListener("click", handleProfileTrigger);
elements.profileMenuClose.addEventListener("click", () => setProfileMenu(false, { restoreFocus: true }));
elements.profileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setProfileMenu(false)));
elements.reopenOnboardingButton.addEventListener("click", openOnboarding);
elements.logoutButton.addEventListener("click", logout);
elements.deleteAccountButton.addEventListener("click", deleteAccount);
elements.authDialogClose.addEventListener("click", closeAuthDialog);
elements.authLoginTab.addEventListener("click", () => setAuthMode("login"));
elements.authRegisterTab.addEventListener("click", () => setAuthMode("register"));
elements.authModeSwitch.addEventListener("click", () => setAuthMode(authMode === "login" ? "register" : "login"));
elements.authPasswordToggle.addEventListener("click", () => {
  const reveal = elements.authPassword.type === "password";
  elements.authPassword.type = reveal ? "text" : "password";
  elements.authPasswordToggle.classList.toggle("is-visible", reveal);
  elements.authPasswordToggle.setAttribute("aria-pressed", String(reveal));
  elements.authPasswordToggle.setAttribute("aria-label", reveal ? "Ẩn mật khẩu" : "Hiện mật khẩu");
});
elements.authForm.addEventListener("submit", submitAuth);
elements.authDialog.addEventListener("click", (event) => {
  if (event.target === elements.authDialog) closeAuthDialog();
});
elements.caseFilterButtons.forEach((button) => button.addEventListener("click", () => {
  activeCaseFilter = button.dataset.caseFilter;
  elements.caseFilterButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderCaseList();
}));
elements.onboardingNextButtons.forEach((button) => button.addEventListener("click", () => renderOnboardingStep(onboardingStep + 1)));
elements.onboardingBackButtons.forEach((button) => button.addEventListener("click", () => renderOnboardingStep(onboardingStep - 1)));
elements.onboardingSkipButtons.forEach((button) => button.addEventListener("click", completeOnboarding));
elements.onboardingMethodButtons.forEach((button) => button.addEventListener("click", () => chooseOnboardingMethod(button)));
elements.onboardingBranchButtons.forEach((button) => button.addEventListener("click", () => chooseOnboardingBranch(button)));
elements.finishOnboardingButton.addEventListener("click", completeOnboarding);
elements.finishOnboardingLaterButton.addEventListener("click", () => {
  completeOnboarding();
  openAuthDialog();
});
document.addEventListener("click", (event) => {
  if (elements.profileMenu.hidden) return;
  if (elements.profileMenu.contains(event.target) || elements.profileMenuButton.contains(event.target) || elements.mobileProfileMenuButton.contains(event.target) || elements.profileIconButton?.contains(event.target)) return;
  setProfileMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.profileMenu.hidden) setProfileMenu(false, { restoreFocus: true });
});
elements.voiceGuideToggle.addEventListener("click", () => {
  const enabled = elements.voiceGuideToggle.getAttribute("aria-pressed") !== "true";
  elements.voiceGuideToggle.setAttribute("aria-pressed", String(enabled));
  elements.voiceGuideToggle.classList.toggle("is-enabled", enabled);
  setStored(STORAGE_KEYS.voiceGuide, enabled ? "1" : "0");
  showToast(enabled ? "Đã bật đọc hướng dẫn khi bác yêu cầu." : "Đã tắt đọc hướng dẫn.");
});
elements.cancelAnalysisButton.addEventListener("click", () => currentAnalysisController?.abort());
elements.reputationCheckButton.addEventListener("click", checkReputation);
elements.editRecognizedTextButton.addEventListener("click", editRecognizedText);
elements.reportWrongResultButton.addEventListener("click", reportWrongResult);
elements.addResultToCaseButton.addEventListener("click", addCurrentResultToCase);
elements.educationSpeakButton.addEventListener("click", () => {
  const lesson = EDUCATION_LESSONS[currentEducationIndex];
  window.KhoanDaServices.textToSpeechService.speak(`${lesson.title}. ${lesson.scenario}. ${lesson.explanation}`);
});
elements.educationRetryButton.addEventListener("click", () => {
  currentEducationChoice = null;
  renderEducationLesson();
});
elements.educationNextButton.addEventListener("click", () => {
  currentEducationIndex = (currentEducationIndex + 1) % EDUCATION_LESSONS.length;
  currentEducationChoice = null;
  renderEducation();
});

// New education buttons
const educationStartButton = document.querySelector("#educationStartButton");
if (educationStartButton) {
  educationStartButton.addEventListener("click", () => {
    currentEducationIndex = 0;
    currentEducationChoice = null;
    renderEducation();
    elements.educationLesson.hidden = false;
    elements.educationLesson.scrollIntoView({ behavior: "smooth" });
  });
}

const educationNotificationButton = document.querySelector("#educationNotificationButton");
if (educationNotificationButton) {
  educationNotificationButton.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      showToast("Trình duyệt này không hỗ trợ thông báo.");
      return;
    }
    if (Notification.permission === "granted") {
      showToast("Thông báo đã được bật từ trước.");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        showToast("Đã bật thông báo thành công!");
        new Notification("Khoan Đã", {
          body: "Bạn sẽ nhận được thông báo khi có bài học mới.",
          icon: "/assets/brand-shield-purple.webp"
        });
      } else {
        showToast("Bạn đã từ chối quyền thông báo.");
      }
    } catch (err) {
      showToast("Không thể bật thông báo.");
    }
  });
}

elements.toggleFamilySharing.addEventListener("change", () => {
  setStored(STORAGE_KEYS.familySharing, elements.toggleFamilySharing.checked ? "1" : "0");
  appendPrivacyAudit("family_sharing", elements.toggleFamilySharing.checked ? "Bật chia sẻ gia đình có xác nhận" : "Tắt chia sẻ gia đình");
});
elements.retentionPolicy.addEventListener("change", () => {
  setStored(STORAGE_KEYS.retentionPolicy, elements.retentionPolicy.value);
  applyRetentionPolicy();
  appendPrivacyAudit("retention_policy", `Đổi thời hạn tự xóa: ${elements.retentionPolicy.value}`);
  renderPrivacyDataList();
  renderPrivacyAuditLists();
});
elements.oneTimeCheckMode.addEventListener("change", () => {
  setStored(STORAGE_KEYS.oneTimeCheck, elements.oneTimeCheckMode.checked ? "1" : "0");
  appendPrivacyAudit("one_time_check", elements.oneTimeCheckMode.checked ? "Bật kiểm tra một lần" : "Tắt kiểm tra một lần");
});

elements.analysisDropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  elements.analysisDropzone.classList.add("is-dragging");
});
elements.analysisDropzone.addEventListener("dragleave", () => elements.analysisDropzone.classList.remove("is-dragging"));
elements.analysisDropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  elements.analysisDropzone.classList.remove("is-dragging");
  const file = event.dataTransfer.files?.[0];
  if (!file) return;
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  elements.imageInput.files = dataTransfer.files;
  elements.imageInput.dispatchEvent(new Event("change", { bubbles: true }));
});

window.addEventListener("hashchange", route);

setupSpeechRecognition();
updateCharacterCount();
loadAccessibilityPreferences();
renderAuthState();
applyRetentionPolicy();
renderPrivacyAuditLists();
route();
const isFreshAppEntry = window.location.hash === "" || new URLSearchParams(window.location.search).has("intro");
if (isFreshAppEntry || getStored(STORAGE_KEYS.onboardingComplete) !== "1") openOnboarding();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}

// ==========================================================================
// CHAT WIDGET ASSISTANT LOGIC
// ==========================================================================
let chatWidgetOpen = false;
let chatWidgetHistory = [];

function toggleChatWidget() {
  chatWidgetOpen = !chatWidgetOpen;
  elements.chatWidgetWindow.hidden = !chatWidgetOpen;
  elements.chatWidgetButton.setAttribute("aria-expanded", String(chatWidgetOpen));
  elements.chatWidgetBadge.hidden = true;

  if (chatWidgetOpen) {
    elements.chatWidgetInput.focus();
    elements.chatWidgetMessages.scrollTop = elements.chatWidgetMessages.scrollHeight;
  }
}

async function handleChatSubmit(event) {
  event.preventDefault();
  const text = elements.chatWidgetInput.value.trim();
  if (!text) return;

  elements.chatWidgetInput.value = "";
  addChatMessage("user", text);
  chatWidgetHistory.push({ role: "user", text });

  const loadingEl = showChatLoading();

  try {
    const payload = await window.KhoanDaServices.scamAnalysisService.chat({ tin_nhan: text });
    loadingEl.remove();

    if (payload.tra_loi) {
      addChatMessage("assistant", payload.tra_loi);
      chatWidgetHistory.push({ role: "assistant", text: payload.tra_loi });

      const voiceGuideActive = elements.voiceGuideToggle.getAttribute("aria-pressed") === "true";
      if (voiceGuideActive) {
        window.KhoanDaServices.textToSpeechService.speak(payload.tra_loi);
      }
    } else {
      throw new Error("Không nhận được câu trả lời.");
    }
  } catch (error) {
    loadingEl.remove();
    const fallback = buildLocalGuidanceFallback(text);
    const reply = formatLocalGuidanceReply(fallback);
    addChatMessage("assistant", reply);
    chatWidgetHistory.push({ role: "assistant", text: reply });
  }
}

function addChatMessage(sender, text) {
  const msgEl = document.createElement("div");
  msgEl.className = `chat-widget__msg chat-widget__msg--${sender}`;
  const pEl = document.createElement("p");
  pEl.textContent = text;
  msgEl.appendChild(pEl);
  elements.chatWidgetMessages.appendChild(msgEl);
  elements.chatWidgetMessages.scrollTop = elements.chatWidgetMessages.scrollHeight;
}

function showChatLoading() {
  const loadingEl = document.createElement("div");
  loadingEl.className = "chat-widget__msg chat-widget__msg--loading";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "chat-widget__dot";
    loadingEl.appendChild(dot);
  }
  elements.chatWidgetMessages.appendChild(loadingEl);
  elements.chatWidgetMessages.scrollTop = elements.chatWidgetMessages.scrollHeight;
  return loadingEl;
}

elements.chatWidgetButton.addEventListener("click", toggleChatWidget);
elements.chatWidgetClose.addEventListener("click", toggleChatWidget);
elements.chatWidgetForm.addEventListener("click", (e) => e.stopPropagation());
elements.chatWidgetForm.addEventListener("submit", handleChatSubmit);
