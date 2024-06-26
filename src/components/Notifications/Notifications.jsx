import React, { useState } from 'react'
import IconSelector from '../IconSelector/IconSelector'
import { useEffect } from 'react'
import { CheckUserSeen } from '../../UtilityFunctions'


const Notifications = () => {

  const [unSeen, setUnSeen] = useState(false)

  useEffect(() => {
    async function checkNotify() {
      let notifys = await CheckUserSeen();

      console.log("Notification list: ", notifys);

      if (notifys) {
        setUnSeen(true)
      } else {
        setUnSeen(false)
      }
    }
    checkNotify()
  }, [])
  

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