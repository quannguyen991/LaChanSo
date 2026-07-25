const test = require("node:test");
const assert = require("node:assert/strict");
const { SIGNAL_KEYS } = require("../src/rule-engine");
const { extractSignals } = require("../src/gemini");

test("sends one structured-output request and normalizes the response", async () => {
  let calls = 0;
  let capturedRequest;
  const fetchImpl = async (_url, request) => {
    calls += 1;
    capturedRequest = request;
    return {
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                noi_dung_da_doc: "Tình huống giả",
                loi_dong_cam: "Bác vừa kể một tình huống dễ khiến ai cũng lo lắng.",
                ...Object.fromEntries(SIGNAL_KEYS.map((key) => [key, false])),
                gia_danh_co_quan_nha_nuoc: true
              })
            }]
          }
        }]
      })
    };
  };

  const result = await extractSignals("Tình huống giả", {
    apiKey: "fake-test-key",
    fetchImpl
  });

  assert.equal(calls, 1);
  assert.equal(result.signals.gia_danh_co_quan_nha_nuoc, true);
  assert.deepEqual(Object.keys(result.signals), SIGNAL_KEYS);
  assert.equal(result.noi_dung_da_doc, "Tình huống giả");
  assert.equal(result.loi_dong_cam, "Bác vừa kể một tình huống dễ khiến ai cũng lo lắng.");

  const body = JSON.parse(capturedRequest.body);
  assert.equal(body.generationConfig.responseMimeType, "application/json");
  assert.deepEqual(body.generationConfig.responseJsonSchema.required, ["noi_dung_da_doc", "loi_dong_cam", ...SIGNAL_KEYS]);
  assert.equal(capturedRequest.headers["x-goog-api-key"], "fake-test-key");
  assert.equal(capturedRequest.body.includes("fake-test-key"), false);
});

test("sends an inlineData image part when an image is provided", async () => {
  let capturedRequest;
  const fetchImpl = async (_url, request) => {
    capturedRequest = request;
    return {
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                noi_dung_da_doc: "Nội dung đọc từ ảnh",
                ...Object.fromEntries(SIGNAL_KEYS.map((key) => [key, false]))
              })
            }]
          }
        }]
      })
    };
  };

  const result = await extractSignals("", {
    apiKey: "fake-test-key",
    fetchImpl,
    image: { mimeType: "image/png", data: "ZmFrZS1pbWFnZS1ieXRlcw==" }
  });

  const body = JSON.parse(capturedRequest.body);
  const parts = body.contents[0].parts;
  assert.equal(parts.length, 1);
  assert.equal(parts[0].inlineData.mimeType, "image/png");
  assert.equal(parts[0].inlineData.data, "ZmFrZS1pbWFnZS1ieXRlcw==");
  assert.equal(result.noi_dung_da_doc, "Nội dung đọc từ ảnh");
});

test("caps loi_dong_cam length and falls back to empty string when missing or wrong type", async () => {
  const longSentence = "a".repeat(400);
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({
              noi_dung_da_doc: "Tình huống giả",
              loi_dong_cam: longSentence,
              ...Object.fromEntries(SIGNAL_KEYS.map((key) => [key, false]))
            })
          }]
        }
      }]
    })
  });

  const result = await extractSignals("Tình huống giả", { apiKey: "fake-test-key", fetchImpl });
  assert.equal(result.loi_dong_cam.length, 300);

  const missingFetchImpl = async () => ({
    ok: true,
    json: async () => ({
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({
              noi_dung_da_doc: "Tình huống giả",
              ...Object.fromEntries(SIGNAL_KEYS.map((key) => [key, false]))
            })
          }]
        }
      }]
    })
  });

  const resultMissing = await extractSignals("Tình huống giả", { apiKey: "fake-test-key", fetchImpl: missingFetchImpl });
  assert.equal(resultMissing.loi_dong_cam, "");
});

test("rejects when neither text nor image is provided", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    throw new Error("should not call the network");
  };

  await assert.rejects(
    () => extractSignals("", { apiKey: "fake-test-key", fetchImpl }),
    /văn bản hoặc ảnh/
  );
  assert.equal(calls, 0);
});

test("openai-compat provider builds a chat-completions request and parses fenced JSON", async () => {
  let capturedUrl;
  let capturedRequest;
  const fetchImpl = async (url, request) => {
    capturedUrl = url;
    capturedRequest = request;
    return {
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            // Claude often wraps JSON in a markdown fence — parser must tolerate it.
            content: "```json\n" + JSON.stringify({
              noi_dung_da_doc: "Công an gọi đòi chuyển tiền",
              loi_dong_cam: "Bác đang lo lắng là điều dễ hiểu.",
              ...Object.fromEntries(SIGNAL_KEYS.map((key) => [key, false])),
              gia_danh_co_quan_nha_nuoc: true
            }) + "\n```"
          }
        }]
      })
    };
  };

  const result = await extractSignals("Có người xưng công an bảo tôi chuyển tiền.", {
    provider: "openai",
    baseUrl: "https://vertex-key.com/api/v1",
    model: "aws/claude-haiku-4-5",
    apiKey: "vai-test-key",
    fetchImpl
  });

  assert.equal(capturedUrl, "https://vertex-key.com/api/v1/chat/completions");
  assert.equal(capturedRequest.headers.Authorization, "Bearer vai-test-key");
  const body = JSON.parse(capturedRequest.body);
  assert.equal(body.model, "aws/claude-haiku-4-5");
  assert.equal(body.messages[0].role, "system");
  assert.equal(body.messages[1].role, "user");
  assert.equal(result.signals.gia_danh_co_quan_nha_nuoc, true);
  assert.deepEqual(Object.keys(result.signals), SIGNAL_KEYS);
});

test("openai-compat provider sends an image as an image_url data URI", async () => {
  let capturedRequest;
  const fetchImpl = async (_url, request) => {
    capturedRequest = request;
    return {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({
          noi_dung_da_doc: "", loi_dong_cam: "",
          ...Object.fromEntries(SIGNAL_KEYS.map((key) => [key, false]))
        }) } }]
      })
    };
  };

  await extractSignals("", {
    provider: "openai",
    baseUrl: "https://vertex-key.com/api/v1",
    model: "aws/claude-haiku-4-5",
    apiKey: "vai-test-key",
    fetchImpl,
    image: { mimeType: "image/png", data: "aGVsbG8=" }
  });

  const body = JSON.parse(capturedRequest.body);
  const imagePart = body.messages[1].content.find((c) => c.type === "image_url");
  assert.ok(imagePart, "expected an image_url content part");
  assert.equal(imagePart.image_url.url, "data:image/png;base64,aGVsbG8=");
});
