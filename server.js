require("dotenv").config();

const path = require("node:path");
const express = require("express");
const { GeminiError, extractSignals, extractTransferSignals } = require("./src/gemini");
const { evaluateRisk, evaluateTransferRisk, SIGNAL_KEYS, applyRecoveryBoost } = require("./src/rule-engine");
const { classifyJourney, EVENT_TYPES } = require("./src/journey-engine");
const { LinkCheckError, evaluateLinkRisk, resolveRedirectChain } = require("./src/link-shield");
const { lookupReputation } = require("./src/reputation-engine");
const { validateBase64Media } = require("./src/media-validation");

const app = express();
const port = Number(process.env.PORT) || 3000;

// Behind a reverse proxy / Cloud Run, set TRUST_PROXY so request.ip is the real
// client (not the proxy's socket IP). Without it every client shares one
// rate-limit bucket and legitimate users get throttled together.
if (process.env.TRUST_PROXY) {
  const trustProxy = process.env.TRUST_PROXY;
  app.set("trust proxy", trustProxy === "true" ? true : (/^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy));
}

const rateBuckets = new Map();

app.disable("x-powered-by");
app.use(express.json({ limit: "8mb" }));
app.use((_request, response, next) => {
  response.setHeader("Content-Security-Policy", [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
    "form-action 'self'"
  ].join("; "));
  response.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "SAMEORIGIN");
  response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Permissions-Policy", "camera=(self), microphone=(self), geolocation=()");
  next();
});
app.use("/api", (request, response, next) => {
  const key = request.ip || "unknown";
  const now = Date.now();
  const bucket = rateBuckets.get(key) || { startedAt: now, count: 0 };
  if (now - bucket.startedAt > 60_000) {
    bucket.startedAt = now;
    bucket.count = 0;
  }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  if (rateBuckets.size > 5000) {
    for (const [storedKey, storedBucket] of rateBuckets) {
      if (now - storedBucket.startedAt > 60_000) rateBuckets.delete(storedKey);
    }
  }
  if (bucket.count > 90) return response.status(429).json({ error: "Bác thử lại sau một phút để hệ thống xử lý ổn định hơn." });
  next();
});
app.use(express.static(path.join(__dirname, "public")));
app.get("/tokens.css", (_request, response) => {
  response.sendFile(path.join(__dirname, "tokens.css"));
});
app.use("/fonts/lexend", express.static(path.join(__dirname, "node_modules", "@fontsource-variable", "lexend"), {
  immutable: true,
  maxAge: "7d"
}));
app.use("/fonts/nunito-sans", express.static(path.join(__dirname, "node_modules", "@fontsource-variable", "nunito-sans"), {
  immutable: true,
  maxAge: "7d"
}));
app.use("/vendor", express.static(path.join(__dirname, "node_modules", "jsqr", "dist"), {
  immutable: true,
  maxAge: "7d"
}));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/phan-tich", async (request, response, next) => {
  const text = typeof request.body?.van_ban === "string"
    ? request.body.van_ban.trim()
    : "";

  if (text.length > 5000) {
    return response.status(400).json({
      error: "Nội dung quá dài. Hãy rút gọn còn dưới 5.000 ký tự."
    });
  }

  let image;
  const rawMedia = request.body?.anh || request.body?.tep;
  if (rawMedia !== undefined && rawMedia !== null) {
    const validation = validateBase64Media(rawMedia);
    if (!validation.ok) return response.status(400).json({ error: validation.error });
    image = validation.media;
  }

  if (!text && !image) {
    return response.status(400).json({
      error: "Hãy nhập, nói hoặc tải ảnh tình huống cần kiểm tra."
    });
  }

  const recoveryModeActive = request.body?.che_do_phuc_hoi === true;

  try {
    const extraction = await extractSignals(text, { image });
    let result = evaluateRisk(extraction.signals);
    if (recoveryModeActive) {
      result = applyRecoveryBoost(result, text || extraction.noi_dung_da_doc || "");
    }
    return response.json({
      ...result,
      tin_hieu: extraction.signals,
      noi_dung_da_doc: extraction.noi_dung_da_doc || undefined,
      loi_dong_cam: extraction.loi_dong_cam || undefined
    });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/kiem-tra-chuyen-khoan", async (request, response, next) => {
  const fields = {
    ten_nguoi_lien_he: typeof request.body?.ten_nguoi_lien_he === "string" ? request.body.ten_nguoi_lien_he.trim() : "",
    ten_chu_tai_khoan: typeof request.body?.ten_chu_tai_khoan === "string" ? request.body.ten_chu_tai_khoan.trim() : "",
    so_tai_khoan: typeof request.body?.so_tai_khoan === "string" ? request.body.so_tai_khoan.trim() : "",
    so_tien: typeof request.body?.so_tien === "string" ? request.body.so_tien.trim() : "",
    ly_do: typeof request.body?.ly_do === "string" ? request.body.ly_do.trim() : "",
    noi_dung_tro_chuyen: typeof request.body?.noi_dung_tro_chuyen === "string" ? request.body.noi_dung_tro_chuyen.trim() : ""
  };

  const totalLength = Object.values(fields).join("").length;
  if (totalLength === 0) {
    return response.status(400).json({ error: "Hãy điền ít nhất một thông tin để kiểm tra." });
  }
  if (totalLength > 6000) {
    return response.status(400).json({ error: "Nội dung quá dài. Hãy rút gọn lại." });
  }

  const text = [
    fields.ten_nguoi_lien_he && `Người/tổ chức đang liên hệ và yêu cầu chuyển tiền tự xưng là: ${fields.ten_nguoi_lien_he}`,
    fields.ten_chu_tai_khoan && `Tên chủ tài khoản nhận tiền hiển thị khi tra cứu chuyển khoản: ${fields.ten_chu_tai_khoan}`,
    fields.so_tai_khoan && `Số tài khoản nhận tiền: ${fields.so_tai_khoan}`,
    fields.so_tien && `Số tiền được yêu cầu chuyển: ${fields.so_tien}`,
    fields.ly_do && `Lý do được đưa ra: ${fields.ly_do}`,
    fields.noi_dung_tro_chuyen && `Nội dung cuộc trò chuyện hoặc nội dung được yêu cầu ghi khi chuyển khoản: ${fields.noi_dung_tro_chuyen}`
  ].filter(Boolean).join("\n");

  try {
    const extraction = await extractTransferSignals(text);
    const result = evaluateTransferRisk(extraction.signals);
    return response.json({
      ...result,
      tin_hieu: extraction.signals
    });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/phan-tich-hanh-trinh", (request, response) => {
  const rawEvents = request.body?.su_kien;

  if (!Array.isArray(rawEvents) || rawEvents.length === 0) {
    return response.status(400).json({ error: "Cần ít nhất một diễn biến để phân tích hành trình." });
  }
  if (rawEvents.length > 20) {
    return response.status(400).json({ error: "Vụ việc có quá nhiều diễn biến. Tối đa 20." });
  }

  const events = [];
  for (const rawEvent of rawEvents) {
    const type = rawEvent?.loai;
    if (typeof type !== "string" || !EVENT_TYPES.includes(type)) {
      return response.status(400).json({ error: "Loại diễn biến không hợp lệ." });
    }

    let signals = null;
    const rawSignals = rawEvent?.tin_hieu;
    if (rawSignals && typeof rawSignals === "object" && !Array.isArray(rawSignals)) {
      signals = Object.fromEntries(
        SIGNAL_KEYS.map((key) => [key, rawSignals[key] === true])
      );
    }

    events.push({ type, signals });
  }

  const result = classifyJourney(events);
  return response.json(result);
});

