const CACHE_NAME = 'birdsong-cache-v1';
const urlsToCache = [
  'home.html',
  'browse.html',
  'learn.html',
  'favorites.html',
  'birds.json',
  'bird-song.css',
  '/js/main.js',
  '/js/learn.js',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});