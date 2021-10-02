isPushSupported();

//To check `push notification` is supported or not
function isPushSupported() {
//To check `push notification` permission is denied by user
if (Notification.permission === 'denied') {
//   alert('User has blocked push notification.');
  Swal.fire(
    'Alert',
    'User has blocked push notification.',
    'warning'
    )
  return;
}

//Check `push notification` is supported or not
if (!('PushManager' in window)) {
//   alert('Sorry, Push notification isn\'t supported in your browser.');
    Swal.fire(
    'Alert',
    'Sorry, Push notification isn\'t supported in your browser.',
    'warning'
    )
  return;
}

}