import React, { useEffect } from 'react'
import { DexieSpecificGet } from '../../DexieDb'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import uploadImage from '../../assets/uploadImage.png'
import dayjs from 'dayjs'
import { getMonthNameWithSuffix } from '../../UtilityFunctions'
import { useCookies } from 'react-cookie'
import { allCookies } from '../../UtilityObjs'
import { RequestUserSeen } from '../../RequestFunction'

const UserViewSpecificEvent = () => {

  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [event, setEvent] = useState()
  let {eventID} = useParams()

  var monthName,dayWithSuffix
  if (event) {
    let eventDate = dayjs(event.created_at)
    var { monthName,dayWithSuffix } = getMonthNameWithSuffix(eventDate.$M,eventDate.$D)
  }


  useEffect(() => {
    
    const GetSpecificEvent = async() => {
      let specificEvent = await DexieSpecificGet("Event",eventID)
      setEvent(specificEvent[0]);

      let admin = cookies.uid ? cookies.uid : cookies.adminUid
      await RequestUserSeen(admin,eventID)

    }
    GetSpecificEvent();
  }, [])

  console.log(monthName,dayWithSuffix);
  

  return (

    <div className="grid grid-rows-[40%_60%] px-2 h-full overflow-auto  ">
        {
          event 
          ?
          <>
            <img src={event.image ? `${process.env.REACT_APP_IMAGE_URL}${event.image}` : uploadImage } alt="" className='w-full overflow-hidden h-full' />
            <div className="">
              <div className="flex justify-between items-center py-2">
                  <div className="truncate primaryText font-bold text-3xl ">{event.title}</div>
                  <div className="text-[12px] italic ">{monthName} {dayWithSuffix} </div>
              </div>
              <div className="  ">{event.content}</div>
            </div>

          </>
          : <></>
        }

    </div>

  )
}

export default UserViewSpecificEvent