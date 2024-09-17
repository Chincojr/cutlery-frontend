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
import { RequestSeen } from '../RequestFunction'

const UserViewSpecificEvent = ({userID, userObject}) => {

  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [event, setEvent] = useState()  
  const [dropDown, setDropDown] = useState(false)
  let {eventID} = useParams()

  var monthName,dayWithSuffix
  if (event) {
    let eventDate = dayjs(event.modified)
    var { monthName,dayWithSuffix } = getMonthNameWithSuffix(eventDate.$M,eventDate.$D)
  }

  const HandleDropDown = () => {
    setDropDown(!dropDown)
  }

  useEffect(() => {
      
      const GetSpecificEvent = async() => {
          if (
              userObject && 
              userObject.Event && 
              userObject.Event.length > 0                
          ) {
              let specificEvent = userObject.Event.filter(event => event.systemID === eventID )
              if (specificEvent.length === 1) {
                  setEvent(specificEvent[0])
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

    const HandleUserSeen = async() => {
        if (
            event &&
            ( !event.seen || !JSON.parse(event.seen)[userID] )
        ) {                    
          await RequestSeen("Event", event.systemID)   
        } 

    }
    HandleUserSeen()

  }, [event,userID])


  

  console.log(monthName,dayWithSuffix,userObject);
  

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