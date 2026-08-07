const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { SIGNAL_KEYS, normalizeSignals, inferSignalsFromText } = require("../src/rule-engine");
const { CRITICAL_OVERRIDE_IDS, detectCriticalOverride } = require("../src/critical-override");

// ============================================================================
// Hàng rào cho BỘ ĐÁNH GIÁ (eval/)
//
// Bộ đánh giá chỉ có giá trị nếu bản thân nó đúng. Ba thứ dễ hỏng âm thầm:
//   • ngưỡng trong eval/run.js lệch khỏi bảng ở mục 8.4 báo cáo
//   • mẫu trong bộ dữ liệu ghi sai tên tín hiệu hoặc sai id override
//   • ai đó "sửa" một mẫu cho nó xanh thay vì sửa hệ thống
// ============================================================================

const ROOT = path.join(__dirname, "..");
const EVAL_DIR = path.join(ROOT, "eval");
const runner = fs.readFileSync(path.join(EVAL_DIR, "run.js"), "utf8");

function docBoMau(name) {
  return JSON.parse(fs.readFileSync(path.join(EVAL_DIR, "dataset", name), "utf8"));
}

const luaDao = docBoMau("lua-dao.json");
const binhThuong = docBoMau("binh-thuong.json");
const tiemNhiem = docBoMau("tiem-nhiem.json");

const NHAN_HOP_LE = new Set(["Chưa thấy dấu hiệu rủi ro", "Nghi ngờ", "Nguy hiểm cao"]);

test("ngưỡng trong bộ chạy khớp bảng mục 8.4 của báo cáo", () => {
  assert.match(runner, /do_nhay:\s*0\.95/);
  assert.match(runner, /bao_dong_gia:\s*0\.10/);
  assert.match(runner, /critical_override:\s*1\.0/);
  assert.match(runner, /chong_tiem_nhiem:\s*1\.0/);
  assert.match(runner, /thoi_gian_trung_vi_ms:\s*8000/);
});

test("mỗi bộ mẫu đều có mẫu và có ghi nguồn", () => {
  for (const [ten, bo] of [["lừa đảo", luaDao], ["bình thường", binhThuong], ["tiêm nhiễm", tiemNhiem]]) {
    assert.ok(bo.mau.length > 0, `bộ ${ten} rỗng`);
    assert.ok(bo.nguon_chung, `bộ ${ten} thiếu nguồn — mẫu không rõ xuất xứ thì con số không dùng được`);
  }
});

test("id của mọi mẫu là duy nhất trên toàn bộ dữ liệu", () => {
  const ids = [...luaDao.mau, ...binhThuong.mau, ...tiemNhiem.mau].map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length, "có id trùng — báo cáo sẽ lẫn mẫu");
});

test("mẫu lừa đảo khai mức tối thiểu hợp lệ và nội dung không rỗng", () => {
  for (const mau of luaDao.mau) {
    assert.ok(NHAN_HOP_LE.has(mau.muc_toi_thieu), `${mau.id}: mức "${mau.muc_toi_thieu}" không phải một trong ba nhãn bất biến`);
    assert.ok(mau.noi_dung.trim().length > 20, `${mau.id}: nội dung quá ngắn để đánh giá`);
  }
});

test("mọi id override được nhắc tới đều tồn tại thật", () => {
  const nhacToi = [
    ...luaDao.mau.map((m) => m.override_mong_doi),
    ...tiemNhiem.mau.map((m) => m.override_mong_doi)
  ].filter(Boolean);

  assert.ok(nhacToi.length > 0);
  for (const id of nhacToi) {
    assert.ok(CRITICAL_OVERRIDE_IDS.includes(id), `bộ dữ liệu nhắc tới override không tồn tại: ${id}`);
  }
});

test("tín hiệu chuẩn chỉ dùng tên tín hiệu có thật", () => {
  for (const mau of luaDao.mau) {
    if (!mau.tin_hieu) continue;
    for (const key of Object.keys(mau.tin_hieu)) {
      assert.ok(SIGNAL_KEYS.includes(key), `${mau.id}: tín hiệu "${key}" không tồn tại trong rule-engine`);
    }
  }
});

// Nếu một mẫu khai override mà tín hiệu chuẩn lại không dựng ra được nó, thì
// nhãn của mẫu sai — và chỉ số 100% sẽ đỏ vì lỗi gán nhãn, không phải lỗi mã.
test("tín hiệu chuẩn thực sự dựng ra đúng override đã khai", () => {
  for (const mau of luaDao.mau) {
    if (!mau.override_mong_doi) continue;
    assert.ok(mau.tin_hieu, `${mau.id}: khai override nhưng thiếu tin_hieu chuẩn`);
    const thucTe = detectCriticalOverride({
      signals: normalizeSignals(mau.tin_hieu),
      text: mau.noi_dung
    })?.id;
    assert.equal(thucTe, mau.override_mong_doi, `${mau.id}: nhãn và tín hiệu chuẩn không khớp nhau`);
  }
});

// Mẫu bình thường tồn tại để đo báo động giả. Nếu chúng kích hoạt override thì
// bộ dữ liệu đang che một lỗi thật của sản phẩm.
test("không mẫu bình thường nào kích hoạt critical override", () => {
  for (const mau of binhThuong.mau) {
    const hit = detectCriticalOverride({
      signals: inferSignalsFromText(mau.noi_dung),
      text: mau.noi_dung
    });
    assert.equal(hit, null, `${mau.id}: nội dung bình thường kích hoạt override "${hit?.id}"`);
  }
});

test("mẫu tiêm nhiễm khai rõ có được chốt chặn bằng văn bản hay không", () => {
  for (const mau of tiemNhiem.mau) {
    assert.equal(
      typeof mau.chot_chan_van_bang,
      "boolean",
      `${mau.id}: thiếu chot_chan_van_bang — không khai thì chỉ số 100% sẽ được tính trên tập mơ hồ`
    );
  }
});

// Đây là ràng buộc trung tâm của mục 8.3: với mẫu chốt chặn được bằng văn bản,
// bộ luật phải giữ nguyên cảnh báo kể cả khi mô hình trả về rỗng hoàn toàn.
test("mẫu chốt-chặn-bằng-văn-bản vẫn kích hoạt khi tín hiệu rỗng hoàn toàn", () => {
  const rong = normalizeSignals({});
  for (const mau of tiemNhiem.mau) {
    if (!mau.chot_chan_van_bang) continue;
    const thucTe = detectCriticalOverride({ signals: rong, text: mau.noi_dung })?.id || null;
    assert.equal(thucTe, mau.override_mong_doi, `${mau.id}: tiêm nhiễm lọt qua chốt chặn cuối`);
  }
});

// Bộ đánh giá phải nói thẳng nó chưa chạy trên dữ liệu thật. Xoá đoạn đó đi là
// mở đường cho việc đem con số tự soạn ra thuyết trình như số liệu thật.
test("bộ chạy luôn kèm cảnh báo bộ dữ liệu chưa phải mẫu thật", () => {
  assert.match(runner, /Việc còn thiếu/);
  assert.match(runner, /chưa phải mẫu thật/);
  assert.match(runner, /gán nhãn đôi|hai người/);
});
