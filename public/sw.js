const CACHE_NAME = "khoan-da-shell-v5";
const APP_SHELL = [
  "/",
  "/index.html",
  "/tokens.css",
  "/styles.css?v=20260727-home-followup-1",
  "/services.js",
  "/app.js",
  "/manifest.webmanifest",
  "/assets/brand-shield-reference.png",
  "/assets/avatar-reference.webp",
  "/assets/mobile-home-top-reference.webp",
  "/vendor/unicons/paperclip.svg",
  "/assets/home-couple-reference.webp"
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
