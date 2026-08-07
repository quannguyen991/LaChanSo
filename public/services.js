/* Khoan Đã service adapters: one boundary for network calls and local capabilities. */
(function attachServices(global) {
  const DEFAULT_TIMEOUT = 30000;

  async function request(path, body, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);
    const abortFromCaller = () => controller.abort();
    options.signal?.addEventListener("abort", abortFromCaller, { once: true });
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Dịch vụ chưa trả được kết quả.");
      return payload;
    } catch (error) {
      if (error.name === "AbortError") throw new Error("Đã hủy hoặc dịch vụ chờ quá lâu. Bác có thể thử lại.");
      throw error;
    } finally {
      clearTimeout(timeout);
      options.signal?.removeEventListener("abort", abortFromCaller);
    }
  }

  async function getJson(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);
    try {
      const response = await fetch(path, { signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new Error("Chưa tải được dữ liệu cấu hình.");
      return response.json();
    } catch (error) {
      if (error.name === "AbortError") throw new Error("Dịch vụ chờ quá lâu. Bác có thể thử lại.");
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  const services = {
    scamAnalysisService: {
      analyze(body, options) { return request("/api/phan-tich", body, options); },
      transfer(body, options) { return request("/api/kiem-tra-chuyen-khoan", body, options); },
      journey(body, options) { return request("/api/phan-tich-hanh-trinh", body, options); },
      link(body, options) { return request("/api/kiem-tra-lien-ket", body, options); },
      chat(body, options) { return request("/api/chat", body, options); }
    },
    ocrService: {
      mode: "ai-inline",
      analyzeMedia(body, options) { return request("/api/phan-tich", body, options); }
    },
    speechToTextService: {
      mode: "browser-web-speech",
      supported() { return Boolean(global.SpeechRecognition || global.webkitSpeechRecognition); }
    },
    reputationService: {
      lookup(body, options) { return request("/api/kiem-tra-uy-tin", body, options); }
    },
    qrService: {
      mode: "browser-jsqr",
      decode(imageData) { return typeof global.jsQR === "function" ? global.jsQR(imageData.data, imageData.width, imageData.height) : null; }
    },
    evidenceService: { mode: "local-only" },
    familyCircleService: { mode: "local-only" },
    supportDirectoryService: {
      mode: "versioned-config-backed",
      getAll(options) { return getJson("/api/danh-ba-ho-tro", options); }
    },
    communityReportService: { mode: "local-queue-until-server-provider" },
    privacyService: { mode: "local-only" },
    notificationService: { mode: "in-app-only" },
    textToSpeechService: {
      speak(text, lang = "vi-VN") {
        if (!global.speechSynthesis || !global.SpeechSynthesisUtterance) return false;
        global.speechSynthesis.cancel();
        const utterance = new global.SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        global.speechSynthesis.speak(utterance);
        return true;
      },
      // Màn hình bảo vệ tự đọc to ngay khi mở. Người dùng rời màn hình đó phải
      // im được ngay, nếu không giọng đọc còn nói tiếp trên màn hình sau.
      stop() {
        if (!global.speechSynthesis) return false;
        global.speechSynthesis.cancel();
        return true;
      }
    }
  };

  global.KhoanDaServices = services;
})(window);
