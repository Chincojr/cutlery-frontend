import { getCookie } from "./UtilityFunctions";

export const askPermission = async (setNotifyState) => {
  
  try {
    let uid = getCookie("uid")
    let adminUid = getCookie("adminUid")
    let log = getCookie("log")

    if( !log){
        console.log("User is not logged in and does not have ID",uid, log);
        return
    }

    if( !uid && !adminUid){
      console.log("User is not logged in and does not have ID",uid, log);
      return
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        await setNotifyState(true)
        await subscribeUser();
      console.log('Notification permission granted.');
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (error) {
    console.error('An error occurred while asking for notification permission', error);
  }
};

export const subscribeUser = async () => {
  const swRegistration = await navigator.serviceWorker.ready;
  const applicationServerKey = urlBase64ToUint8Array(`${process.env.REACT_APP_VAPID_KEY}`);
  try {
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    });
    console.log('User is subscribed:' , subscription);
    sendSubscriptionToServer(subscription);
  } catch (error) {
    console.error('Failed to subscribe the user: ', error);
  }
};

const sendSubscriptionToServer = async (subscription) => {
  // Send the subscription details to your server
  try {
    console.log("Sending subscription to server");
    let uid = getCookie("uid")
    let adminUid = getCookie("adminUid")
    await fetch(`${process.env.REACT_APP_API_URL}/subscribe-notify`, {
      method: 'POST',
      body: JSON.stringify({uid,subscription,adminUid}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error sending subscription to server: ', error);
  }
};

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


