/// <reference lib="webworker" />
//  https://github.com/denoland/deno/issues/15975
declare const self: ServiceWorkerGlobalScope

const sv = "0.1.0"

// stored html/js/css
const webCache = `web-${sv}`

self.addEventListener("install", () => {})

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(event.request).then(function (networkResponse) {
        return caches.open(webCache).then(function (cache) {
          cache.put(event.request, networkResponse.clone())
          return networkResponse
        })
      })
    }),
  )
})
