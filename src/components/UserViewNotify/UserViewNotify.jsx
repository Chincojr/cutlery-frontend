import React, { useEffect, useState } from 'react'
import IconSelector from '../IconSelector/IconSelector'
import dayjs from 'dayjs'
import { CheckUserSeen, getMonthNameWithSuffix } from '../../UtilityFunctions'
import { useCookies } from 'react-cookie'
import { allCookies } from '../../UtilityObjs'
import {  RequestUserSeen } from '../../RequestFunction'


const UserViewNotify = () => {
  
  const [notifications, setNotifications] = useState([])
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);


  useEffect(() => {
    
    async function checkNotify() {
      let notificationList = await CheckUserSeen();

      console.log("Notification list: ", notificationList);

      if (notificationList) {
        setNotifications(notificationList)
      } 
    }
    checkNotify()

  }, [])

  const HandleRemove = async(removeSystemID) => {
    let modifiedNNotificationList = notifications.filter(obj => obj.systemID !== removeSystemID);
    setNotifications(modifiedNNotificationList);

    let admin = cookies.uid ? cookies.uid : cookies.adminUid
    await RequestUserSeen(admin,removeSystemID)
  }
  
  

  return (
    <div className="flex flex-col gap-2 h-full overflow-auto p-2 ">
        {
            notifications.map((obj,index) => {

                let dateObj = dayjs(`${obj.modified}`)
                let { monthName,dayWithSuffix } = getMonthNameWithSuffix(dateObj.$M,dateObj.$D)


                return (
                    <div key={index} className={` `}>

                        {
                            obj.type === "Notify" ?
                            <a href={obj.link ? obj.link : "#"} className="">
                                <div className="neutral max-w-[700px] p-2 rounded w-full">
                                    <div className="w-full flex justify-end outline-none ">
                                        <button onClick={() => HandleRemove(obj.systemID)} className="rotate-45 w-fit">
                                            <IconSelector size={20} type={"Plus"} />
                                        </button>
                                    </div>
                                    <div className='items-center grid grid-cols-[10%_90%]  '>
                                        <div className="pr-2 flex items-center justify-center">
                                            <IconSelector type={"Notify"} />
                                        </div>
                                        <div className="text-[12px] ">
                                            <div className="font-bold primaryText text-base">{obj.title}</div>
                                            <div className={` font-bold ${obj.caption.length > 50 ? "truncate" : ""} `}>{obj.caption}</div>
                                            <div className=" ">{monthName} {dayWithSuffix}</div>
                                            <div className={`${obj.repeat ? "flex items-center gap-1" : "hidden"} `}>
                                                <IconSelector type={"Repeat"} size={15}/>
                                                Every {obj.repeat}
                                            </div>
                                        </div>
                                    </div>                                
                                </div>                                
                            </a>
                            : obj.type === "Event" ?
                            <a href={`/event/${obj.systemID}`} className="">
                                <div className='neutral p-2 rounded place-items- w-full grid grid-cols-[10%_90%] max-w-[700px] '>
                                    <div className="pr-2 flex items-center justify-center">
                                        {
                                            obj.image ? (
                                                <img src={`${process.env.REACT_APP_IMAGE_URL}${obj.image}`} alt="" className="object-fit" />
                                            ) : (
                                                <IconSelector type={"Event"} />
                                            )
                                        }
                                    </div>
                                    <div className="text-[12px] ">
                                        <div className="font-bold primaryText text-base">{obj.title}</div>
                                        <div className={` font-bold ${obj.content.length > 50 ? "truncate" : ""} `}>{obj.content}</div>
                                        <div className=" ">{monthName} {dayWithSuffix}</div>
                                        <div className={`${obj.repeat ? "flex items-center gap-1" : "hidden"} `}>
                                            <IconSelector type={"Repeat"} size={15}/>
                                            Every {obj.repeat}
                                        </div>
                                    </div>
                                </div>                                
                            </a>

                            : obj.type === "Reminder" ?
                            <div className='neutral p-2 rounded place-items- w-full grid grid-cols-[10%_90%] max-w-[700px] '>
                                <div className="pr-2 flex items-center justify-center">
                                    <IconSelector type={"Reminder"} />
                                </div>
                                <div className="text-[12px] ">
                                    <div className="font-bold primaryText text-base">{obj.title}</div>
                                    <div className={` font-bold ${obj.caption.length > 50 ? "truncate" : ""} `}>{obj.caption}</div>
                                    <div className=" ">{monthName} {dayWithSuffix}</div>
                                </div>
                            </div>
                            : <></>
                        }


                    </div>
                )
            })
        }
    </div>
  )
}

export default UserViewNotify