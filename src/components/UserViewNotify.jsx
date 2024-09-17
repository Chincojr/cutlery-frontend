import React, { useEffect, useRef, useState } from 'react'
import IconSelector from './IconSelector'
import dayjs from 'dayjs'
import { CheckUserSeen, getMonthNameWithSuffix } from '../UtilityFunctions'
import { useCookies } from 'react-cookie'
import { allCookies } from '../UtilityObjs'
import { RequestSeen } from '../RequestFunction'

const NotifyComponent = ({obj,hasUserSeenNotification,monthName,dayWithSuffix,index}) => {

    const notifyRef = useRef(null);
    const [seenNotify, setSeenNotify] = useState(false)
  
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !seenNotify && !hasUserSeenNotification) {
              // Triggering async action when the element becomes visible
              RequestSeen("Notify", obj.systemID)
                .then(() => {
                  setSeenNotify(true);
                  // Stop observing after action is done
                  if (notifyRef.current) {
                    observer.unobserve(notifyRef.current);
                  }
                })
                .catch((error) => {
                  console.error("Error marking notification as seen:", error);
                });
            }
          });
        });
      
        if (notifyRef.current) {
          observer.observe(notifyRef.current);
        }
      
        // Cleanup observer on component unmount
        return () => {
          if (notifyRef.current) {
            observer.unobserve(notifyRef.current);
          }
        };
    }, []); // Add dependencies to useEffect
      


    return (
        <a ref={notifyRef} href={obj.link ? obj.link : "#"} className="">
            <div className="neutral max-w-[700px] p-2 rounded w-full">
                <div className="text-[12px] text-end accentText px-3">
                    {hasUserSeenNotification ? "" : "New"}
                </div>
                <div className='items-center grid grid-cols-[10%_90%]  '>
                    <div className="pr-2 flex items-center justify-center">
                        <IconSelector type={"Notify"} />
                    </div>
                    <div className="text-[12px] ">
                        <div className="font-bold primaryText text-base">{obj.title}</div>
                        <div className={` font-bold ${obj.caption && obj.caption.length > 50 ? "truncate" : ""} `}>{obj.caption}</div>
                        <div className=" ">{monthName} {dayWithSuffix}</div>
                    </div>
                </div>                                
            </div>                                
        </a>
    )
}

const UserViewNotify = ({userID,userObject}) => {
  
  const [notifications, setNotifications] = useState([])
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);


  useEffect(() => {
    
    async function checkNotify() {
      let notificationList = await CheckUserSeen(userObject);
      setNotifications(notificationList);

    }
    checkNotify()

  }, [userObject])


  console.log("Notification list: ", notifications); 

  return (
    <div className="flex flex-col gap-2 h-full overflow-auto p-2 ">
        {
            notifications.map((obj,index) => {

                let dateObj = dayjs(`${obj.created_at}`)
                let { monthName,dayWithSuffix } = getMonthNameWithSuffix(dateObj.$M,dateObj.$D)
                let hasUserSeenNotification = false
                if (cookies.type === "Admin") {
                    hasUserSeenNotification = obj.seen && JSON.parse(obj.seen) && JSON.parse(obj.seen)[userID] ? true : false
                }

                if (cookies.uid) {
                    hasUserSeenNotification = obj.seen ? true : false
                }





                return (
                    <div key={index} className={` `}>
                        {
                            obj.caption !== undefined  ?
                            <NotifyComponent obj={obj} hasUserSeenNotification={hasUserSeenNotification} monthName={monthName} dayWithSuffix={dayWithSuffix} index={index} />
                            : obj.content !== undefined && !hasUserSeenNotification ?
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
                                        <div className=" ">{monthName} {dayWithSuffix}</div>
                                    </div>
                                </div>                                
                            </a>
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