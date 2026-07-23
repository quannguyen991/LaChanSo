const test = require("node:test");
const assert = require("node:assert/strict");
const { STAGE_ORDER, classifyJourney } = require("../src/journey-engine");

test("no events yet classifies as lam_quen", () => {
  const result = classifyJourney([]);
  assert.equal(result.giai_doan, "lam_quen");
});

test("a single plain event stays at lam_quen", () => {
  const result = classifyJourney([{ type: "cuoc_goi_dau_tien", signals: null }]);
  assert.equal(result.giai_doan, "lam_quen");
});

test("two plain events without danger signals advance to tao_niem_tin", () => {
  const result = classifyJourney([
    { type: "cuoc_goi_dau_tien", signals: null },
    { type: "tin_nhan_tiep_theo", signals: { gia_danh_co_quan_nha_nuoc: false } }
  ]);
  assert.equal(result.giai_doan, "tao_niem_tin");
});

test("an urgency/fear signal advances to gay_so_hai", () => {
  const result = classifyJourney([
    { type: "cuoc_goi_dau_tien", signals: { ep_thoi_gian_khan_cap: true } }
  ]);
  assert.equal(result.giai_doan, "gay_so_hai");
});

test("a secrecy request advances to co_lap even without a boolean signal", () => {
  const result = classifyJourney([{ type: "yeu_cau_giu_bi_mat", signals: null }]);
  assert.equal(result.giai_doan, "co_lap");
});

test("a request to transfer money advances to yeu_cau_chuyen_tien", () => {
  const result = classifyJourney([{ type: "yeu_cau_chuyen_thu", signals: null }]);
  assert.equal(result.giai_doan, "yeu_cau_chuyen_tien");
});

test("the most advanced stage across all events wins regardless of order", () => {
  const result = classifyJourney([
    { type: "yeu_cau_chuyen_them", signals: null },
    { type: "cuoc_goi_dau_tien", signals: null }
  ]);
  assert.equal(result.giai_doan, "yeu_cau_chuyen_tien");
});

test("every stage produces a label, description, next-step guess and citation", () => {
  for (const stage of STAGE_ORDER) {
    assert.notEqual(stage, undefined);
  }
  for (const events of [
    [],
    [{ type: "cuoc_goi_dau_tien", signals: null }, { type: "tin_nhan_tiep_theo", signals: null }],
    [{ type: "cuoc_goi_dau_tien", signals: { ep_thoi_gian_khan_cap: true } }],
    [{ type: "yeu_cau_giu_bi_mat", signals: null }],
    [{ type: "yeu_cau_chuyen_them", signals: null }]
  ]) {
    const result = classifyJourney(events);
    assert.ok(STAGE_ORDER.includes(result.giai_doan));
    assert.ok(result.nhan_giai_doan.length > 0);
    assert.ok(result.mo_ta.length > 0);
    assert.ok(result.du_doan_buoc_tiep_theo.length > 0);
    assert.ok(result.trich_dan.length >= 1);
  }
});
