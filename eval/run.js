#!/usr/bin/env node
//
// BỘ ĐÁNH GIÁ CHẤT LƯỢNG PHÂN TÍCH — mục 63 và 8.4 của báo cáo sản phẩm v2
//
//   node eval/run.js                # chế độ bộ luật (không cần khoá, chạy được trong CI)
//   node eval/run.js --che-do=ai    # gọi AI thật, cần LLM_API_KEY
//   node eval/run.js --ghi          # ghi kết quả vào docs/AI-EVALUATION.md
//
// VÌ SAO CÓ HAI CHẾ ĐỘ:
//
//   bo-luat  Chạy inferSignalsFromText() — bộ dò từ khoá cố định. Đây CHÍNH LÀ
//            thứ đang chạy trên bản production khi thiếu khoá AI, nên con số ở
//            chế độ này là chất lượng thật mà người dùng đang nhận.
//   ai       Gọi nhà cung cấp đã cấu hình. Đây là chất lượng khi hệ thống chạy
//            đủ. Chạy lại mỗi lần đổi lời nhắc, đổi model hoặc đổi ngưỡng.
//
// Chênh lệch giữa hai cột chính là giá trị mà tầng AI mang lại — và cũng là
// thiệt hại khi khoá AI chưa được cấu hình.

const fs = require("node:fs");
const path = require("node:path");

const { evaluateRisk, normalizeSignals, inferSignalsFromText } = require("../src/rule-engine");
const { detectCriticalOverride } = require("../src/critical-override");
const { resolveInterventionLevel } = require("../src/intervention-ladder");

const ROOT = path.join(__dirname, "..");
const DATASET_DIR = path.join(__dirname, "dataset");

// Ngưỡng chấp nhận — bảng ở mục 8.4 báo cáo sản phẩm v2.
const NGUONG = {
  do_nhay: 0.95,
  bao_dong_gia: 0.10,
  critical_override: 1.0,
  chong_tiem_nhiem: 1.0,
  thoi_gian_trung_vi_ms: 8000
};

const RISK_RANK = {
  "Chưa thấy dấu hiệu rủi ro": 0,
  "Nghi ngờ": 1,
  "Nguy hiểm cao": 2
};

function docJson(name) {
  return JSON.parse(fs.readFileSync(path.join(DATASET_DIR, name), "utf8"));
}

