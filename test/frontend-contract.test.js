const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
const services = fs.readFileSync(path.join(root, "public", "services.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "public", "styles.css"), "utf8");
const refreshStyles = fs.readFileSync(path.join(root, "public", "khoan-da-2026.css"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public", "manifest.webmanifest"), "utf8"));
const serviceWorker = fs.readFileSync(path.join(root, "public", "sw.js"), "utf8");
const supportDirectory = JSON.parse(fs.readFileSync(path.join(root, "public", "config", "support-directory.json"), "utf8"));

test("primary product surfaces use the Khoan Đã brand", () => {
  // "Khoan Đã" is the product name that leads the logo and page title; the
  // tagline under the logo follows the 2026 mobile home refresh.
  assert.match(html, /class="brand__title">Khoan Đã</);
  assert.equal(manifest.name, "Khoan Đã");
  assert.match(html, /name="description" content="Khoan Đã/);
  assert.match(html, /<title>Khoan đã/);
  assert.match(html, /class="brand__tagline">Bảo vệ bác, mỗi ngày/);
});

test("critical senior and emergency controls are present", () => {
  for (const id of [
    "voiceGuideToggle", "analysisDropzone", "cancelAnalysisButton",
    "pressureGuide", "postTransferView", "familyView", "privacyView",
    "supportView", "educationView", "chatWidgetButton", "chatWidgetWindow",
    "chatWidgetMessages", "chatWidgetForm", "chatWidgetInput"
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /TÔI ĐANG BỊ THÚC ÉP/);
  assert.match(html, /TÔI ĐÃ CHUYỂN TIỀN/);
});

test("frontend network access is centralized in service adapters", () => {
  assert.doesNotMatch(app, /\bfetch\s*\(/);
  for (const name of [
    "scamAnalysisService", "ocrService", "speechToTextService", "reputationService",
    "qrService", "evidenceService", "familyCircleService", "supportDirectoryService",
    "communityReportService", "privacyService", "notificationService", "textToSpeechService"
  ]) {
    assert.match(services, new RegExp(name));
  }
});

test("demo and unverified reputation states are explicit", () => {
  assert.match(html, /AI có thể nhận sai/);
  assert.match(app, /dữ liệu minh họa/);
  assert.match(app, /Chưa có dữ liệu xác minh/);
});

test("analysis result renders structured next-step guidance without replacing legacy fields", () => {
  assert.match(html, /id="structuredInsightSection"/);
  assert.match(html, /Bước tiếp theo họ có thể yêu cầu bác/);
  assert.match(html, /id="predictedNextStepList"/);
  assert.match(html, /id="resultLimitationList"/);
  assert.match(app, /function renderStructuredInsights\(structuredResult\)/);
  assert.match(app, /renderStructuredInsights\(result\.structuredResult\)/);
  assert.match(app, /fillList\(elements\.reasonList, result\.ly_do \|\| \[\]\)/);
  assert.match(app, /fillList\(elements\.actionList, result\.hanh_dong \|\| \[\]\)/);
});

test("senior forms keep selects aligned with inputs and icon buttons labeled", () => {
  assert.match(styles, /textarea,\s*\ninput,\s*\nselect\s*\{/);
  assert.match(styles, /select\s*\{[\s\S]*?appearance:\s*none;/);
  assert.match(html, /id="voiceGuideToggle"[^>]*aria-label="Đọc hướng dẫn"/);
  for (const id of ["contactRole", "contactPermission", "contactExpiry", "retentionPolicy"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test("route changes close a danger dialog before showing another view", () => {
  assert.match(app, /previousHash && previousHash !== nextHash && elements\.dangerDialog\.open/);
  assert.match(app, /elements\.dangerDialog\.close\(\)/);
});

test("home images use optimized loading paths", () => {
  // The desktop hero heading is real HTML text (not baked into a bitmap) so the
  // font-size control can enlarge it; the hero image is a text-free couple photo.
  assert.match(html, /class="hero-band__reference"[^>]*src="\/assets\/home-couple-reference\.webp"/);
  assert.match(html, /class="hero-accessible-copy"[^>]*>[\s\S]*?<h1 id="homeTitle"/);
  assert.match(html, /src="\/assets\/reassurance-reference\.webp"[^>]*loading="lazy"/);
});

test("file inputs and editable report summary have accessible names", () => {
  assert.match(html, /id="imageInput"[^>]*aria-label="Chọn ảnh hoặc PDF tình huống"/);
  assert.match(html, /id="linkCheckImageInput"[^>]*aria-label="Chọn ảnh mã QR"/);
  assert.match(html, /id="reportSummary"[^>]*aria-label="Bản tóm tắt báo cáo"/);
});

test("mobile home exposes the reference workflow without replacing desktop routes", () => {
  for (const className of [
    "mobile-reference-top", "mobile-situation-form", "mobile-bottom-nav"
  ]) {
    assert.match(html, new RegExp(`class="[^"]*${className}`));
  }
  // .mobile-action-grid was a byte-for-byte destination clone of .hub-tile-grid
  // and .mobile-trust-strip carried a hardcoded "An toàn" badge. Both computed
  // to display:none at every width, so they were dead markup that still had to
  // be read and maintained. They must not come back.
  assert.match(html, /mobile-action-grid/);
  assert.match(html, /mobile-trust-strip/);
  for (const hash of ["#xac-minh", "#kiem-tra", "#kiem-tra-lien-ket", "#chuyen-khoan", "#hanh-trinh", "#huong-dan", "#quyen-rieng-tu"]) {
    assert.match(html, new RegExp(`href="${hash}"`));
  }
  assert.match(styles, /@media \(max-width: 40rem\)[\s\S]*?\.mobile-bottom-nav/);
  assert.match(styles, /grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(html, /class="mobile-reference-top"/);
  assert.match(html, /id="mobileProfileMenuButton"[\s\S]*?avatar-reference\.webp[\s\S]*?icon-chevron-down/);
  // The approved crop supplies pixel-accurate mobile artwork while the same
  // heading remains in the DOM for screen readers and semantic navigation.
  assert.match(html, /<h2 id="mobileReferenceTitle">Bác đang gặp tình huống gì\?<\/h2>/);
  // KHÔNG được nướng chữ vào ảnh. Lỗi này đã ship HAI lần (26/7 và 27/7) và CI
  // xanh cả hai lần vì chỉ có ghi chú chứ không có assertion.
  // mobile-home-top-reference.webp vẽ sẵn "Khoan Đã", dòng tagline và cả câu
  // "Bác đang gặp tình huống gì?" thành pixel: đã đo, ảnh giữ nguyên 375x270 ở
  // cả ba bậc cỡ chữ, nên nút A / A+ / A++ vô tác dụng đúng ở dòng to nhất trang.
  for (const asset of [
    "mobile-home-top-reference", "mobile-home-screen-reference",
    "home-hero-reference", "mobile-home-hero-reference"
  ]) {
    assert.doesNotMatch(html, new RegExp(asset), `${asset} chứa chữ nướng sẵn — không được đưa lại vào index.html`);
  }
  // Chỉ vắng mặt ảnh là chưa đủ: chữ thật phải THỰC SỰ HIỆN. Lần trước khối chữ
  // vẫn nằm trong DOM nhưng bị ép width/height 1px + clip để nhường chỗ cho ảnh,
  // còn logo và nút hồ sơ bị đặt opacity: 0 làm lớp bấm vô hình.
  assert.doesNotMatch(styles, /mobile-reference-top__intro\s*\{[^}]*clip:\s*rect\(0 0 0 0\)/);
  assert.doesNotMatch(styles, /mobile-reference-top__(brand|profile)[^{]*\{[^}]*opacity:\s*0;/);
  assert.match(html, /id="mobileSituationForm"[\s\S]*?id="mobileSituationInput"[\s\S]*?id="mobileSituationFile"/);
  assert.match(html, /id="mobileSituationVoiceButton"[^>]*aria-label="Ghi âm tình huống"/);
  assert.match(html, /class="mobile-situation-submit"[^>]*type="submit"[\s\S]*?<span>Tiếp tục<\/span>[\s\S]*?icon-chevron-right/);
  assert.match(styles, /#homeView \.mobile-reference-top[\s\S]*?#homeView \.mobile-situation-form/);
  for (const className of ["hub-cards", "hub-tile-grid", "reassurance-band", "home-quick-links", "home-sidebar"]) {
    assert.match(styles, new RegExp(`#homeView \\.${className.replaceAll("-", "\\-")}`));
  }
  assert.match(html, /hub-tile__title--desktop[\s\S]*?hub-tile__title--mobile/);
  assert.match(styles, /Mobile home reference, 2026-07-26[\s\S]*?#homeView \.mobile-action-grid \{[\s\S]*?display:\s*grid/);
  assert.match(styles, /Mobile home reference, 2026-07-26[\s\S]*?#homeView \.mobile-trust-strip \{[\s\S]*?display:\s*grid/);
  assert.match(styles, /#homeView \.hub-tile__arrow\s*\{\s*display:\s*none;/);
  assert.match(app, /function submitMobileSituation\(event\)/);
  assert.match(app, /function startMobileSituationRecording\(\)/);
  assert.match(app, /mobileSituationVoiceButton\.addEventListener\("click", startMobileSituationRecording\)/);
  assert.match(html, /id="mobileSituationVoiceButton"[^>]*aria-pressed="false"/);
  assert.match(app, /toggleSpeechRecognition\(elements\.mobileSituationInput, elements\.mobileSituationVoiceButton\)/);
  const mobileRecordingHandler = app.match(/function startMobileSituationRecording\(\)\s*\{[\s\S]*?\n\}/)?.[0] || "";
  assert.doesNotMatch(mobileRecordingHandler, /location\.hash/);
  assert.match(app, /activeSpeechTarget\.value = `[\s\S]*?transcript[\s\S]*?dispatchEvent\(new Event\("input"/);
  assert.match(app, /function submitMobileSituation\(event\)[\s\S]*?analyzeMobileSituationInline\(\)/);
  // The attached file is cleared after each check so the next, unrelated check
  // cannot silently re-send the previous photo.
  assert.match(app, /elements\.mobileSituationFile\.value = ""/);
  assert.match(styles, /#homeView \.hub-tile \{[\s\S]*?justify-content:\s*center/);
  assert.match(styles, /#homeView \.mobile-action-grid \{[\s\S]*?order:\s*4;/);
  assert.match(styles, /#homeView \.home-main > \.emergency-zone \{[\s\S]*?order:\s*5;/);
  assert.match(styles, /#homeView \.mobile-trust-strip \{[\s\S]*?order:\s*6;/);
  assert.match(html, /class="mobile-home-followup"[\s\S]*?href="#huong-dan"[\s\S]*?href="#gia-dinh"[\s\S]*?href="#canh-bao"/);
  assert.match(styles, /#homeView \.mobile-home-followup \{[\s\S]*?order:\s*7;[\s\S]*?display:\s*block/);
  assert.match(styles, /mobile-home-followup__actions a \{[\s\S]*?min-height:\s*max\(4\.25rem, var\(--touch-target-primary\)\)/);
  assert.match(styles, /#homeView \.home-suggestion-chips,[\s\S]*?#homeView \.hub-tile-grid,[\s\S]*?display:\s*none !important/);
});

test("home voice analysis stays inline and trusted support actions are functional", () => {
  assert.match(html, /id="mobileQuickResult"[\s\S]*?id="mobileQuickResultFamily"[\s\S]*?id="mobileQuickResultDetail"/);
  assert.match(html, /id="homeSupportButton"[\s\S]*?Gọi người thân hỗ trợ/);
  assert.doesNotMatch(html, /id="homeVoiceButton"/);
  assert.match(app, /function analyzeMobileSituationInline\(\)/);
  assert.match(app, /elements\.homeChatUserText\.textContent/);
  assert.match(app, /scamAnalysisService\.link/);
  assert.match(app, /duong_dan:\s*standaloneUrl,[\s\S]*?thuong_hieu_tu_xung:\s*""/);
  assert.doesNotMatch(app, /thuong_hieu:\s*""/);
  assert.match(html, /id="mobileQuickResultActions"/);
  assert.match(html, /data-mobile-result-branch="transferred"/);
  assert.match(app, /function saveMobileResultToCase\(\)/);
  assert.match(app, /shouldAnalyzeInline[\s\S]*?analyzeMobileSituationInline\(\)/);
  assert.match(app, /mobileQuickResultFamily\.addEventListener\("click", callFamily\)/);
  assert.match(app, /navigator\.share/);
  assert.match(app, /navigator\.clipboard\?\.writeText/);
  assert.match(html, /href="#ho-tro"[\s\S]*?Mở danh bạ chính thức/);
  assert.match(app, /function buildLocalGuidanceFallback\(text/);
  assert.match(app, /renderMobileQuickResult\(fallback\)/);
  assert.doesNotMatch(app, /Gemini chưa thể phân tích/);
});

test("desktop reassurance content uses a readable two-column layout", () => {
  assert.match(refreshStyles, /Desktop reassurance panel/);
  assert.match(refreshStyles, /#homeView \.reassurance-band\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) minmax\(15rem, 19rem\)/);
  assert.match(refreshStyles, /#homeView \.reassurance-band__body\s*\{[\s\S]*?grid-column:\s*1/);
  assert.match(refreshStyles, /#homeView \.reassurance-band__art\s*\{[\s\S]*?grid-column:\s*2/);
});

test("desktop and mobile taskbars share routes and render cross-browser icons", () => {
  const mobileNav = html.match(/<nav class="mobile-bottom-nav"[\s\S]*?<\/nav>/)?.[0] || "";
  for (const [hash, label, icon] of [
    ["#trang-chu", "Trang chủ", "icon-home"],
    ["#kiem-tra", "Kiểm tra", "icon-shield-check"],
    ["#hanh-trinh", "Vụ việc", "icon-receipt"],
    ["#huong-dan", "Học hỏi", "icon-education"],
    ["#gia-dinh", "Gia đình", "icon-users"]
  ]) {
    assert.match(mobileNav, new RegExp(`href="${hash}"[\\s\\S]*?${icon}[\\s\\S]*?${label}`));
  }
  assert.doesNotMatch(mobileNav, /href="#lich-su"/);
  assert.match(html, /class="profile-menu__links"[\s\S]*?href="#lich-su"[\s\S]*?Lịch sử kiểm tra/);
  assert.match(styles, /-webkit-mask-image:\s*var\(--icon-source\)/);
  assert.match(styles, /@media \(min-width: 40\.0625rem\)[\s\S]*?grid-template-columns:\s*repeat\(4/);
  assert.match(styles, /\.mobile-bottom-nav[\s\S]*?border-radius:\s*var\(--radius-xl\)/);
});

test("desktop web shell exposes sidebar brand, search and large-screen overrides", () => {
  assert.match(html, /class="desktop-sidebar-brand"[\s\S]*?Khoan Đã[\s\S]*?Bảo vệ bác, mỗi ngày/);
  assert.match(html, /id="desktopSearchForm"[\s\S]*?id="desktopSearchInput"[\s\S]*?placeholder="Tìm kiếm hoặc hỗ trợ"/);
  assert.match(html, /khoan-da-2026\.css\?v=20260731-check-hub-reference-3/);
  assert.match(serviceWorker, /khoan-da-shell-v41/);
  assert.match(serviceWorker, /khoan-da-2026\.css\?v=20260731-check-hub-reference-2/);
  assert.match(refreshStyles, /Desktop web redesign, 2026-07-28/);
  assert.match(refreshStyles, /@media \(min-width: 64rem\)[\s\S]*?--desktop-sidebar-w/);
  assert.match(refreshStyles, /\.desktop-sidebar-brand/);
  assert.match(refreshStyles, /\.desktop-search/);
});

test("floating header, local account flow and reference history shell stay connected", () => {
  assert.match(html, /id="profileMenuButton"[\s\S]*?data-auth-label>Đăng nhập/);
  for (const id of ["authDialog", "authLoginTab", "authRegisterTab", "authForm", "logoutButton", "deleteAccountButton"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(app, /account:\s*"khoan-da:account"/);
  assert.match(app, /crypto\.subtle\.digest\("SHA-256"/);
  assert.match(app, /function renderAuthState\(\)/);
  assert.match(app, /function submitAuth\(event\)/);
  assert.match(refreshStyles, /Unified floating shell and final mobile references/);
  assert.match(refreshStyles, /html\[data-authenticated="true"\][\s\S]*?\.greeting-chip/);
  assert.match(html, /class="case-history-hero"[\s\S]*?mascot-history\.webp/);
  for (const filter of ["all", "checked", "saved"]) assert.match(html, new RegExp(`data-case-filter="${filter}"`));
  assert.match(app, /function renderCaseList\(\)[\s\S]*?activeCaseFilter/);
  assert.match(html, /class="analysis-mascot"[^>]*mascot-check\.webp/);
  assert.match(refreshStyles, /html\[data-route="kiem-tra"\] #analysisView > \.analysis-mascot[\s\S]*?display:\s*block !important/);
});

test("onboarding is a functional five-step reference flow and can be reopened", () => {
  for (const step of [1, 2, 3, 4, 5]) assert.match(html, new RegExp(`data-onboarding-step="${step}"`));
  for (const step of [1, 2, 3, 4, 5]) assert.match(html, new RegExp(`onboarding-reference-${step}\\.webp`));
  // Trước đây dòng này BẮT BUỘC phải có `onboarding__hotspot--primary` — tức
  // hợp đồng đang khoá chặt CHÍNH CẤU TRÚC HỎNG: nút rỗng ruột đè lên nút được
  // vẽ sẵn trong ảnh. Nay khoá điều ngược lại: nhãn nút là CHỮ THẬT trong HTML.
  assert.match(html, /<button[^>]*data-onboarding-next[^>]*>Bắt đầu<\/button>/);
  assert.match(html, /<button[^>]*id="finishOnboardingButton"[^>]*>Bắt đầu sử dụng<\/button>/);
  assert.doesNotMatch(html, /onboarding__hotspot/);
  assert.doesNotMatch(html, /class="visually-hidden" id="onboardingWelcomeTitle"/);
  assert.match(html, /id="reopenOnboardingButton"/);
  assert.match(app, /onboardingComplete:\s*"khoan-da:onboarding-complete"/);
  assert.match(app, /function renderOnboardingStep\(/);
  assert.match(app, /function completeOnboarding\(/);
  assert.match(app, /is-entering-\$\{direction\}/);
  assert.match(app, /const isFreshAppEntry = window\.location\.hash === ""/);
  assert.match(app, /isFreshAppEntry \|\| getStored\(STORAGE_KEYS\.onboardingComplete\) !== "1"/);
  assert.match(app, /getStored\(STORAGE_KEYS\.onboardingComplete\) !== "1"/);
  assert.match(styles, /@keyframes onboarding-enter-forward/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?is-entering-forward/);
  // The approved onboarding references once again fill the app viewport. The
  // controls remain real HTML buttons layered in safe, clickable regions.
  assert.match(refreshStyles, /Restore the original full-screen onboarding artwork/);
  assert.match(refreshStyles, /body\[data-onboarding="true"\] \.onboarding__art \{[\s\S]*?inset:\s*0;[\s\S]*?height:\s*100%/);
  assert.match(refreshStyles, /\[data-onboarding-step="2"\] \.onboarding__button--quiet[\s\S]*?right:\s*max\(0\.75rem, env\(safe-area-inset-right\)\)/);
  assert.match(refreshStyles, /body\[data-onboarding="true"\] \.onboarding__button--primary[\s\S]*?min-height:\s*4\.7rem/);
});

test("pressure mode matches the red 60-second safety reference", () => {
  assert.match(html, /class="pressure-hero"[\s\S]*?mascot-emergency\.webp[\s\S]*?id="pressureCountdown"/);
  assert.match(html, /class="button danger-dialog__call pressure-action-card pressure-only" href="#thoat-cuoc-goi"/);
  assert.match(html, /id="pressureCalmButton">Tôi đã bình tĩnh lại/);
  assert.match(refreshStyles, /Pressure mode: a focused red safety screen/);
  assert.match(refreshStyles, /danger-dialog\[data-mode="pressure"\][\s\S]*?#dc2626/);
  assert.match(app, /pressureCalmButton\.addEventListener\("click"[\s\S]*?stopDangerCountdown\(\)[\s\S]*?dangerDialog\.close\(\)/);
  assert.match(app, /window\.location\.hash = "#ho-tro"/);
});

test("official bank support directory contains verified call actions", () => {
  const banks = supportDirectory.filter((item) => item.kind === "official-bank");
  assert.equal(banks.length, 10);
  for (const bank of banks) {
    assert.match(bank.phone, /^1(?:800|900)\d{4,6}$/);
    assert.match(bank.website, /^https:\/\//);
    assert.equal(bank.updatedAt, "2026-07-27");
  }
  assert.match(app, /item\.displayPhone \|\| item\.phone/);
  assert.match(html, /Các số dưới đây được đối chiếu từ trang liên hệ chính thức/);
});

test("home prompt, expanded lessons and family profile match the current reference", () => {
  assert.match(html, /id="mobileSituationInput"[^>]*placeholder="Nhập tại đây\.\.\."/);
  for (const lessonId of ["fake-electricity", "fake-vneid", "fake-biometric", "fake-sim", "fake-teacher", "romance-investment"]) {
    assert.match(app, new RegExp(`id: "${lessonId}"`));
  }
  assert.match(html, /id="familyView"[\s\S]*?class="workspace-head family-profile-head"/);
  assert.match(html, /class="workspace-card family-contact-card"/);
  assert.match(html, /id="contactSubmitButton"[\s\S]*?Thêm người thân/);
  assert.match(html, /class="family-contact-mascot"[^>]*mascot-assistant\.webp/);
  assert.match(refreshStyles, /#familyView \.family-contact-card/);
  assert.match(refreshStyles, /#familyView \.family-contact-advanced[\s\S]*?display:\s*none !important/);
});

test("check hub exposes four real workflows without duplicating forms", () => {
  const hub = html.match(/<nav class="check-hub"[\s\S]*?<\/nav>/)?.[0] || "";
  for (const label of ["Cuộc gọi lạ", "Tin nhắn đáng ngờ", "Link hoặc mã QR", "Trước khi chuyển tiền"]) {
    assert.match(hub, new RegExp(label));
  }
  assert.match(app, /checkHubVoiceButton[\s\S]*?speechButton\.click\(\)/);
});

test("PWA shell is registered and never caches API responses", () => {
  assert.match(app, /navigator\.serviceWorker\.register\("\/sw\.js"\)/);
  assert.match(serviceWorker, /url\.pathname\.startsWith\("\/api\/"\)/);
  assert.match(serviceWorker, /caches\.match\("\/index\.html"\)/);
});

test("production build copies the static app and can serve it from dist", () => {
  const buildScript = fs.readFileSync(path.join(root, "scripts", "build.js"), "utf8");
  const server = fs.readFileSync(path.join(root, "server.js"), "utf8");
  assert.match(buildScript, /fs\.cpSync\(source, output/);
  assert.match(buildScript, /tokens\.css/);
  assert.match(server, /process\.env\.STATIC_DIR === "dist"/);
});
