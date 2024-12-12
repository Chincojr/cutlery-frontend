import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import uploadImage from '../assets/uploadImage.png'
import dayjs from 'dayjs'
import { CheckUserSeen, getMonthNameWithSuffix } from '../UtilityFunctions'
import { useCookies } from 'react-cookie'
import { allCookies } from '../UtilityObjs'
import IconSelector from './IconSelector'
import ProfilePicture from './ProfilePicture'
import { RequestSeen } from '../RequestFunction'

/**
 * Displays a specific event for the user.
 *
 * This component fetches and displays a specific event based on the userID and userObject.
 * It utilizes cookies to manage user session data and maintains states for the event details
 * and dropdown visibility. The component retrieves the event ID from the URL parameters and
 * fetches the corresponding event details. Additionally, it handles marking the event as seen
 * if it hasn't been marked already and manages the display of user information for admin users.
 *
 * @param {string} userID - The unique identifier for the user.
 * @param {object} userObject - The object containing user-specific information, including events.
 * @returns {JSX.Element} The rendered component displaying the specific event.
 */
const UserViewSpecificEvent = ({userID, userObject}) => {

  /**
   * @param {object} cookies - The cookies object from the react-cookie hook.
   * @param {function} setCookie - The function to set a cookie from the react-cookie hook.
   * @param {function} removeCookie - The function to remove a cookie from the react-cookie hook.
   */
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);

  /**
   * The state of the event.
   * @type {object}
   */
  const [event, setEvent] = useState()  

  /**
   * The state of the dropdown.
   * @type {boolean}
   */
  const [dropDown, setDropDown] = useState(false)

  /**
   * The event ID from the URL parameters.
   * @type {string}
   */
  let {eventID} = useParams()

  /**
   * The month name and day with suffix variables. These variables are only set if the event is not null.
   * @type {{monthName: string, dayWithSuffix: string}}
   */
  var monthName,dayWithSuffix
  if (event) {
    let eventDate = dayjs(event.modified)
    var { monthName,dayWithSuffix } = getMonthNameWithSuffix(eventDate.$M,eventDate.$D)
  }

  const HandleDropDown = () => {
    setDropDown(!dropDown)
  }

  useEffect(() => {
      
    /**
     * Fetches and sets the user's specific event if available.
     * 
     * This asynchronous function checks if the userObject is defined,
     * contains an Event property, and if the Event array has at least
     * one event. If these conditions are met, it sets the event state with
     * the user's specific event data. If the event can't be found, it
     * redirects to the home page.
     */
      const GetSpecificEvent = async() => {
          if (
              userObject && 
              userObject.Event && 
              userObject.Event.length > 0                
          ) {
              let specificEvent = userObject.Event.find(event => event.systemID === eventID)
              if (specificEvent) {
                  setEvent(specificEvent)
              } else {
                  window.location.href = "/"
              }
          }
      }

      if (eventID) {
          GetSpecificEvent();
      }

  }, [userObject])


  useEffect(() => {   

    /**
     * Marks the event as seen if it has not been marked already.
     * 
     * This asynchronous function checks if the event has been seen by the user.
     * If the event is not seen, it sends a request to mark the event as seen
     * using the event's systemID.
     */
    const HandleUserSeen = async() => {        
        let seen = CheckUserSeen(event)             
        if (!seen) {            
          await RequestSeen("Event", event.systemID)                    
    } 

    }

    if (event){
      HandleUserSeen();
    }
    

  }, [event,userID])

  

  return (

    <div className={`  ${event && event.image ? "grid grid-rows-[40%_60%]" : ""}  px-2 h-full overflow-auto `}>

        {
          event 
          ?
          <>
            {
              event.image ? 
              <img src={event.image ? `${process.env.REACT_APP_IMAGE_URL}${event.image}` : uploadImage } alt="" className='w-full overflow-hidden h-full' />
              :<></>
            }
            <div className="">
              <div className="flex justify-between items-center py-2">
                  <div className="truncate primaryText font-bold text-3xl ">{event.title}</div>
                  <div className="text-[12px] italic ">{monthName} {dayWithSuffix} </div>
              </div>
              <div dangerouslySetInnerHTML={{ __html: event.content }} />
            </div>

          </>
          : <></>
        }

        {
          cookies.cookies === "Admin" && event && event.seen && userObject.UsersInformation ?
          <div className="w-full">

            <div className="w-full flex items-center gap-1 ">
              <div className="w-full h-[5px] primary rounded "></div>
              <button onClick={HandleDropDown} className={`${dropDown ? "rotate-90" : "rotate-[270deg]"}  w-fit `}>
                <IconSelector type={"DropArrow"} size={25} />
              </button>
            </div>

            <div className={`${dropDown ? "flex" : "hidden"} gap-2 flex-col`}>
              {
                  Object.keys(JSON.parse(event.seen)).map((id) => {
                    return (
                      <div className="flex w-full gap-4 items-center">
                        <div className="flex items-center justify-start gap-2 w-full">
                          <div className="h-[40px] w-[40px] rounded-full flex items-center justify-center border-[1px] border-black ">
                            <ProfilePicture link={"#"} userImage={userObject.UsersInformation[id] && userObject.UsersInformation[id].imageID ? userObject.UsersInformation[id].imageID : null} size={40} />
                          </div> 
                          <div className="">
                            {userObject.UsersInformation[id] && userObject.UsersInformation[id].name ? userObject.UsersInformation[id].name : userID === id ? userObject.name : id}                            
                          </div>
                          
                        </div>
                        <div className="w-full flex justify-end">{JSON.parse(event.seen)[id]}</div>
                      </div>
                    )
                  })
              }              
            </div>

          </div>
          :<></>
        }


    </div>

  )
}

export default UserViewSpecificEvent