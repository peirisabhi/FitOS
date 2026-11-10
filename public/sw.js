/**
 * Minimal, hand-written PWA service worker — intentionally NOT a full
 * Workbox precache setup. Scope: make navigation resilient to a dropped
 * connection (network-first, falls back to a cached offline page), not
 * a full offline-first app. Registered only in production and only when
 * NEXT_PUBLIC_API_MODE=rest (see providers/PwaProvider.tsx) — MSW's own
 * mockServiceWorker.js already occupies the "/" scope in mock mode, and
 * running two service workers against the same scope is asking for
 * cache/interception conflicts.
 */
const CACHE_NAME = "gymos-shell-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE_URLS = [OFFLINE_URL, "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only intercept top-level navigations — everything else (API calls,
  // static assets, RSC payloads) passes straight through to the network.
  if (request.mode !== "navigate") return;

  event.respondWith(
    fetch(request).catch(() => caches.match(OFFLINE_URL).then((cached) => cached ?? Response.error())),
  );
});