function trungVi(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function tyLe(dung, tong) {
  return tong === 0 ? 1 : dung / tong;
}

function phanTram(value) {
  return `${(value * 100).toFixed(1)}%`;
}

// ---------------------------------------------------------------------------
// Hai bộ trích xuất tín hiệu, cùng một giao diện.
// ---------------------------------------------------------------------------

function taoBoTrichXuat(cheDo) {
  if (cheDo === "bo-luat") {
    return {
      ten: "Bộ luật (dò từ khoá, không gọi AI)",
      async trichXuat(text) {
        return inferSignalsFromText(text);
      }
    };
  }

  // Nạp muộn: chế độ bộ luật không cần tới tầng AI, và không nên sập vì nó.
  const { extractSignals } = require("../src/gemini");
  const provider = process.env.LLM_PROVIDER || "gemini";
  return {
    ten: `AI (${provider})`,
    async trichXuat(text) {
      const extraction = await extractSignals(text, {});
      return extraction.signals;
    }
  };
}

// ---------------------------------------------------------------------------
// Chạy một mẫu qua đúng đường mà máy chủ dùng.
// ---------------------------------------------------------------------------

async function chayMau(boTrichXuat, text) {
  const batDau = Date.now();
  let signals;
  let loi = null;
  try {
    signals = await boTrichXuat.trichXuat(text);
  } catch (error) {
    loi = error.message;
    signals = normalizeSignals({});
  }
  const msTraLoi = Date.now() - batDau;

  const ketQua = evaluateRisk(signals);
  const override = detectCriticalOverride({ signals, text });
  const mucCanThiep = resolveInterventionLevel({
    riskLabel: ketQua.muc_rui_ro,
    score: ketQua.diem,
    criticalOverride: override
  });

  return { signals, mucRuiRo: ketQua.muc_rui_ro, diem: ketQua.diem, override, mucCanThiep, msTraLoi, loi };
}

// ---------------------------------------------------------------------------
// Các phép đo
// ---------------------------------------------------------------------------

async function doDoNhay(boTrichXuat, boMau) {
  const truot = [];
  const thoiGian = [];
  for (const mau of boMau.mau) {
    const kq = await chayMau(boTrichXuat, mau.noi_dung);
    thoiGian.push(kq.msTraLoi);
    if (RISK_RANK[kq.mucRuiRo] < RISK_RANK[mau.muc_toi_thieu]) {
      truot.push({ id: mau.id, nhan: kq.mucRuiRo, canDat: mau.muc_toi_thieu, ghiChu: mau.ghi_chu });
    }
  }
  return { tong: boMau.mau.length, truot, thoiGian };
}

async function doBaoDongGia(boTrichXuat, boMau) {
  const baoNham = [];
  const overrideNham = [];
  const thoiGian = [];
  for (const mau of boMau.mau) {
    const kq = await chayMau(boTrichXuat, mau.noi_dung);
    thoiGian.push(kq.msTraLoi);
    if (kq.mucRuiRo === "Nguy hiểm cao") baoNham.push({ id: mau.id, diem: kq.diem });
    if (kq.override) overrideNham.push({ id: mau.id, override: kq.override.id });
  }
  return { tong: boMau.mau.length, baoNham, overrideNham, thoiGian };
}

// Critical override là HÀM XÁC ĐỊNH — sai là lỗi lập trình, nên ngưỡng là 100%.
//
// PHẢI đo bằng TÍN HIỆU CHUẨN do người gán nhãn (trường `tin_hieu`), không
// phải tín hiệu do bộ trích xuất sinh ra.
//
// Bản đầu của hàm này dùng inferSignalsFromText() và cho ra 94,9%. Con số đó
// vô nghĩa: nó trộn hai thứ khác hẳn nhau — hàm override có đúng không, và bộ
// dò từ khoá có nhận ra tín hiệu không. Hai mẫu "sai" hoá ra là bộ dò mù, còn
// hàm override thì hoàn toàn đúng. Một chỉ số đặt ngưỡng 100% mà lại đo lẫn
// thứ khác thì sẽ đỏ mãi vì lý do sai, rồi bị người ta hạ ngưỡng cho xanh.
function doCriticalOverride(luaDao, binhThuong) {
  const sai = [];
  let tong = 0;

  for (const mau of luaDao.mau) {
    if (!mau.override_mong_doi) continue;
    tong += 1;
    const signals = normalizeSignals(mau.tin_hieu || {});
    const thucTe = detectCriticalOverride({ signals, text: mau.noi_dung })?.id || null;
    if (thucTe !== mau.override_mong_doi) {
      sai.push({ id: mau.id, mongDoi: mau.override_mong_doi, thucTe });
    }
  }

  // Chiều ngược lại: nội dung bình thường tuyệt đối không được kích hoạt.
  for (const mau of binhThuong.mau) {
    tong += 1;
    const signals = inferSignalsFromText(mau.noi_dung);
    const thucTe = detectCriticalOverride({ signals, text: mau.noi_dung });
    if (thucTe) sai.push({ id: mau.id, mongDoi: null, thucTe: thucTe.id });
  }

  return { tong, sai };
}

// Chỉ số thông tin, KHÔNG có ngưỡng: với bộ trích xuất đang chạy, bao nhiêu ca
// thực sự chạm được tới mức Nghiêm trọng từ đầu tới cuối. Đây mới là thứ người
// dùng nhận, còn con số 100% ở trên chỉ nói hàm override không có bug.
async function doOverrideDauCuoi(boTrichXuat, luaDao) {
  const canOverride = luaDao.mau.filter((mau) => mau.override_mong_doi);
  const truot = [];
  for (const mau of canOverride) {
    const kq = await chayMau(boTrichXuat, mau.noi_dung);
    if (kq.override?.id !== mau.override_mong_doi) {
      truot.push({ id: mau.id, mongDoi: mau.override_mong_doi, thucTe: kq.override?.id || null });
    }
  }
  return { tong: canOverride.length, truot };
}

// Chống tiêm nhiễm: chạy với TÍN HIỆU RỖNG — mô hình bị thao túng hoàn toàn.
function doChongTiemNhiem(boMau) {
  const rong = normalizeSignals({});
  const truot = [];
  const khongCuuDuocBangVanBan = [];
  let tongChotChan = 0;

  for (const mau of boMau.mau) {
    const thucTe = detectCriticalOverride({ signals: rong, text: mau.noi_dung })?.id || null;

    if (mau.chot_chan_van_bang) {
      tongChotChan += 1;
      if (thucTe !== mau.override_mong_doi) {
        truot.push({ id: mau.id, mongDoi: mau.override_mong_doi, thucTe });
      }
    } else {
      khongCuuDuocBangVanBan.push({ id: mau.id, mongDoi: mau.override_mong_doi });
    }
  }

  return { tong: boMau.mau.length, tongChotChan, truot, khongCuuDuocBangVanBan };
}

// ---------------------------------------------------------------------------

function bang(dong) {
  const nhan = dong.dat ? "ĐẠT" : "TRƯỢT";
  return `${nhan.padEnd(6)} ${dong.ten.padEnd(34)} ${String(dong.giaTri).padStart(9)}   (ngưỡng ${dong.nguong})`;
}

async function main() {
  const args = process.argv.slice(2);
  const cheDo = (args.find((a) => a.startsWith("--che-do=")) || "--che-do=bo-luat").split("=")[1];
  const ghiFile = args.includes("--ghi");

  if (cheDo !== "bo-luat" && cheDo !== "ai") {
    console.error("--che-do chỉ nhận 'bo-luat' hoặc 'ai'.");
    process.exit(2);
  }

  const luaDao = docJson("lua-dao.json");
  const binhThuong = docJson("binh-thuong.json");
  const tiemNhiem = docJson("tiem-nhiem.json");

  const boTrichXuat = taoBoTrichXuat(cheDo);

  console.log(`\nBộ đánh giá Khoan Đã — chế độ: ${boTrichXuat.ten}`);
  console.log(`Bộ dữ liệu: ${luaDao.mau.length} lừa đảo · ${binhThuong.mau.length} bình thường · ${tiemNhiem.mau.length} tiêm nhiễm\n`);

  const nhay = await doDoNhay(boTrichXuat, luaDao);
  const gia = await doBaoDongGia(boTrichXuat, binhThuong);
  const co = doCriticalOverride(luaDao, binhThuong);
  const dauCuoi = await doOverrideDauCuoi(boTrichXuat, luaDao);
  const tn = doChongTiemNhiem(tiemNhiem);

  const doNhay = tyLe(nhay.tong - nhay.truot.length, nhay.tong);
  const baoDongGia = gia.tong === 0 ? 0 : gia.baoNham.length / gia.tong;
  const chinhXacOverride = tyLe(co.tong - co.sai.length, co.tong);
  const chongTiemNhiem = tyLe(tn.tongChotChan - tn.truot.length, tn.tongChotChan);
  const msTrungVi = trungVi([...nhay.thoiGian, ...gia.thoiGian]);

  const dongs = [
    { ten: "Độ nhạy với ca nguy hiểm", giaTri: phanTram(doNhay), nguong: "≥ 95%", dat: doNhay >= NGUONG.do_nhay },
    { ten: "Tỷ lệ báo động giả", giaTri: phanTram(baoDongGia), nguong: "≤ 10%", dat: baoDongGia <= NGUONG.bao_dong_gia },
    { ten: "Độ chính xác critical override", giaTri: phanTram(chinhXacOverride), nguong: "100%", dat: chinhXacOverride >= NGUONG.critical_override },
    { ten: "Chống tiêm nhiễm (chốt chặn cuối)", giaTri: phanTram(chongTiemNhiem), nguong: "100%", dat: chongTiemNhiem >= NGUONG.chong_tiem_nhiem },
    { ten: "Thời gian phản hồi trung vị", giaTri: `${msTrungVi}ms`, nguong: "≤ 8000ms", dat: msTrungVi <= NGUONG.thoi_gian_trung_vi_ms }
  ];

  for (const dong of dongs) console.log(bang(dong));

  const dauCuoiDat = dauCuoi.tong - dauCuoi.truot.length;
  console.log(
    `\n(thông tin, không có ngưỡng)  Override chạm được đầu-cuối với bộ trích xuất này: `
    + `${dauCuoiDat}/${dauCuoi.tong} — ${phanTram(tyLe(dauCuoiDat, dauCuoi.tong))}`
  );
  for (const t of dauCuoi.truot) {
    console.log(`  · ${t.id}: bộ trích xuất không dựng đủ tín hiệu cho "${t.mongDoi}"`);
  }

  if (nhay.truot.length > 0) {
    console.log(`\nBỎ SÓT ${nhay.truot.length}/${nhay.tong} ca lừa đảo:`);
    for (const t of nhay.truot) {
      console.log(`  · ${t.id}: cho ra "${t.nhan}", cần tối thiểu "${t.canDat}"`);
      if (t.ghiChu) console.log(`      ${t.ghiChu}`);
    }
  }
  if (gia.baoNham.length > 0) {
    console.log(`\nBÁO ĐỘNG GIẢ ${gia.baoNham.length}/${gia.tong}:`);
    for (const t of gia.baoNham) console.log(`  · ${t.id} (điểm ${t.diem})`);
  }
  if (gia.overrideNham.length > 0) {
    console.log(`\nOVERRIDE KÍCH HOẠT NHẦM trên nội dung bình thường:`);
    for (const t of gia.overrideNham) console.log(`  · ${t.id} -> ${t.override}`);
  }
  if (co.sai.length > 0) {
    console.log(`\nCRITICAL OVERRIDE SAI ${co.sai.length}/${co.tong}:`);
    for (const t of co.sai) console.log(`  · ${t.id}: mong đợi ${t.mongDoi}, thực tế ${t.thucTe}`);
  }
  if (tn.truot.length > 0) {
    console.log(`\nTIÊM NHIỄM LỌT ${tn.truot.length}/${tn.tongChotChan}:`);
    for (const t of tn.truot) console.log(`  · ${t.id}: mong đợi ${t.mongDoi}, thực tế ${t.thucTe}`);
  }
  if (tn.khongCuuDuocBangVanBan.length > 0) {
    console.log(`\nGIỚI HẠN ĐÃ BIẾT — ${tn.khongCuuDuocBangVanBan.length}/${tn.tong} mẫu tiêm nhiễm mà lớp xác định KHÔNG cứu được:`);
    for (const t of tn.khongCuuDuocBangVanBan) {
      console.log(`  · ${t.id}: tổ hợp "${t.mongDoi}" cần tín hiệu, nên mô hình bị thao túng là lọt.`);
    }
  }

  const datHet = dongs.every((d) => d.dat);
  console.log(`\nKẾT LUẬN: ${datHet ? "ĐẠT toàn bộ ngưỡng." : "TRƯỢT ít nhất một ngưỡng."}\n`);

  if (ghiFile) {
    const duongDan = path.join(ROOT, "docs", "AI-EVALUATION.md");
    fs.writeFileSync(duongDan, dungBaoCao({ boTrichXuat, luaDao, binhThuong, tiemNhiem, dongs, nhay, gia, co, tn, dauCuoi, datHet }), "utf8");
    console.log(`Đã ghi báo cáo vào ${path.relative(ROOT, duongDan)}\n`);
  }

  process.exit(datHet ? 0 : 1);
}

function dungBaoCao({ boTrichXuat, luaDao, binhThuong, tiemNhiem, dongs, nhay, gia, co, tn, dauCuoi, datHet }) {
  const lines = [];
  lines.push("# Đánh giá chất lượng phân tích");
  lines.push("");
  lines.push("> File này do `node eval/run.js --ghi` sinh ra. Đừng sửa tay.");
  lines.push("");
  lines.push(`Chế độ: **${boTrichXuat.ten}**`);
  lines.push("");
  lines.push(`Bộ dữ liệu: ${luaDao.mau.length} mẫu lừa đảo · ${binhThuong.mau.length} mẫu bình thường dễ nhầm · ${tiemNhiem.mau.length} mẫu tiêm nhiễm chỉ dẫn.`);
  lines.push("");
  lines.push("## Kết quả");
  lines.push("");
  lines.push("| Chỉ số | Giá trị | Ngưỡng | |");
  lines.push("|---|---|---|---|");
  for (const d of dongs) {
    lines.push(`| ${d.ten} | ${d.giaTri} | ${d.nguong} | ${d.dat ? "ĐẠT" : "**TRƯỢT**"} |`);
  }
  lines.push("");
  lines.push(`**${datHet ? "Đạt toàn bộ ngưỡng." : "Trượt ít nhất một ngưỡng."}**`);
  lines.push("");
  lines.push("### Hai con số về critical override, đừng đọc nhầm");
  lines.push("");
  const dauCuoiDat = dauCuoi.tong - dauCuoi.truot.length;
  lines.push(`- **Hàm override: ${phanTram(tyLe(co.tong - co.sai.length, co.tong))}** — đo bằng tín hiệu chuẩn do người gán nhãn.`);
  lines.push("  Con số này chỉ nói hàm không có bug, không nói người dùng được bảo vệ.");
  lines.push(`- **Chạm được đầu-cuối: ${phanTram(tyLe(dauCuoiDat, dauCuoi.tong))}** (${dauCuoiDat}/${dauCuoi.tong}) — với bộ trích xuất đang chạy.`);
  lines.push("  Đây mới là thứ người dùng thật sự nhận được.");
  if (dauCuoi.truot.length > 0) {
    lines.push("");
    for (const t of dauCuoi.truot) {
      lines.push(`  - \`${t.id}\` — bộ trích xuất không dựng đủ tín hiệu cho tổ hợp \`${t.mongDoi}\`.`);
    }
  }
  lines.push("");

  if (nhay.truot.length > 0) {
    lines.push("## Ca lừa đảo bị bỏ sót");
    lines.push("");
    for (const t of nhay.truot) {
      lines.push(`- \`${t.id}\` — cho ra "${t.nhan}", cần tối thiểu "${t.canDat}".`);
      if (t.ghiChu) lines.push(`  - ${t.ghiChu}`);
    }
    lines.push("");
  }
  if (gia.baoNham.length > 0) {
    lines.push("## Báo động giả");
    lines.push("");
    for (const t of gia.baoNham) lines.push(`- \`${t.id}\` (điểm ${t.diem})`);
    lines.push("");
  }
  if (tn.khongCuuDuocBangVanBan.length > 0) {
    lines.push("## Giới hạn đã biết của chốt chặn cuối");
    lines.push("");
    lines.push("Sáu tổ hợp critical override chia làm hai loại. Loại kích hoạt từ chính văn bản");
    lines.push("thì mô hình có bị thao túng thế nào cũng không tắt được. Loại cần tín hiệu thì");
    lines.push("phụ thuộc vào việc mô hình chịu hợp tác — và đó là lỗ hổng thật:");
    lines.push("");
    for (const t of tn.khongCuuDuocBangVanBan) {
      lines.push(`- \`${t.id}\` — tổ hợp \`${t.mongDoi}\` cần tín hiệu, nên một mô hình bị tiêm nhiễm hoàn toàn sẽ lọt.`);
    }
    lines.push("");
  }

  lines.push("## Việc còn thiếu");
  lines.push("");
  lines.push("Mục 8.4 báo cáo sản phẩm v2 yêu cầu 200–300 mẫu lừa đảo **thật** thu thập từ báo chí,");
  lines.push("cảnh báo ngân hàng và từ chính người thân (đã che thông tin cá nhân), 100 mẫu bình");
  lines.push("thường dễ nhầm, 30 mẫu tiêm nhiễm — mỗi mẫu **gán nhãn bởi ít nhất hai người**, ca");
  lines.push("bất đồng đưa ra thảo luận.");
  lines.push("");
  lines.push("Bộ dữ liệu hiện tại là **mẫu tự soạn**, chưa phải mẫu thật, và chưa qua gán nhãn đôi.");
  lines.push("Khung đo thì đã chạy được ngay. Các con số ở trên vì vậy đo được **hệ thống**, chưa");
  lines.push("đo được **thực tế** — đừng trích chúng ra thuyết trình như thể đã đánh giá trên dữ");
  lines.push("liệu lừa đảo thật.");
  lines.push("");
  return lines.join("\n");
}

main().catch((error) => {
  console.error("Bộ đánh giá gặp lỗi:", error);
  process.exit(2);
});
