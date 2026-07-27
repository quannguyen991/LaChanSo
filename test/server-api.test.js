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

test("chat API returns assistant reply successfully", async () => {
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
  }
});

