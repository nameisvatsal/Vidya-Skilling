
// Service Worker for offline-first functionality
const CACHE_NAME = 'vidya-app-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
];

const CONTENT_CACHE = 'vidya-content-v1';
const AI_MODEL_CACHE = 'vidya-ai-models-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(STATIC_ASSETS);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, CONTENT_CACHE, AI_MODEL_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip Supabase API calls and other external APIs
  if (
    event.request.url.includes('supabase.co') || 
    event.request.url.includes('api.openai.com') ||
    event.request.url.includes('generativelanguage.googleapis.com')
  ) {
    return;
  }

  // Handle content API requests - special content cache
  if (event.request.url.includes('/api/content/')) {
    event.respondWith(
      caches.open(CONTENT_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            // If we have a cached response, use it but also update the cache in the background
            const fetchPromise = fetch(event.request).then(networkResponse => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
            return response;
          }
          
          // If no cached response, go to network and cache
          return fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(error => {
            // If fetch fails, we just have to return an error
            console.error('Fetching failed:', error);
            return new Response('Network request failed', {
              status: 408,
              headers: {'Content-Type': 'text/plain'}
            });
          });
        });
      })
    );
    return;
  }
  
  // Handle AI model download requests
  if (event.request.url.includes('/api/ai-models/')) {
    event.respondWith(
      caches.open(AI_MODEL_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            return response;
          }
          
          // For AI models, we want to show a proper progress indicator
          // This would typically be done via Range requests and streaming
          return fetch(event.request).then(networkResponse => {
            // Clone response and add to cache
            cache.put(event.request, networkResponse.clone());
            
            // Post message to clients to indicate model download completed
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({
                  type: 'MODEL_DOWNLOADED',
                  modelUrl: event.request.url
                });
              });
            });
            
            return networkResponse;
          }).catch(error => {
            console.error('Model download failed:', error);
            return new Response('Model download failed', {
              status: 408,
              headers: {'Content-Type': 'text/plain'}
            });
          });
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time-use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time-use stream
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If network request fails, try to serve the fallback
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            return null;
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle content sync request
  if (event.data && event.data.type === 'SYNC_CONTENT') {
    // In a real application, this would initiate a background sync
    // For now we'll just notify clients when the "sync" is done
    setTimeout(() => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            timestamp: new Date().toISOString()
          });
        });
      });
    }, 2000);
  }
  
  // Handle content download request
  if (event.data && event.data.type === 'DOWNLOAD_CONTENT') {
    const { contentId, url } = event.data;
    
    // In a production app, we would download and cache the content
    // For this example, we'll simulate a download
    let downloadProgress = 0;
    
    const sendProgressUpdate = () => {
      downloadProgress += 10;
      
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'DOWNLOAD_PROGRESS',
            contentId,
            progress: downloadProgress
          });
        });
      });
      
      if (downloadProgress < 100) {
        setTimeout(sendProgressUpdate, 500);
      } else {
        // Download "complete"
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'DOWNLOAD_COMPLETE',
              contentId,
              timestamp: new Date().toISOString()
            });
          });
        });
      }
    };
    
    sendProgressUpdate();
  }
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

// Implementation of our sync function
async function syncContent() {
  try {
    const dbName = 'vidya-offline-db';
    const storeName = 'sync-queue';
    
    // Open the database
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore(storeName, { keyPath: 'id' });
      };
    });
    
    // Get all the items that need to be synced
    const items = await new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
    
    // Process each item
    for (const item of items) {
      // In a real app, we would post each item to the server
      console.log('Syncing item:', item);
      
      // After successfully syncing, remove from the queue
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(item.id);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(undefined);
      });
    }
    
    // Notify clients that sync is complete
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          timestamp: new Date().toISOString(),
          itemCount: items.length
        });
      });
    });
    
    return true;
  } catch (error) {
    console.error('Sync failed:', error);
    return false;
  }
}
