// ===============================================
// DESTINOVA SERVICE WORKER v1.0.0
// PWA Offline Support & Caching Strategy
// ===============================================

const CACHE_VERSION = 'destinova-v1.0.0';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;
const CACHE_API = `${CACHE_VERSION}-api`;

// Critical assets to pre-cache (App Shell)
const STATIC_ASSETS = [
    '/html/index.html',
    '/html/offline.html',
    '/css/index.css',
    '/js/animations.js',
    '/js/search.js',
    '/js/interactive.js',
    '/js/ai-features.js',
    '/js/performance.js',
    '/js/theme-manager.js',
    '/js/pwa-installer.js',
    '/js/accessibility.js',
    '/manifest.json',
    '/site-images/icon-192x192.png',
    '/site-images/icon-512x512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js',
    'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Maximum cache age for API responses (1 hour)
const API_CACHE_DURATION = 60 * 60 * 1000;

// Maximum number of items in dynamic cache
const MAX_DYNAMIC_CACHE = 50;
const MAX_IMAGE_CACHE = 100;

// ===============================================
// INSTALL EVENT - Pre-cache static assets
// ===============================================
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then((cache) => {
                console.log('[Service Worker] Pre-caching app shell');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Pre-cache complete');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('[Service Worker] Pre-cache failed:', error);
            })
    );
});

// ===============================================
// ACTIVATE EVENT - Clean old caches
// ===============================================
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Delete old versions of our caches
                            return cacheName.startsWith('destinova-') && 
                                   cacheName !== CACHE_STATIC &&
                                   cacheName !== CACHE_DYNAMIC &&
                                   cacheName !== CACHE_IMAGES &&
                                   cacheName !== CACHE_API;
                        })
                        .map((cacheName) => {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activated');
                return self.clients.claim(); // Take control of all pages immediately
            })
    );
});

// ===============================================
// FETCH EVENT - Caching strategies
// ===============================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip Chrome extensions
    if (url.protocol === 'chrome-extension:') {
        return;
    }
    
    // HTML Pages: Network-first with cache fallback
    if (request.headers.get('Accept')?.includes('text/html')) {
        event.respondWith(networkFirstStrategy(request, CACHE_DYNAMIC));
        return;
    }
    
    // CSS/JS/Fonts: Cache-first with network fallback
    if (url.pathname.match(/\.(css|js|woff2?|ttf|otf)$/)) {
        event.respondWith(cacheFirstStrategy(request, CACHE_STATIC));
        return;
    }
    
    // Images: Stale-while-revalidate
    if (url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
        event.respondWith(staleWhileRevalidate(request, CACHE_IMAGES, MAX_IMAGE_CACHE));
        return;
    }
    
    // API Calls: Network-first with timed cache
    if (url.pathname.includes('/api/') || url.search.includes('api_key')) {
        event.respondWith(apiCacheStrategy(request, CACHE_API));
        return;
    }
    
    // Default: Network-first
    event.respondWith(networkFirstStrategy(request, CACHE_DYNAMIC));
});

// ===============================================
// CACHING STRATEGIES
// ===============================================

/**
 * Network-First Strategy
 * Try network, fall back to cache, then offline page
 */
async function networkFirstStrategy(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            console.log('[Service Worker] Serving from cache:', request.url);
            return cachedResponse;
        }
        
        // No cache, return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await caches.match('/html/offline.html');
            if (offlinePage) {
                return offlinePage;
            }
        }
        
        throw error;
    }
}

/**
 * Cache-First Strategy
 * Serve from cache, fetch from network if not cached
 */
async function cacheFirstStrategy(request, cacheName) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[Service Worker] Fetch failed:', error);
        throw error;
    }
}

/**
 * Stale-While-Revalidate Strategy
 * Return cached version immediately, update cache in background
 */
async function staleWhileRevalidate(request, cacheName, maxItems) {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then(async (networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
            
            // Limit cache size
            await limitCacheSize(cacheName, maxItems);
        }
        return networkResponse;
    }).catch(() => {
        // Ignore fetch errors in background
    });
    
    // Return cached response immediately if available
    return cachedResponse || fetchPromise;
}

/**
 * API Cache Strategy
 * Cache with expiration time (1 hour)
 */
async function apiCacheStrategy(request, cacheName) {
    const cachedResponse = await caches.match(request);
    
    // Check if cached response is still fresh
    if (cachedResponse) {
        const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time'));
        const now = new Date();
        
        if (now - cachedTime < API_CACHE_DURATION) {
            console.log('[Service Worker] Serving fresh API cache:', request.url);
            return cachedResponse;
        }
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            
            // Clone response and add timestamp header
            const responseToCache = networkResponse.clone();
            const headers = new Headers(responseToCache.headers);
            headers.append('sw-cached-time', new Date().toISOString());
            
            const cachedResponseWithTime = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers
            });
            
            cache.put(request, cachedResponseWithTime);
        }
        
        return networkResponse;
    } catch (error) {
        // Return stale cache if network fails
        if (cachedResponse) {
            console.log('[Service Worker] Network failed, serving stale API cache');
            return cachedResponse;
        }
        throw error;
    }
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

/**
 * Limit cache size by removing oldest entries
 */
async function limitCacheSize(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxItems) {
        const deleteCount = keys.length - maxItems;
        for (let i = 0; i < deleteCount; i++) {
            await cache.delete(keys[i]);
        }
        console.log(`[Service Worker] Trimmed ${deleteCount} items from ${cacheName}`);
    }
}

// ===============================================
// BACKGROUND SYNC
// ===============================================
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync triggered:', event.tag);
    
    if (event.tag === 'sync-searches') {
        event.waitUntil(syncPendingSearches());
    }
});

/**
 * Sync pending searches when back online
 */
async function syncPendingSearches() {
    try {
        // Get pending searches from IndexedDB (would be implemented)
        console.log('[Service Worker] Syncing pending searches...');
        
        // TODO: Implement actual sync logic with backend
        // const pendingSearches = await getPendingSearches();
        // for (const search of pendingSearches) {
        //     await fetch('/api/search', { method: 'POST', body: JSON.stringify(search) });
        // }
        
        console.log('[Service Worker] Sync complete');
    } catch (error) {
        console.error('[Service Worker] Sync failed:', error);
        throw error; // Will retry sync
    }
}

// ===============================================
// PUSH NOTIFICATIONS
// ===============================================
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push notification received');
    
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Destinova';
    const options = {
        body: data.body || 'New notification from Destinova',
        icon: '/site-images/icon-192x192.png',
        badge: '/site-images/icon-72x72.png',
        image: data.image,
        data: {
            url: data.url || '/html/index.html'
        },
        actions: [
            { action: 'view', title: 'View Details' },
            { action: 'dismiss', title: 'Dismiss' }
        ],
        vibrate: [200, 100, 200],
        tag: data.tag || 'general',
        requireInteraction: false
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'view' || !event.action) {
        const urlToOpen = event.notification.data.url || '/html/index.html';
        
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((clientList) => {
                    // Focus existing window if available
                    for (const client of clientList) {
                        if (client.url === urlToOpen && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // Open new window
                    if (clients.openWindow) {
                        return clients.openWindow(urlToOpen);
                    }
                })
        );
    }
});

// ===============================================
// MESSAGE HANDLING (from client pages)
// ===============================================
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_DYNAMIC)
                .then((cache) => cache.addAll(event.data.urls))
        );
    }
    
    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

// Log service worker version
console.log('[Service Worker] Version:', CACHE_VERSION);
