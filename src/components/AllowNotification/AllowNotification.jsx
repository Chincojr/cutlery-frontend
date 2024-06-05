import React, { useEffect, useState } from 'react'
import { RequestUserNotifySubscribeObject } from '../../RequestFunction';
import { useCookies } from 'react-cookie'
import { allCookies } from '../../UtilityObjs';
import { askPermission } from '../../SubscribeNotifications';

const RequestNotification = () => {

    const [cookies, setCookie, removeCookie] = useCookies(allCookies);
    const [allowNotify, setAllowNotify] = useState(true);
    const [allowPeriodicSync, setAllowPeriodicSync] = useState(true)

    const askPeriodicSyncPermission = async () => {
      if (navigator.permissions && navigator.permissions.request) {
        console.log("Permission request is alowed");
      } else {
        console.log("Permission request is not allowed");
      }
    };
    

    useEffect(() => {
      async function checkAllowNotifications() {
        const allowNotifyPermission =  Notification.permission;
        if (allowNotifyPermission === "granted") {
            setAllowNotify(true)
            
            await askPermission(setAllowNotify)

            // const checkUserNotifySubscribeObject = await RequestUserNotifySubscribeObject(cookies.uid,cookies.adminUid)

            // if (checkUserNotifySubscribeObject === 404) {
            //   await askPermission(setAllowNotify)
            // }
        }
      }
      async function checkAllowPeriodicSync (){
        if (navigator.permissions && navigator.permissions.request) {
          console.log("Permission request is alowed");
        } else {
          console.log("Permission request is not allowed");
        }
      }    

      async function checkPermissions (){
        await checkAllowNotifications()
        await checkAllowPeriodicSync()
      }

      
      if ( cookies.log && cookies.uid || cookies.log && cookies.adminUid ) {
        checkPermissions();
      }
      

      

    }, [])
    

  return (
    <>
      {
        !allowNotify ?
        <button onClick={() => askPermission(setAllowNotify)} className={` ${allowNotify ? "hidden" : ""} outline-none primary flex justify-center gap-1 text-white`}>
            To recieve notifications <span className="underline">click here</span>
        </button>      
        : !allowPeriodicSync ?
        <button onClick={askPeriodicSyncPermission} className={` ${allowPeriodicSync ? "hidden" : ""} outline-none primary flex justify-center gap-1 text-white`}>
        To recieve reminder alerts <span className="underline">click here</span>
        </button>      
        : <></>
      }
    </>


  )
}

export default RequestNotification