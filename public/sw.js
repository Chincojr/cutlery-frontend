var webOrigin 
const indexedDBName = "UserInfo";
importScripts('https://cdn.jsdelivr.net/npm/dexie@3.2.2/dist/dexie.min.js');


self.addEventListener('install', event => {
  // Get the origin of the website
  webOrigin = self.location.origin;
  console.log('Origin:', webOrigin);
  
});


self.addEventListener('push', event => {
    console.log(event.data);
    const notificationData = event.data ? event.data.json() : {};
  
    const title = notificationData.title || 'Default Title';
    const options = {
      body: notificationData.body || 'Default body',
      icon: notificationData.icon || webOrigin + '/icon.ico',
      badge: notificationData.badge || webOrigin +'/icon.jpg',
      data: notificationData.data || { url: notificationData.link ? webOrigin + notificationData.link : webOrigin+'/' },
    };
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
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
  