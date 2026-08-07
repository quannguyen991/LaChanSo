const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const appJs = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
const ladderCss = fs.readFileSync(path.join(root, "public", "intervention-ladder.css"), "utf8");
// Quét khai báo thì phải bỏ comment trước. Bản đầu của test này đỏ vì bắt đúng
// dòng comment "KHÔNG dùng white-space: nowrap" — tức nó bắt lời văn, không
// bắt CSS thật.
const ladderRules = ladderCss.replace(/\/\*[\s\S]*?\*\//g, "");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public", "manifest.webmanifest"), "utf8"));

// Cắt đúng một <section>, có đếm lồng nhau.
//
// Bản đầu dùng indexOf("</section>") nên cắt cụt ở thẻ đóng ĐẦU TIÊN. Màn hình
// bảo vệ có một <section class="protect-donts"> lồng bên trong, nên nửa dưới —
// gồm cả nút gọi và lối thoát — bị mất khỏi vùng kiểm. Test xanh giả kiểu đó
// còn tệ hơn không có test.
function section(id) {
  const idAt = html.indexOf(`id="${id}"`);
  assert.ok(idAt > 0, `không tìm thấy #${id} trong index.html`);
  const from = html.lastIndexOf("<section", idAt);

  let depth = 0;
  const tagRe = /<(\/?)section\b/g;
  tagRe.lastIndex = from;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(from, tagRe.lastIndex);
  }
  throw new Error(`thẻ <section> của #${id} không đóng`);
}

// ---------------------------------------------------------------------------
// MÀN HÌNH MỘT CÂU HỎI (mục 57)
// ---------------------------------------------------------------------------

test("biểu tượng ứng dụng mở màn hình một câu hỏi, không mở trang chủ", () => {
  assert.equal(manifest.start_url, "/#khan-cap");
});

test("manifest khai báo shortcut cho cả bốn luồng", () => {
  const urls = (manifest.shortcuts || []).map((s) => s.url);
  assert.deepEqual(urls, ["/#thoat-cuoc-goi", "/#kiem-tra", "/#chuyen-khoan", "/#vua-chuyen-tien"]);
});

test("màn hình một câu hỏi có đúng một câu hỏi, bốn nút và một lối ra", () => {
  const view = section("khanCapView");
  assert.match(view, /Bác đang được yêu cầu làm gì\?/);

  // Chỉ đếm nút, không đếm phần tử con (__icon, __label) cũng bắt đầu bằng
  // cùng tiền tố.
  const choices = view.match(/class="emergency-choice(?![_a-z])[^"]*"/g) || [];
  assert.equal(choices.length, 4, `có ${choices.length} nút, phải là 4`);

  // Nút thứ tư khác màu và tách khỏi ba nút trên.
  assert.match(view, /emergency-entry__choices--separated/);
  assert.match(view, /emergency-choice--alarm[\s\S]*?Tôi đã chuyển tiền rồi/);

  // Không có dòng này thì mọi lần mở ứng dụng đều bị hỏi câu hỏi khẩn cấp.
  assert.match(view, /href="#trang-chu"[\s\S]*?Tôi chỉ muốn xem hướng dẫn/);
});

// Báo cáo 6.1: "Không dùng emoji làm biểu tượng — dùng bộ icon của thư viện.
// Không có linh vật ở màn hình này."
test("màn hình một câu hỏi không có linh vật và không dùng emoji làm icon", () => {
  const view = section("khanCapView");
  assert.doesNotMatch(view, /<img/, "màn hình khẩn cấp không được có ảnh linh vật");
  assert.doesNotMatch(
    view,
    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
    "không dùng emoji làm biểu tượng"
  );
});

// ---------------------------------------------------------------------------
// BÁC ĐANG ĐƯỢC BẢO VỆ (mục 56 / 5.5)
// ---------------------------------------------------------------------------

test("màn hình bảo vệ tách rõ ĐỪNG LÀM khỏi việc phải làm", () => {
  const view = section("duocBaoVeView");
  assert.match(view, /Đừng làm 3 điều này/i);

  const donts = view.match(/<li>[\s\S]*?<\/li>/g) || [];
  assert.equal(donts.length, 3, `khối "đừng làm" có ${donts.length} mục, phải là 3`);

  // Chữ tĩnh, không phải nút, không phải checkbox. Checkbox tạo cảm giác phải
  // hoàn thành nhiệm vụ — gánh nặng thừa với người đang run tay.
  for (const item of donts) {
    assert.doesNotMatch(item, /<button|<input|<a\b/, `mục "đừng làm" không được bấm được: ${item}`);
  }
  assert.doesNotMatch(view, /type="checkbox"/);
});

test("màn hình bảo vệ luôn có lối thoát, và lối thoát ghi lại sự kiện", () => {
  const view = section("duocBaoVeView");
  assert.match(view, /Tôi ổn, không có gì nguy hiểm/);
  // Mỗi lần bấm là một mẫu dữ liệu báo động giả để hiệu chỉnh ngưỡng (4.2).
  assert.match(appJs, /function exitProtectScreen[\s\S]{0,400}logFalseAlarm\(\)/);
  assert.match(appJs, /falseAlarmLog:\s*"khoan-da:false-alarm-log"/);
});

test("nút gọi hiển thị tên thật và quan hệ thật, không phải 'Gọi người thân' chung chung", () => {
  assert.match(appJs, /nameEl\.textContent\s*=\s*`Gọi \$\{contact\.name\}`/);
  assert.match(appJs, /roleEl\.textContent\s*=\s*contact\.role/);
});

