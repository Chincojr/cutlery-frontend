import React, { useEffect, useRef, useState } from 'react'
import IconSelector from './IconSelector'
import dayjs from 'dayjs'
import { CheckUserSeen, SortEventAndNotifyBasedOfDateCreated, getMonthNameWithSuffix } from '../UtilityFunctions'
import { RequestSeen } from '../RequestFunction'

/**
 * NotifyComponent renders a notification item with details such as title, text, and date.
 * 
 * This component uses an Intersection Observer to detect when the notification
 * comes into view, and marks it as seen if it hasn't been seen already.
 * It provides a visual indication of new notifications and includes an icon.
 * 
 * @param {boolean} hasUserSeenNotification - Indicates whether the user has already seen the notification.
 * @param {string} monthName - The full name of the month when the notification was created.
 * @param {string} dayWithSuffix - The day of the month with its ordinal suffix (e.g., 1st, 2nd).
 * @param {string} text - The content or message of the notification.
 * @param {string} title - The title or header of the notification.
 * @param {string} link - The URL to navigate to when the notification is clicked.
 * @param {string} systemID - The unique identifier for the notification.
 * @param {string} icon - The type of icon to display alongside the notification.
 * @returns {JSX.Element} The rendered notification component.
 */
const NotifyComponent = ({
    hasUserSeenNotification,
    monthName,
    dayWithSuffix,
    text,
    title,
    link,
    systemID,
  icon
  }) => {

    /**
     * Reference to the component that contains the notification.
     * @type {React.MutableRefObject<null>}
     */
    const notifyRef = useRef(null);

    /**
     * State hook that tracks whether the user has seen the notification or not.
     * @type {boolean}
     */
    const [seenNotify, setSeenNotify] = useState(false)
    

    useEffect(() => {

        /**
         * Intersection Observer callback to handle visibility of the notification.
         * 
         * This observes the visibility of the notification component and triggers an
         * asynchronous action to mark the notification as seen when it becomes visible.
         * 
         * @param {Array<IntersectionObserverEntry>} entries - The list of intersection observer entries.
         */
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
    }, []);
      


    return (
        <a ref={icon === "Notify" ? notifyRef : null} href={link ? link : "#"} className="">
            <div className="neutral p-2 rounded ">
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

/**
 * UserViewNotify component for viewing and managing notifications.
 * 
 * This component renders a table for viewing notifications and events, and a
 * sorting component for sorting notifications. It also renders a bulk select and
 * delete component for deleting multiple notifications at once.
 * 
 * The component takes in a userObject prop, which should contain the user's
 * notification data. It uses this data to populate the table and other UI
 * components.
 * 
 * @param {object} userObject - The object containing the user's notification data.
 * @returns {JSX.Element} The rendered component displaying the notifications table and controls.
 */
const UserViewNotify = ({userID,userObject}) => {
  
  /**
   * State hook to store notifications.
   * @type {Array<Object>}
   */
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    

    /**
     * Sorts the user's notifications and events in descending order by date created.
     * 
     * This asynchronous function calls SortEventAndNotifyBasedOfDateCreated to
     * retrieve the sorted list of notifications and events, and then updates the
     * notifications state with the sorted list.
     */
    async function SortEventAndNotifications() {
      let notificationList = await SortEventAndNotifyBasedOfDateCreated(userObject);
      setNotifications(notificationList);

    }
    SortEventAndNotifications()

  }, [userObject])
  

  return (
    <div className="flex flex-col gap-2 h-full overflow-auto p-2 ">
        {
            notifications.map((obj,index) => {

                let dateObj = dayjs(`${obj.created_at}`)
                let { monthName,dayWithSuffix } = getMonthNameWithSuffix(dateObj.$M,dateObj.$D)
                let hasUserSeenNotification = CheckUserSeen(obj);

                return (
                    <div key={index} className={`max-w-[700px] w-full`}>
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