import React, { useState } from 'react'
import IconSelector from './IconSelector'
import { useEffect } from 'react'
import { CheckEventAndNotifySeen } from '../UtilityFunctions'


/**
 * Notifications component for displaying notification icon with unseen indicator.
 *
 * This component renders a notification icon and checks for unseen notifications 
 * or events for the user. It uses the CheckEventAndNotifySeen utility function 
 * to determine if there are any unseen notifications or events. If any are found, 
 * it sets the `unSeen` state to true, displaying an indicator on the icon.
 * 
 * @param {object} userObject - The object containing the user's notification data.
 * @returns {JSX.Element} The rendered component displaying the notification icon and unseen indicator.
 */
const Notifications = ({userObject}) => {

  const [unSeen, setUnSeen] = useState(false)

  useEffect(() => {
    /**
     * Checks if there are any unseen notifications or events for the user.
     * 
     * This asynchronous function calls CheckEventAndNotifySeen to check if there are any unseen notifications or events for the user. If there are any unseen notifications or events, it sets the unSeen state to true, otherwise it sets it to false.
     */
    async function checkForUnSeenNotifyOrEvent() {
      let unSeenEventOrNotify = await CheckEventAndNotifySeen(userObject);    
      
      if (unSeenEventOrNotify) {
        setUnSeen(true)
      } else {
        setUnSeen(false)
      }
    }
    if (userObject) {
      checkForUnSeenNotifyOrEvent()
    }
    
  }, [userObject])
  

  return (
    <div className='relative' >
        <a href="/notifications" className="">
            <IconSelector type={"Notify"} />
            {
              unSeen ?
                <div className="rounded-full h-[5px] w-[5px] accent absolute top-[2px] right-0 "> </div>  
              : <></>         
            }
        </a>

    </div>
  )
}

export default Notifications