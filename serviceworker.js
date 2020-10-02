const cacheName = 'pwa-conf-v1';

const staticAssets = [
    './',
    './index.html',
    './app.js',
    './dom-helper.js',
    './favicon.ico',
    './function-helper.js',
    './quiz-service.js',
    './style-cp.css',
    './style-quiz.css',
    './style-res.css',
    './style.css',
    './static/css/',
    './static/css/all.min.css',
    './static/css/fontawesome.min.css',
    './static/css/regular.min.css',
    './static/css/solid.min.css',
    './static/webfonts/',
    './static/webfonts/fa-brands-400.eot',
    './static/webfonts/fa-brands-400.svg',
    './static/webfonts/fa-brands-400.ttf',
    './static/webfonts/fa-brands-400.woff',
    './static/webfonts/fa-brands-400.woff2',
    './static/webfonts/fa-regular-400.eot',
    './static/webfonts/fa-regular-400.svg',
    './static/webfonts/fa-regular-400.ttf',
    './static/webfonts/fa-regular-400.woff',
    './static/webfonts/fa-regular-400.woff2',
    './static/webfonts/fa-solid-900.eot',
    './static/webfonts/fa-solid-900.svg',
    './static/webfonts/fa-solid-900.ttf',
    './static/webfonts/fa-solid-900.woff',
    './static/webfonts/fa-solid-900.woff2',
    './images/',
    './images/infy-loader.svg',
];

self.addEventListener('install', async event => {
    console.log('install event');
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
});

self.addEventListener('fetch', async event => {
    console.log('fetch event');
    const req = event.request;

    if(/.*(json)$/.test(req.url)) {
        event.respondWith(networkFirst(req));
    } else {
        event.respondWith(cacheFirst(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName); 
    const cachedResponse = await cache.match(req); 
    return cachedResponse || networkFirst(req); 
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try { 
      const fresh = await fetch(req);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (e) { 
      const cachedResponse = await cache.match(req);
      return cachedResponse;
    }
}
