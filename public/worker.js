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
  console.log(data)
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "Member Fallen!",
    actions: [
      {
          action: "/users/experts/myMembers",
          title: "Go to the app"
      }
  ],
    icon: "/assets/saife-logo.png",
    data:JSON.stringify(data)        
  });
});

self.addEventListener("notificationclick", e => {
  
  const notification = e.notification;

  const data = JSON.parse(e.notification.data);

  const expertId = data._id
  const memberId= data.memberId
  const videoLink= data.videoLink
  const message= data.message
 
  if(expertId){
    e.waitUntil(
      fetch('users/saveVideoLink',{
        method:"POST",
        body:JSON.stringify({
          expertId:expertId,
          memberId:memberId,
          videoLink:videoLink,
          message:message
        }),
        headers: {
          "content-type": "application/json"
      }
      })
      .then(function (data) {                        
        console.log('Request success: ', data);
      })
      .catch(function (error) {                      
        console.log('Request failure: ', error);
      })
    )
  }


  console.log(`${self.location.origin}${e.notification.actions[0].action}`)
  notification.close();
  
  clients.openWindow(`${self.location.origin}${e.notification.actions[0].action}`);
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