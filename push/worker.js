console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "Notified by SAIFE!",
    icon: "/assets/saife-logo.png"
  });
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