const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
const services = fs.readFileSync(path.join(root, "public", "services.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "public", "styles.css"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public", "manifest.webmanifest"), "utf8"));
const serviceWorker = fs.readFileSync(path.join(root, "public", "sw.js"), "utf8");

test("primary product surfaces use the Khoan Đã brand", () => {
  // "Khoan Đã" is the product name that leads the logo and page title; the
  // tagline under the logo is the reassurance line "Cùng bạn an toàn...".
  assert.match(html, /class="brand__title">Khoan Đã</);
  assert.equal(manifest.name, "Khoan Đã");
  assert.match(html, /name="description" content="Khoan Đã/);
  assert.match(html, /<title>Khoan đã/);
  assert.match(html, /class="brand__tagline">Cùng bạn an toàn/);
});

test("critical senior and emergency controls are present", () => {
  for (const id of [
    "voiceGuideToggle", "analysisDropzone", "cancelAnalysisButton",
    "pressureGuide", "postTransferView", "familyView", "privacyView",
    "supportView", "educationView"
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
  assert.match(html, /class="hero-accessible-copy"[^>]*>[\s\S]*?<h1 id="homeTitle">/);
  assert.match(html, /src="\/assets\/reassurance-reference\.webp"[^>]*loading="lazy"/);
});

test("file inputs and editable report summary have accessible names", () => {
  assert.match(html, /id="imageInput"[^>]*aria-label="Chọn ảnh hoặc PDF tình huống"/);
  assert.match(html, /id="linkCheckImageInput"[^>]*aria-label="Chọn ảnh mã QR"/);
  assert.match(html, /id="reportSummary"[^>]*aria-label="Bản tóm tắt báo cáo"/);
});

test("mobile home exposes the reference workflow without replacing desktop routes", () => {
  for (const className of [
    "mobile-reference-top", "mobile-situation-form", "mobile-action-grid",
    "mobile-trust-strip", "mobile-bottom-nav"
  ]) {
    assert.match(html, new RegExp(`class="[^"]*${className}`));
  }
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
  assert.match(html, /class="mobile-reference-top__scene"[^>]*mobile-home-top-reference\.webp/);
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
});

test("desktop and mobile taskbars share routes and render cross-browser icons", () => {
  const mobileNav = html.match(/<nav class="mobile-bottom-nav"[\s\S]*?<\/nav>/)?.[0] || "";
  for (const [hash, label, icon] of [
    ["#trang-chu", "Trang chủ", "icon-home"],
    ["#kiem-tra", "Kiểm tra", "icon-search"],
    ["#hanh-trinh", "Vụ việc", "icon-receipt"],
    ["#gia-dinh", "Hồ sơ", "icon-user"],
    ["#quyen-rieng-tu", "Cài đặt", "icon-settings"]
  ]) {
    assert.match(mobileNav, new RegExp(`href="${hash}"[\\s\\S]*?${icon}[\\s\\S]*?${label}`));
  }
  assert.doesNotMatch(mobileNav, /href="#lich-su"/);
  assert.match(html, /class="profile-menu__links"[\s\S]*?href="#lich-su"[\s\S]*?Lịch sử kiểm tra/);
  assert.match(styles, /-webkit-mask-image:\s*var\(--icon-source\)/);
  assert.match(styles, /@media \(min-width: 40\.0625rem\)[\s\S]*?grid-template-columns:\s*repeat\(4/);
  assert.match(styles, /\.mobile-bottom-nav[\s\S]*?border-radius:\s*var\(--radius-xl\)/);
});

test("onboarding is a functional four-step flow and can be reopened", () => {
  for (const step of [1, 2, 3, 4]) assert.match(html, new RegExp(`data-onboarding-step="${step}"`));
  assert.match(html, /data-onboarding-method="Cuộc gọi đáng ngờ"/);
  assert.match(html, /data-onboarding-branch="transferred"/);
  assert.match(html, /onboarding-welcome-scene.webp/);
  assert.match(html, /id="reopenOnboardingButton"/);
  assert.match(app, /onboardingComplete:\s*"khoan-da:onboarding-complete"/);
  assert.match(app, /function renderOnboardingStep\(/);
  assert.match(app, /function completeOnboarding\(/);
  assert.match(app, /is-entering-\$\{direction\}/);
  assert.match(app, /getStored\(STORAGE_KEYS\.onboardingComplete\) !== "1"/);
  assert.match(styles, /@keyframes onboarding-enter-forward/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?is-entering-forward/);
});

test("check hub exposes four real workflows without duplicating forms", () => {
  const hub = html.match(/<nav class="check-hub"[\s\S]*?<\/nav>/)?.[0] || "";
  for (const label of ["Tin nhắn hoặc hình ảnh", "Kể lại bằng giọng nói", "Link hoặc mã QR", "Trước khi chuyển tiền"]) {
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
