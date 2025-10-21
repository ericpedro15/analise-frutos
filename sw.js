const CACHE_NAME = 'frutos-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar Service Worker e fazer cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Ativar Service Worker e limpar caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições e servir do cache quando offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se encontrar, senão busca da rede
        return response || fetch(event.request);
      })
      .catch(() => {
        // Se estiver offline e não tiver no cache, retorna o index.html
        return caches.match('./index.html');
      })
  );
});

// Sincronizar dados quando voltar online
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // A sincronização é feita pelo código principal no index.html
  console.log('Background sync triggered');
}