app.post("/api/kiem-tra-lien-ket", async (request, response, next) => {
  const duongDan = typeof request.body?.duong_dan === "string" ? request.body.duong_dan.trim() : "";
  const thuongHieu = typeof request.body?.thuong_hieu_tu_xung === "string"
    ? request.body.thuong_hieu_tu_xung.trim()
    : "";

  if (!duongDan) {
    return response.status(400).json({ error: "Hãy nhập hoặc quét một đường link để kiểm tra." });
  }
  if (duongDan.length > 2000) {
    return response.status(400).json({ error: "Đường link quá dài." });
  }

  try {
    const chain = await resolveRedirectChain(duongDan);
    const result = evaluateLinkRisk({ redirectChain: chain, claimedBrand: thuongHieu });
    return response.json(result);
  } catch (error) {
    return next(error);
  }
});

app.post("/api/kiem-tra-uy-tin", (request, response) => {
  try {
    const result = lookupReputation({
      entityType: request.body?.loai,
      value: request.body?.gia_tri
    });
    return response.json(result);
  } catch (error) {
    return response.status(400).json({ error: error.message || "Chưa thể kiểm tra thông tin này." });
  }
});

app.use((error, _request, response, _next) => {
  if (error instanceof GeminiError) {
    return response.status(error.status).json({ error: error.message });
  }

  if (error instanceof LinkCheckError) {
    return response.status(error.status).json({ error: error.message });
  }

  if (error instanceof SyntaxError && error.status === 400) {
    return response.status(400).json({ error: "Dữ liệu gửi lên không hợp lệ." });
  }

  console.error("Lỗi máy chủ:", error.name || "UnknownError");
  return response.status(500).json({
    error: "Máy chủ gặp lỗi. Vui lòng thử lại sau."
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Khoan Đã đang chạy tại http://localhost:${port}`);
  });
}

module.exports = app;
