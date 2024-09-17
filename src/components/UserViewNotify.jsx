import React, { useEffect, useRef, useState } from 'react'
import IconSelector from './IconSelector'
import dayjs from 'dayjs'
import { SortEventAndNotifyBasedOfDateCreated, getMonthNameWithSuffix } from '../UtilityFunctions'
import { useCookies } from 'react-cookie'
import { allCookies } from '../UtilityObjs'
import { RequestSeen } from '../RequestFunction'

const NotifyComponent = ({hasUserSeenNotification,monthName,dayWithSuffix,text,title,link,systemID,icon}) => {

    const notifyRef = useRef(null);
    const [seenNotify, setSeenNotify] = useState(false)
    console.log("NotifyComponent: ", title,hasUserSeenNotification);
    
  
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !seenNotify && !hasUserSeenNotification) {
              // Triggering async action when the element becomes visible
              RequestSeen("Notify", systemID)
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
        <a ref={icon === "Notify" ? notifyRef : null} href={link ? link : "#"} className="">
            <div className="neutral max-w-[700px] p-2 rounded w-full">
                <div className="text-[12px] text-end accentText px-3">
                    {hasUserSeenNotification ? "" : "New"}
                </div>
                <div className='items-center grid grid-cols-[10%_90%]  '>
                    <div className="pr-2 flex items-center justify-center">
                        <IconSelector type={icon} />
                    </div>
                    <div className="text-[12px] ">
                        <div className="font-bold primaryText text-base">{title}</div>
                        <div className={` font-bold ${text && text.length > 50 ? "truncate" : ""} `}>{text}</div>
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
    
    async function SortEventAndNotifications() {
      let notificationList = await SortEventAndNotifyBasedOfDateCreated(userObject);
      setNotifications(notificationList);

    }
    SortEventAndNotifications()

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

                if (cookies.type === "Client") {
                  hasUserSeenNotification = obj.seen ? true : false
                }






                return (
                    <div key={index} className={` `}>
                        {
                            obj.caption !== undefined  ?
                              <NotifyComponent hasUserSeenNotification={hasUserSeenNotification} monthName={monthName} dayWithSuffix={dayWithSuffix} link={obj.link} text={obj.caption} systemID={obj.systemID} title={obj.title} icon={"Notify"} />
                            : obj.content !== undefined  ?
                              <NotifyComponent hasUserSeenNotification={hasUserSeenNotification} monthName={monthName} dayWithSuffix={dayWithSuffix} link={`/event/${obj.systemID}`} systemID={obj.systemID} title={obj.title} icon={"Event"} />
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