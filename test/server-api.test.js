const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../server");

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("health response includes security headers", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-security-policy"), /default-src 'self'/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("support directory has a version, review date and no invented contact data", async () => {
  const response = await fetch(`${baseUrl}/api/danh-ba-ho-tro`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.match(payload.version, /^\d{4}\.\d{2}\.\d{2}$/);
  assert.match(payload.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(Array.isArray(payload.items));
  assert.ok(payload.items.every((item) => item.name && item.source));
});

test("reputation API never invents reports for an unknown phone", async () => {
  const response = await fetch(`${baseUrl}/api/kiem-tra-uy-tin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loai: "phone", gia_tri: "0901234567" })
  });
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.reportCount, null);
  assert.equal(payload.isDemoData, false);
});

test("analysis API rejects spoofed file MIME before calling AI", async () => {
  const response = await fetch(`${baseUrl}/api/phan-tich`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tep: { mimeType: "image/png", data: Buffer.from("%PDF-1.7").toString("base64") }
    })
  });
  const payload = await response.json();
  assert.equal(response.status, 400);
  assert.match(payload.error, /không khớp/);
});

test("chat API returns 400 when message is empty", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tin_nhan: "" })
  });
  const payload = await response.json();
  assert.equal(response.status, 400);
  assert.match(payload.error, /nhập tin nhắn/);
});

test("chat API returns 400 when message is too long", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tin_nhan: "a".repeat(1001) })
  });
  const payload = await response.json();
  assert.equal(response.status, 400);
  assert.match(payload.error, /quá dài/);
});

test("analysis API returns deterministic guidance when the AI provider is unavailable", async () => {
  const originalProvider = process.env.LLM_PROVIDER;
  const originalLlmKey = process.env.LLM_API_KEY;
  const originalGeminiKey = process.env.GEMINI_API_KEY;
  process.env.LLM_PROVIDER = "gemini";
  delete process.env.LLM_API_KEY;
  delete process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`${baseUrl}/api/phan-tich`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        van_ban: "Con gái tôi bên nước ngoài bảo chuyển khoản ngay cho tài khoản lạ."
      })
    });
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.che_do_du_phong, true);
    assert.ok(payload.hanh_dong.length >= 1);
    assert.notEqual(payload.muc_rui_ro, "Chưa thấy dấu hiệu rủi ro");
    assert.equal(payload.structuredResult.requiresEmergencyFlow, true);
    assert.ok(["medium", "high", "critical"].includes(payload.structuredResult.riskLevel));
    assert.ok(payload.structuredResult.predictedNextSteps.length <= 3);
    assert.doesNotMatch(JSON.stringify(payload), /Gemini/i);
  } finally {
    if (originalProvider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = originalProvider;
    if (originalLlmKey === undefined) delete process.env.LLM_API_KEY;
    else process.env.LLM_API_KEY = originalLlmKey;
    if (originalGeminiKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalGeminiKey;
  }
});

test("chat API always returns useful guidance when the AI provider is unavailable", async () => {
  const originalProvider = process.env.LLM_PROVIDER;
  const originalLlmKey = process.env.LLM_API_KEY;
  const originalGeminiKey = process.env.GEMINI_API_KEY;
  process.env.LLM_PROVIDER = "gemini";
  delete process.env.LLM_API_KEY;
  delete process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tin_nhan: "Có người hỏi mã OTP của tôi." })
    });
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.che_do_du_phong, true);
    assert.match(payload.tra_loi, /dừng lại|không cung cấp/i);
    assert.doesNotMatch(payload.tra_loi, /Gemini/i);
  } finally {
    if (originalProvider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = originalProvider;
    if (originalLlmKey === undefined) delete process.env.LLM_API_KEY;
    else process.env.LLM_API_KEY = originalLlmKey;
    if (originalGeminiKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalGeminiKey;
  }
});

// Thang can thiệp và Phiếu tin cậy phải có mặt trên MỌI đường trả kết quả.
// Thiếu `mucCanThiep` nghĩa là giao diện không biết dựng màn hình nào — và
// đường dễ quên nhất chính là đường dự phòng khi AI hỏng.
async function analyzeWithoutAi(body) {
  const saved = {
    provider: process.env.LLM_PROVIDER,
    llmKey: process.env.LLM_API_KEY,
    geminiKey: process.env.GEMINI_API_KEY
  };
  process.env.LLM_PROVIDER = "gemini";
  delete process.env.LLM_API_KEY;
  delete process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`${baseUrl}/api/phan-tich`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return { response, payload: await response.json() };
  } finally {
    if (saved.provider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = saved.provider;
    if (saved.llmKey === undefined) delete process.env.LLM_API_KEY;
    else process.env.LLM_API_KEY = saved.llmKey;
    if (saved.geminiKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = saved.geminiKey;
  }
}

test("đường dự phòng vẫn trả về thang can thiệp và Phiếu tin cậy", async () => {
  const { response, payload } = await analyzeWithoutAi({
    van_ban: "Tin nhắn nhắc lịch khám bệnh thứ Năm tuần sau."
  });

  assert.equal(response.status, 200);
  assert.equal(payload.che_do_du_phong, true);
  assert.ok(payload.mucCanThiep, "thiếu mucCanThiep trên đường dự phòng");
  assert.ok(payload.phieuTinCay, "thiếu phieuTinCay trên đường dự phòng");
  // Mọi lần phân tích đều tạo phiếu, kể cả khi rủi ro thấp.
  assert.ok(payload.phieuTinCay.chuaXacMinhDuoc.length > 0);
  assert.equal(payload.phieuTinCay.cachKetLuan.aiDaChay, false);
});

test("critical override đẩy lên mức Nghiêm trọng dù bộ luật không thấy tín hiệu nào", async () => {
  const { payload } = await analyzeWithoutAi({
    van_ban: "Bên tôi là cơ quan điều tra. Chị chuyển toàn bộ tiền sang tài khoản an toàn để xác minh, "
      + "và tuyệt đối không nói với ai."
  });

  assert.equal(payload.mucCanThiep.level, "duoc_bao_ve");
  assert.equal(payload.mucCanThiep.boDieuHuong, true);
  assert.equal(payload.mucCanThiep.route, "#duoc-bao-ve");
  assert.equal(payload.mucCanThiep.criticalOverride.id, "tai_khoan_an_toan");
});

test("nội dung nguy hiểm cao nhưng không khớp override chỉ tới Dừng 60 giây", async () => {
  const { payload } = await analyzeWithoutAi({
    van_ban: "Công an bảo tôi phải chuyển khoản ngay hôm nay nếu không sẽ bị bắt giam."
  });

  assert.equal(payload.muc_rui_ro, "Nguy hiểm cao");
  assert.equal(payload.mucCanThiep.level, "dung_60_giay");
  assert.equal(payload.mucCanThiep.boDieuHuong, false);
});

test("cờ đã chuyển tiền đưa thẳng sang luồng phục hồi", async () => {
  const { payload } = await analyzeWithoutAi({
    van_ban: "Tôi vừa chuyển 45 triệu theo hướng dẫn của họ.",
    da_chuyen_tien: true
  });

  assert.equal(payload.mucCanThiep.level, "phuc_hoi");
  assert.equal(payload.mucCanThiep.route, "#vua-chuyen-tien");
});

test("chế độ bảo vệ 72 giờ KHÔNG hạ mức can thiệp của một tin nhắn nguy hiểm mới", async () => {
  const { payload } = await analyzeWithoutAi({
    van_ban: "Họ bảo tôi cài ứng dụng dịch vụ công từ link này để nhận lại tiền.",
    che_do_phuc_hoi: true
  });

  // Chế độ 72 giờ đang bật, nhưng người dùng chưa khai vừa chuyển tiền lần này
  // -> vẫn phải là màn hình bảo vệ, không phải luồng phục hồi.
  assert.equal(payload.mucCanThiep.level, "duoc_bao_ve");
});

test("phiếu trả về từ API không bao giờ mang mã OTP hay số tài khoản đầy đủ", async () => {
  const { payload } = await analyzeWithoutAi({
    van_ban: "Họ xin mã OTP là 847213 và bảo chuyển vào số tài khoản 19036688123456 ngay lập tức."
  });

  const serialized = JSON.stringify(payload.phieuTinCay);
  assert.ok(!serialized.includes("847213"), "phiếu rò rỉ mã OTP");
  assert.ok(!serialized.includes("19036688123456"), "phiếu rò rỉ số tài khoản đầy đủ");
});

test("chat API returns assistant reply successfully", async () => {
  // callGemini() ném GeminiError(..., 503) NGAY khi thiếu khoá, tức trước cả
  // lần gọi fetch đầu tiên — nên mock fetch bên dưới không bao giờ được chạm
  // tới và test trả 503. CI cũng không có khoá, nên test này đỏ ở mọi nơi.
  // Đặt khoá giả để đi hết đường dẫn tới fetch, rồi mock chặn ở đó.
  const originalKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = "test-key-not-a-real-secret";

  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    if (url.includes("generateContent") || url.includes("chat/completions")) {
      return {
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{
                text: JSON.stringify({
                  tra_loi: "Chào bác, cháu là trợ lý Khoan Đã!"
                })
              }]
            }
          }]
        })
      };
    }
    return originalFetch(url, options);
  };

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tin_nhan: "Chào cháu" })
    });
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.tra_loi, "Chào bác, cháu là trợ lý Khoan Đã!");
  } finally {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  }
});

