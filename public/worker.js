console.log("Service Worker Loaded...");

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('static').then(cache => {
      return cache.addAll(['./', 'styles.css', 'assets/saife-logo.png', 'assets/splash-screen.png']);
    })
  )
})

self.addEventListener('fetch', e => {
  // console.log('e ==> ', e)
  // e.responseWith(
  //   caches.match(e.request).then(response => {
  //     return response || fetch(e.request);
  //   })
  // );
})

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "Member Fallen!",
    actions: [
      {
          action: "/users/myMembers",
          title: "Go to the app"
      }
  ],
    icon: "/assets/saife-logo.png"
  });
});

self.addEventListener("notificationclick", e => {
  const uri = e.action;
  const notification = e.notification;
  console.log(`${self.location.origin}${e.action}`)
  notification.close();
  
  clients.openWindow(`${self.location.origin}${e.action}`);
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Subscription expired');
  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true })
    .then(function(subscription) {
      console.log('Subscribed after expiration', subscription.endpoint);
      return fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify({
            id: userId,
            pushSubObj: JSON.stringify(subscription)
        }),
        headers: {
            "content-type": "application/json"
        }
      });
    })
  );
  console.log("Re-Subscribed and Subscription Object sent to server successfully...");
});