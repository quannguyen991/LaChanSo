const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const DOCS = path.join(__dirname, "..", "docs");

// Mục 64 báo cáo sản phẩm v2 liệt kê đúng sáu tài liệu phải tồn tại.
const BAT_BUOC = [
  "AI-EVALUATION.md",
  "MARKET-ANALYSIS.md",
  "GTM-PLAN.md",
  "BUSINESS-MODEL.md",
  "METRICS.md",
  "HONEST-BOUNDARIES.md"
];

function doc(name) {
  return fs.readFileSync(path.join(DOCS, name), "utf8");
}

test("đủ sáu tài liệu của mục 64, không file nào rỗng", () => {
  for (const name of BAT_BUOC) {
    const duongDan = path.join(DOCS, name);
    assert.ok(fs.existsSync(duongDan), `thiếu docs/${name}`);
    assert.ok(doc(name).trim().length > 500, `docs/${name} quá ngắn để dùng được`);
  }
});

// Bảng đối thủ trong MARKET-ANALYSIS là thông tin CHƯA kiểm chứng. Trích nó ra
// thuyết trình mà không kiểm lại là đúng cách phá huỷ uy tín nhanh nhất.
test("phân tích cạnh tranh luôn kèm cảnh báo phải kiểm chứng lại", () => {
  const text = doc("MARKET-ANALYSIS.md");
  assert.match(text, /kiểm chứng lại/);
  assert.match(text, /Không trích dẫn số liệu người dùng hoặc tính năng của đối thủ/);
});

// Đây là lý do tài liệu ranh giới trung thực tồn tại. Xoá bảng này đi là mở
// đường cho việc hứa những thứ web app không làm được.
test("ranh giới trung thực nói rõ những gì web app KHÔNG làm được", () => {
  const text = doc("HONEST-BOUNDARIES.md");
  for (const khong of [
    "Chặn cuộc gọi",
    "Chặn hoặc trì hoãn giao dịch ngân hàng",
    "Đọc tin nhắn SMS",
    "Chụp màn hình ứng dụng khác"
  ]) {
    assert.ok(text.includes(khong), `thiếu giới hạn "${khong}"`);
  }
  assert.match(text, /Không dùng nhãn "An toàn"/);
});

test("mô hình kinh doanh giữ nguyên cam kết luồng cứu người miễn phí", () => {
  const text = doc("BUSINESS-MODEL.md");
  assert.match(text, /miễn phí vĩnh viễn/);
  assert.match(text, /Không bao giờ dựng tường phí trước một người đang hoảng loạn/);
});

test("chỉ số nói rõ vì sao không dùng số người dùng hoạt động hằng ngày", () => {
  const text = doc("METRICS.md");
  assert.match(text, /không phải.{0,40}sản phẩm được mở mỗi ngày/s);
  assert.match(text, /Bắc Đẩu/);
});

// Mọi tài liệu nói về chất lượng AI đều phải nhắc rằng bộ dữ liệu chưa thật.
test("tài liệu không trình bày số liệu tự soạn như số liệu thật", () => {
  for (const name of ["AI-EVALUATION.md", "GTM-PLAN.md"]) {
    assert.match(
      doc(name),
      /mẫu tự soạn|chưa phải mẫu thật/,
      `docs/${name} thiếu cảnh báo về nguồn dữ liệu`
    );
  }
});
