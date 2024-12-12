import { RequestSubscribeNotify } from "./RequestFunction";

/**
 * Converts a URL-safe base64-encoded string to a Uint8Array.
 *
 * @param {string} base64String The URL-safe base64-encoded string.
 * @return {Uint8Array} The decoded Uint8Array.
 */
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

/**
 * Asks for permission to show web push notifications.
 *
 * @return {Promise<void>}
 */
export const askPermission = async () => {
  console.log("Inside the Permission");
  
  try {
    console.log("Inside the Permission 2");
    const permission = await Notification.requestPermission();
    console.log("Inside the Permission 3");
    console.log("Permission: ", permission);
    
    if (permission === 'granted') {                
      await HandleUserPushNotificationObject();
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (error) {
    console.error('An error occurred while asking for notification permission', error);
  }
};


/**
 * Handles the user's push notification object, by registering the service worker,
 * subscribing the user to push notifications, and sending the subscription object
 * to the server to store.
 *
 * @return {Promise<void>}
 */
export const HandleUserPushNotificationObject = async() => {
  try {    

      const swRegistration = await navigator.serviceWorker.ready;
      const applicationServerKey = urlBase64ToUint8Array(`${process.env.REACT_APP_VAPID_KEY}`);
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });
      console.log('User is subscribed:' , subscription);
      await RequestSubscribeNotify(subscription);
      console.log('Notification permission granted.');
  } catch (error) {
    console.error('An error occurred while asking for notification permission', error);
  }
}


