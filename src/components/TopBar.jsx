import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { allCookies } from '../UtilityObjs';
import { askPermission, HandleUserPushNotificationObject } from '../SubscribeNotifications';
import ReminderPopUp from './ReminderPopUp';



/**
 * TopBar component for rendering the top bar of the website, which includes the navigation links, a button to ask for push notification permission, and a reminder pop-up.
 * 
 * The component takes in a userObject prop, which should contain the user's information, and a logged prop, which indicates whether the user is logged in or not. If the user is logged in, the component renders a button to ask for push notification permission and a reminder pop-up. If the user is not logged in, the component renders nothing.
 * 
 * The component also verifies the user's push notification permission when mounted and if granted, retrieves the user's notification object. If the user has not granted permission, the component renders a button to ask for permission.
 * 
 * @param {Object} userObject - The object containing the user's information.
 * @param {boolean} logged - Whether the user is logged in or not.
 * @returns {JSX.Element} The rendered component of the top bar.
 */
const TopBar = ({userObject,logged}) => {

    /**
     * Retrieves the user's cookies using react-cookie's useCookies hook and stores it in the cookies state.
     * @type {Object} cookies - The user's cookies
     */
    const [cookies] = useCookies(allCookies);

    /**
     * The user's notification permission state.
     * @type {boolean} notifyPermission - If the user has granted push notification permission
     */
    const [notifyPermission, setNotifyPermission] = useState(false);

    const [displayReminderPopUp, setDisplayReminderPopUp] = useState(false)


    useEffect(() => {      
      
      /**
       * Verifies the user's push notification permission and if granted, retrieves the user's notification object.
       * 
       * This function checks the user's push notification permission state and if granted, sets the notifyPermission state to true. If the userObject is defined and does not have a notify property, it calls HandleUserPushNotificationObject to retrieve the user's notification object.
       */
      async function VerifyNotifications() {        
        const allowNotifyPermission =  Notification.permission;
        console.log("Notification State",allowNotifyPermission);
        if (allowNotifyPermission === "granted") {    
            setNotifyPermission(true)  
            if (userObject && !userObject.notify) {
              await HandleUserPushNotificationObject();              
            }                  
        } else {
          setNotifyPermission(false)
        }

      }
    
      if ( logged && userObject ) {        
        VerifyNotifications();
      }
    }, [logged,userObject])
    



    

  return (
    <>
      {
        logged && !cookies.update && !cookies.offline ?
          <div className="w-full accent text-white text-center text-[12px] ">Updating</div>
        : <></>
      }

      {
        logged && !notifyPermission && !cookies.offline ?
        <button onClick={askPermission} className={`outline-none primary flex justify-center gap-1 text-white text-[12px]`}>
            To recieve notifications <span className="underline">click here</span>
        </button>      
        : <></>
      }

      {
        cookies.offline ?
          <div className="w-full accent text-white text-center text-[12px] ">You are Offline</div>
        : <></>
      }

      {
        displayReminderPopUp ?
          <ReminderPopUp 
            userObject={userObject} 
            displayReminderPopUp={displayReminderPopUp}
            setDisplayReminderPopUp={setDisplayReminderPopUp}
          /> 
        : <></>
      }

      {/* <ReminderPopUp 
        userObject={userObject} 
      />  */}

      

    </>


  )
}

export default TopBar