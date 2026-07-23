// KHOAN ĐÃ service worker.
// Goal: make the app installable and let the shell + local tools (evidence log,
// family contacts, history) open even with no network. Analysis endpoints under
// /api are ALWAYS network-only and never cached — results are dynamic and can
// contain sensitive situation text.

const CACHE_VERSION = "khoan-da-v1";
const SHELL = [
  "/",
  "/index.html",
  "/app.js",
  "/services.js",
  "/styles.css",
  "/tokens.css",
  "/manifest.webmanifest",
  "/vendor/jsQR.js",
  "/fonts/nunito-sans/index.css",
  "/assets/icon-192.png",
  "/assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      // Individual failures (e.g. a font path) must not abort the whole install.
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;   // let cross-origin go to network
  if (url.pathname.startsWith("/api/")) return;      // never cache analysis endpoints

  // Navigations: prefer fresh HTML, fall back to the cached shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html").then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // Static assets: serve cached immediately, refresh in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
