const test = require("node:test");
const assert = require("node:assert/strict");
const { SIGNAL_KEYS } = require("../src/rule-engine");
const { extractSignals, extractTransferSignals, extractChatResponse } = require("../src/gemini");

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

const okSignals = () => JSON.stringify({
  noi_dung_da_doc: "Công an gọi đòi chuyển tiền",
  loi_dong_cam: "Bác đang lo lắng là điều dễ hiểu.",
  ...Object.fromEntries(SIGNAL_KEYS.map((key) => [key, false])),
  gia_danh_co_quan_nha_nuoc: true
});

const openaiOpts = (fetchImpl) => ({
  provider: "openai",
  baseUrl: "https://vertex-key.com/api/v1",
  model: "aws/claude-haiku-4-5",
  apiKey: "vai-test-key",
  fetchImpl
});

test("openai-compat retries once when the model answers with prose instead of JSON", async () => {
  // Seen in production: the gateway does not actually enforce response_format,
  // so the model can reply "I can't discuss that..." and the parse fails.
  const bodies = [];
  let calls = 0;
  const fetchImpl = async (_url, request) => {
    calls += 1;
    bodies.push(JSON.parse(request.body));
    const content = calls === 1 ? "I can't discuss that. What are you working on?" : okSignals();
    return { ok: true, json: async () => ({ choices: [{ message: { content } }] }) };
  };

  const result = await extractSignals("Công an gọi đòi chuyển tiền.", openaiOpts(fetchImpl));

  assert.equal(calls, 2, "should retry exactly once");
  assert.equal(result.signals.gia_danh_co_quan_nha_nuoc, true);
  assert.equal(bodies[0].messages.length, 2, "first attempt sends system + user only");
  assert.equal(bodies[1].messages.length, 3, "retry appends a JSON-only reminder");
  assert.match(bodies[1].messages[2].content, /Chỉ trả về đúng một đối tượng JSON/);
});

test("openai-compat retries a 5xx but not a 4xx", async () => {
  let serverErrorCalls = 0;
  const flaky = async () => {
    serverErrorCalls += 1;
    if (serverErrorCalls === 1) return { ok: false, status: 502, json: async () => ({}) };
    return { ok: true, json: async () => ({ choices: [{ message: { content: okSignals() } }] }) };
  };
  const recovered = await extractSignals("Tình huống", openaiOpts(flaky));
  assert.equal(serverErrorCalls, 2);
  assert.equal(recovered.signals.gia_danh_co_quan_nha_nuoc, true);

  // A 401 is a configuration problem; retrying just burns another request.
  let badKeyCalls = 0;
  const badKey = async () => {
    badKeyCalls += 1;
    return { ok: false, status: 401, json: async () => ({}) };
  };
  await assert.rejects(() => extractSignals("Tình huống", openaiOpts(badKey)));
  assert.equal(badKeyCalls, 1, "must not retry a 4xx");
});

test("the native Gemini path gets the same one-retry resilience", async () => {
  const geminiReply = (text) => ({
    ok: true,
    json: async () => ({ candidates: [{ content: { parts: [{ text }] } }] })
  });

  // A 5xx recovers on the retry.
  let calls = 0;
  const flaky = async () => {
    calls += 1;
    if (calls === 1) return { ok: false, status: 503, json: async () => ({}) };
    return geminiReply(okSignals());
  };
  const recovered = await extractSignals("Tình huống", { apiKey: "fake-test-key", fetchImpl: flaky });
  assert.equal(calls, 2);
  assert.equal(recovered.signals.gia_danh_co_quan_nha_nuoc, true);

  // A fenced reply now parses instead of failing, matching the openai path.
  const fenced = async () => geminiReply("```json\n" + okSignals() + "\n```");
  const parsed = await extractSignals("Tình huống", { apiKey: "fake-test-key", fetchImpl: fenced });
  assert.equal(parsed.signals.gia_danh_co_quan_nha_nuoc, true);

  // A 400 is a request problem: fail immediately.
  let badCalls = 0;
  const bad = async () => { badCalls += 1; return { ok: false, status: 400, json: async () => ({}) }; };
  await assert.rejects(() => extractSignals("Tình huống", { apiKey: "fake-test-key", fetchImpl: bad }));
  assert.equal(badCalls, 1, "must not retry a 4xx");
});

test("openai-compat stops after a bounded number of attempts instead of looping", async () => {
  let calls = 0;
  const alwaysProse = async () => {
    calls += 1;
    return { ok: true, json: async () => ({ choices: [{ message: { content: "vẫn không phải JSON" } }] }) };
  };
  await assert.rejects(() => extractSignals("Tình huống", openaiOpts(alwaysProse)));
  assert.equal(calls, 3, "three attempts total, then give up");
});

test("openai-compat escalates: reminder on attempt 2, assistant prefill on attempt 3", async () => {
  // The gateway enforces neither response_format nor tool_choice, so each retry
  // has to push harder rather than just repeat the same request.
  const bodies = [];
  let calls = 0;
  const fetchImpl = async (_url, request) => {
    calls += 1;
    bodies.push(JSON.parse(request.body));
    // Refuse twice, then answer only once prefilled.
    const content = calls < 3 ? "I can't help with that." : okSignals();
    return { ok: true, json: async () => ({ choices: [{ message: { content } }] }) };
  };

  const result = await extractSignals("Tình huống", openaiOpts(fetchImpl));

  assert.equal(calls, 3);
  assert.equal(result.signals.gia_danh_co_quan_nha_nuoc, true);
  assert.equal(bodies[0].messages.length, 2, "attempt 1: system + user");
  assert.equal(bodies[1].messages.length, 3, "attempt 2: adds the JSON-only reminder");
  assert.equal(bodies[2].messages.length, 4, "attempt 3: also prefills the answer");
  assert.equal(bodies[2].messages[3].role, "assistant");
  assert.equal(bodies[2].messages[3].content, "{");
});

test("openai-compat repairs a prefilled reply that is missing its opening brace", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    if (calls < 3) return { ok: true, json: async () => ({ choices: [{ message: { content: "xin lỗi" } }] }) };
    // Model continues from the "{" it was primed with, so the brace is absent.
    return { ok: true, json: async () => ({ choices: [{ message: { content: okSignals().slice(1) } }] }) };
  };
  const result = await extractSignals("Tình huống", openaiOpts(fetchImpl));
  assert.equal(result.signals.gia_danh_co_quan_nha_nuoc, true);
});

test("extractChatResponse sends the system instruction and returns assistant reply", async () => {
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
                tra_loi: "Cháu chào bác, cháu có thể giúp gì cho bác ạ?"
              })
            }]
          }
        }]
      })
    };
  };

  const result = await extractChatResponse("Chào cháu", {
    apiKey: "fake-test-key",
    fetchImpl
  });

  assert.equal(result.tra_loi, "Cháu chào bác, cháu có thể giúp gì cho bác ạ?");

  const body = JSON.parse(capturedRequest.body);
  assert.equal(body.generationConfig.responseMimeType, "application/json");
  assert.equal(body.contents[0].parts[0].text, "Chào cháu");
});
