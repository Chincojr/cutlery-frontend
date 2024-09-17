import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { allCookies } from '../UtilityObjs';
import { askPermission, HandleUserPushNotificationObject } from '../SubscribeNotifications';
import ReminderPopUp from './ReminderPopUp';



const TopBar = ({userObject,logged}) => {

    const [cookies, setCookie, removeCookie] = useCookies(allCookies);
    const [notifyPermission, setNotifyPermission] = useState(false);


    useEffect(() => {
      async function VerifyNotifications() {
        /*
          If the user allows notification and the 
        */
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
        logged && !cookies.update ?
          <div className="w-full accent text-white text-center text-[12px] ">Updating</div>
        : <></>
      }

      {
        logged && !notifyPermission ?
        <button onClick={askPermission} className={`outline-none primary flex justify-center gap-1 text-white text-[12px]`}>
            To recieve notifications <span className="underline">click here</span>
        </button>      
        : <></>
      }

      <ReminderPopUp userObject={userObject} /> 

      

    </>


  )
}

export default TopBar