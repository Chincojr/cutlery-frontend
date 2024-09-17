import React, { useState } from 'react'
import IconSelector from './IconSelector'
import { useEffect } from 'react'
import { CheckUserSeen } from '../UtilityFunctions'


const Notifications = ({userObject}) => {

  const [unSeen, setUnSeen] = useState(false)

  useEffect(() => {
    async function checkForUnSeenNotifyOrEvent() {
      let unSeenEventOrNotify = await CheckUserSeen(userObject);
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