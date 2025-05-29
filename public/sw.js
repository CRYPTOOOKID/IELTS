// Service Worker for Image Caching and Performance Optimization
const CACHE_NAME = 'spinta-action-game-v1';
const IMAGE_CACHE_NAME = 'spinta-images-v1';

// URLs to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle image requests from S3
  if (url.hostname.includes('amazonaws.com') && request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          if (cachedResponse) {
            // Return cached image immediately
            return cachedResponse;
          }

          // Fetch and cache the image
          return fetch(request).then(response => {
            // Only cache successful responses
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => {
            // Return a placeholder or error image if fetch fails
            return new Response('', {
              status: 404,
              statusText: 'Image not found'
            });
          });
        });
      })
    );
  }
  
  // Handle API requests with network-first strategy
  else if (url.hostname.includes('execute-api') && url.pathname.includes('/lesson/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses for offline use
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
  }
  
  // Default: network first, fallback to cache
  else {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
  }
}); 