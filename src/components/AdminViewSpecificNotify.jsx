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

const AdminViewSpecificNotify = ({userID, userObject}) => {

  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [notify, setNotify] = useState()
  const [dropDown, setDropDown] = useState(false)
  let {notifyID} = useParams()

  var monthName,dayWithSuffix
  if (notify) {
    let notifyDate = dayjs(notify.modified)
    var { monthName,dayWithSuffix } = getMonthNameWithSuffix(notifyDate.$M,notifyDate.$D)
  }

  const HandleDropDown = () => {
    setDropDown(!dropDown)
  }

  useEffect(() => {
      
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


  

  console.log(monthName,dayWithSuffix,userObject);
  

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


