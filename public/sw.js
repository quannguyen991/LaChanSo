const CACHE_NAME = "khoan-da-shell-v53";
const APP_SHELL = [
  "/",
  "/index.html",
  "/tokens.css",
  "/styles.css?v=20260801-route-transitions-1",
  "/khoan-da-2026.css?v=20260801-learning-alerts-1",
  "/mobile-header-fix.css?v=20260802-4",
  // Màn hình bảo vệ và màn hình một câu hỏi phải dựng được khi mất mạng —
  // đó chính là lúc người dùng cần chúng nhất.
  "/intervention-ladder.css?v=20260807-1",
  "/mobile-clay.css?v=20260807-1",
  "/services.js",
  "/local-vault.js",
  "/app.js",
  "/manifest.webmanifest",
  "/assets/brand-shield-reference.png",
  "/assets/avatar-reference.webp",
  "/vendor/unicons/paperclip.svg",
  "/assets/home-couple-reference.webp"
  ,"/assets/brand-shield-purple.webp"
  ,"/assets/mascot-home.webp"
  ,"/assets/home-family-action.webp"
  ,"/assets/home-alert-action.webp"
  ,"/assets/home-siren-action.webp"
  ,"/assets/mascot-check.webp"
  ,"/assets/mascot-history.webp"
  ,"/assets/mascot-learn.webp"
  ,"/assets/mascot-assistant.webp"
  ,"/assets/mascot-emergency.webp"
  ,"/config/support-directory.json"
  ,"/assets/onboarding-reference-1.webp"
  ,"/assets/onboarding-reference-2.webp"
  ,"/assets/onboarding-reference-3.webp"
  ,"/assets/onboarding-reference-4.webp"
  ,"/assets/onboarding-reference-5.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") return caches.match("/index.html");
        return Response.error();
      })
  );
});