test("có chuyển tiếp người dự phòng sau 20 giây", () => {
  assert.match(appJs, /PROTECT_BACKUP_DELAY_MS\s*=\s*20_000/);
  assert.match(appJs, /Chưa gọi được \$\{primaryName\}\. Gọi \$\{protectBackupTarget\.name\}\?/);
});

// Báo cáo 5.5: "Không có linh vật, không đếm ngược, không phủ đỏ toàn màn hình."
test("màn hình bảo vệ không có linh vật và không có đếm ngược riêng", () => {
  const view = section("duocBaoVeView");
  assert.doesNotMatch(view, /<img/);
  assert.doesNotMatch(view, /countdown|đếm ngược/i);
});

// ---------------------------------------------------------------------------
// BỎ ĐIỀU HƯỚNG
//
// Đây là hàng rào cho lỗi đã ĐO ĐƯỢC trên trình duyệt: bản đầu dùng
// `html[data-route=...]` (0,2,1) và thua `html:not([data-authenticated="true"])
// body .topbar` (0,2,2) trong khoan-da-2026.css, nên thanh topbar vẫn hiện
// nguyên trên màn hình lẽ ra bỏ hết điều hướng — dù đã có !important.
// ---------------------------------------------------------------------------

test("hai màn hình khẩn cấp ẩn toàn bộ điều hướng, với đủ độ đặc hiệu để thắng", () => {
  const block = ladderRules.match(/:root\[data-route="khan-cap"\][\s\S]*?\{\s*display:\s*none\s*!important;?\s*\}/);
  assert.ok(block, "không tìm thấy khối ẩn điều hướng");

  const rule = block[0];
  for (const route of ["khan-cap", "duoc-bao-ve"]) {
    for (const chrome of [".topbar", ".mobile-bottom-nav", ".bottom-nav", ".chat-widget"]) {
      assert.ok(
        rule.includes(`:root[data-route="${route}"] body ${chrome}`),
        `thiếu quy tắc ẩn ${chrome} trên route ${route}`
      );
    }
  }

  // `html[...]` thay cho `:root[...]` là tụt một bậc đặc hiệu và thua ngay.
  assert.doesNotMatch(
    rule,
    /html\[data-route/,
    'phải dùng :root[data-route=...] chứ không phải html[data-route=...] — html là type-selector, đặc hiệu thấp hơn và thua rule trong khoan-da-2026.css'
  );
});

// ---------------------------------------------------------------------------
// PHIẾU TIN CẬY (mục 62)
// ---------------------------------------------------------------------------

test("phiếu tin cậy có đủ bốn khối bắt buộc", () => {
  const view = section("trustReceiptSection");
  assert.match(view, /Đã phát hiện/);
  assert.match(view, /Chưa xác minh được/);
  assert.match(view, /Cách kết luận/);
  assert.match(view, /Nên làm ngay/);
  assert.match(view, /Gửi cho người thân/);
});

// Khối "Chưa xác minh được" là thứ xây niềm tin. Ẩn nó khi rủi ro thấp là bỏ
// mất đúng điểm mạnh của tính năng.
test('khối "Chưa xác minh được" không có đường nào để bị ẩn', () => {
  assert.doesNotMatch(appJs, /trustReceiptUnverified\w*\.hidden\s*=/);
  const view = section("trustReceiptSection");
  const unverifiedBlock = view.match(/<div class="trust-receipt__block trust-receipt__block--unverified">/);
  assert.ok(unverifiedBlock, "không tìm thấy khối chưa xác minh được");
  assert.doesNotMatch(
    view.slice(view.indexOf("trust-receipt__block--unverified")),
    /^[\s\S]{0,200}hidden/,
    "khối chưa xác minh được không được mang thuộc tính hidden"
  );
});

// ---------------------------------------------------------------------------
// SÀN TIẾP CẬN CỦA MÀN HÌNH KHẨN CẤP
// ---------------------------------------------------------------------------

test("nút khẩn cấp kẹp bằng max(px, rem) chứ không phải rem trần", () => {
  // rem trần tụt xuống dưới sàn ở bậc chữ A (gốc 15px) mà quét tĩnh không thấy.
  for (const selector of ["emergency-choice", "protect-call"]) {
    // Chỉ xét khối CÓ khai báo min-block-size. Các khối khác của cùng bộ chọn
    // (ví dụ `.emergency-choice{transition:none}` trong prefers-reduced-motion)
    // không nói gì về chiều cao.
    const blocks = (ladderRules.match(new RegExp(`\\.${selector}\\s*\\{[^}]*\\}`, "g")) || [])
      .map((block) => block.match(/min-block-size:\s*([^;]+);/))
      .filter(Boolean);

    assert.equal(blocks.length, 1, `.${selector} phải khai báo min-block-size đúng một lần`);
    assert.match(
      blocks[0][1],
      /max\(\s*88px/,
      `.${selector} đặt "${blocks[0][1].trim()}"; phải kẹp bằng max(88px, …) — `
        + "báo cáo 6.1 đặt sàn 88px, và rem trần tụt xuống 82,5px ở bậc chữ A"
    );
  }
});

test("không nút nào trong màn hình khẩn cấp dùng white-space: nowrap", () => {
  // Nhãn tiếng Việt dài hơn tiếng Anh ~30%; ở bậc A++ nút bị cắt chữ.
  assert.doesNotMatch(ladderRules, /white-space:\s*nowrap/);
});
