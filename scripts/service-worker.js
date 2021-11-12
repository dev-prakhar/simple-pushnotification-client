console.log("Service Worker Running!")

self.addEventListener('push', function(event) {
  var message = JSON.parse(event.data.text()); //
  console.log("data in event = ", JSON.parse(event.data.text()))
  event.waitUntil(
    self.registration.showNotification(message.title, message.options)
  );
});
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
})
