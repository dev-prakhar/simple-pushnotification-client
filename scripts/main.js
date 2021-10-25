function setupApplication() {
  if (validate()){
      registerServiceWorker()
      askPermission()
      subscribeUserToPush()
  }
}

function validate() {
    return ('serviceWorker' in navigator && 'PushManager' in window)
}

function registerServiceWorker() {
  return navigator.serviceWorker.register('/scripts/service-worker.js')
  .then(function(registration) {
    console.log('Service worker successfully registered.');
    return registration;
  })
  .catch(function(err) {
    console.error('Unable to register service worker.', err);
  });
}

function askPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
  .then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.');
    }
  });
}

function subscribeUserToPush() {
  return navigator.serviceWorker.register('/scripts/service-worker.js')
  .then(function(registration) {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: applicationKey()
    };

    return registration.pushManager.subscribe(subscribeOptions);
  })
  .then(function(pushSubscription) {
    pushSubscriptionJSON = pushSubscription.toJSON()
    subscriptionObject = {
      endpoint : pushSubscriptionJSON.endpoint,
      key : pushSubscriptionJSON.keys.p256dh,
      auth : pushSubscriptionJSON.keys.auth
    }
    console.log('Received PushSubscription: ', subscriptionObject);
    sendSubscriptionToBackEnd(subscriptionObject)
  });
}

function applicationKey() {
  const padding = '='.repeat((4 - APPLICATION_KEY.length % 4) % 4);
  const base64 = (APPLICATION_KEY + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubscriptionToBackEnd(subscription) {
  return fetch('http://localhost:8000/notification-app/push-subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription)
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Bad status code from server.', response);
    }

    return response.json();
  })
  .then(function(responseData) {
    if (!(responseData)) {
      throw new Error('Bad response from server.');
    }
  });
}

