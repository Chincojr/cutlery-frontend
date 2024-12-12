import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import uploadImage from '../assets/uploadImage.png'
import dayjs from 'dayjs'
import { getMonthNameWithSuffix } from '../UtilityFunctions'
import { useCookies } from 'react-cookie'
import { allCookies } from '../UtilityObjs'
import IconSelector from './IconSelector'
import ProfilePicture from './ProfilePicture'

/**
 * AdminViewSpecificNotify component for viewing and managing a specific notification.
 * 
 * This component renders a page for viewing and managing a specific notification.
 * It retrieves the notification ID from the URL parameters and fetches the
 * corresponding notification data from the userObject. It also renders a dropdown
 * component for viewing the users who have seen the notification.
 * 
 * The component takes in a userObject prop, which should contain the user's
 * notification data. It uses this data to populate the page and other UI
 * components.
 * 
 * @param {object} userObject - The object containing the user's notification data.
 * @returns {JSX.Element} The rendered component displaying the specific notification page and controls.
 */
const AdminViewSpecificNotify = ({userID, userObject}) => {

  /**
   * Custom hook to manage cookies, notification state, and dropdown toggle.
   */
  const [cookies] = useCookies(allCookies);

  /**
   * State to store notification data.
   * @type {Object|undefined}
   */
  const [notify, setNotify] = useState();

  /**
   * State to toggle dropdown visibility.
   * @type {boolean}
   */
  const [dropDown, setDropDown] = useState(false);

  /**
   * Retrieve notification ID from URL parameters.
   * @type {string}
   */
  let { notifyID } = useParams();

  /**
   * Variables to store formatted month name and day with suffix.
   * @type {string|undefined}
   */
  var monthName, dayWithSuffix;
  if (notify) {
    let notifyDate = dayjs(notify.modified);
    var { monthName, dayWithSuffix } = getMonthNameWithSuffix(notifyDate.$M, notifyDate.$D);
  }

  /**
   * Toggles the dropdown visibility state.
   * 
   * This function toggles the state used to control the visibility of the
   * dropdown component. It is called when the user clicks on the dropdown
   * toggle button.
   */
  const HandleDropDown = () => {
    setDropDown(!dropDown)
  }

  useEffect(() => {
      
    /**
     * Fetches and sets the user's specific notification if available.
     * 
     * This asynchronous function checks if the userObject is defined,
     * contains a Notify property, and if the Notify array has at least
     * one notification. If these conditions are met, it sets the notifyInfo
     * state with the user's specific notification data. If the notification
     * can't be found, it redirects to the home page.
     */
      const GetSpecificNotify = async() => {
          if (
              userObject && 
              userObject.Notify && 
              userObject.Notify.length > 0                
          ) {
              let specificNotify = userObject.Notify.filter(notify => notify.systemID === notifyID )
              if (specificNotify.length === 1) {
                  setNotify(specificNotify[0])
              } else {
                  window.location.href = "/"

              }
          }
      }
      if (notifyID) {
          GetSpecificNotify();
      }

  }, [userObject])  
  

  return (

    <div className={`  ${notify && notify.image ? "grid grid-rows-[40%_60%]" : ""}  h-full overflow-auto `}>

        {
          notify 
          ?
          <>
            {
              notify.image ? 
              <img src={notify.image ? `${process.env.REACT_APP_IMAGE_URL}${notify.image}` : uploadImage } alt="" className='w-full overflow-hidden h-full' />
              :<></>
            }
            <div className="">
              <div className="flex justify-between items-center py-2">
                  <div className="truncate primaryText font-bold text-lg ">Title: <span className="text-black font-normal">{notify.title}</span> </div>
                  <div className="text-[12px] italic ">{monthName} {dayWithSuffix} </div>
              </div>
              <div className="truncate primaryText font-bold text-lg ">Caption: <span className="text-black font-normal">{notify.caption}</span> </div>
              <div dangerouslySetInnerHTML={{ __html: notify.content }} />
            </div>

          </>
          : <></>
        }

        {
          cookies.type === "Admin" && notify && notify.seen && userObject.UsersInformation ?
          <div className="w-full">

            <div className="w-full flex items-center gap-1 ">
              <div className="w-full h-[5px] primary rounded "></div>
              <button onClick={HandleDropDown} className={`${dropDown ? "rotate-90" : "rotate-[270deg]"}  w-fit `}>
                <IconSelector type={"DropArrow"} size={25} />
              </button>
            </div>

            <div className={`${dropDown ? "flex" : "hidden"} gap-2 flex-col`}>
              {
                  Object.keys(JSON.parse(notify.seen)).map((id) => {
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
                        <div className="w-full flex justify-end">{JSON.parse(notify.seen)[id]}</div>
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

export default AdminViewSpecificNotify


