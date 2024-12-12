const CACHE_NAME = 'pwa-cache-v1';
const OFFLINE_URL = '/offline';
const webOrigin = self.location.origin;  // Declare webOrigin globally

// Pre-cache the offline fallback page
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([OFFLINE_URL]);
        })
    );
    console.log('Origin:', webOrigin);  // Log the origin for confirmation
});

// Listen for fetch events
self.addEventListener('fetch', event => {
  event.respondWith(
      (async () => {
          try {
              // Try to fetch from network if online
              const response = await fetch(event.request);
              
              // Cache the response if needed
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, response.clone());
              sendOfflineStatus(false);
              console.log("The user is online");
              return response;
          } catch (error) {
              console.log("Error: ", error);
              // If offline, notify the app
              console.log("The user is offline");              
              sendOfflineStatus(true); // Send offline status to the app
              const cacheResponse = await caches.match(event.request);
              console.log("Cache Response: ", cacheResponse);
              
              return cacheResponse || caches.match(OFFLINE_URL);
          }
      })()
  );
});

// Function to send a message to the app when offline
function sendOfflineStatus(isOffline) {
  // Post a message to all clients (the app)
  clients.matchAll({ type: 'window' }).then(clients => {
      clients.forEach(client => {
          client.postMessage({
              type: 'OFFLINE_STATUS',
              offline: isOffline
          });
      });
  });
}


// Handle push notifications
self.addEventListener('push', event => {
    const notificationData = event.data ? event.data.json() : {};

    const title = notificationData.title || 'Default Title';
    const options = {
        body: notificationData.body || 'Default body',
        icon: notificationData.icon || `${webOrigin}/icon.ico`,
        badge: notificationData.badge || `${webOrigin}/icon.jpg`,
        data: notificationData.data || 
        { 
            url: notificationData.link ? `${webOrigin}${notificationData.link}` : `${webOrigin}/`
        },
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
