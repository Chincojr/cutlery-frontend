import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { allCookies } from '../../UtilityObjs';
import { askPermission } from '../../SubscribeNotifications';
import Logo from '../Logo/Logo';
import { WSSend } from '../../Webocket';

const RepeatFunctions = {
  day:{
      singular : "day",
      plural: "days",
      max: 365,
  },
  week:{
      singular : "week",
      plural: "weeks",
      max: 52,
  },
  month:{
    singular : "month",
    plural: "months",
    max: 12,
  },
  year:{
      singular : "year",
      plural: "years",
      max: 10,
  },
}

const RequestNotification = ({userObject}) => {

    const [cookies, setCookie, removeCookie] = useCookies(allCookies);
    const [notifyPermission, setNotifyPermission] = useState(true);
    const [reminderPopUp, setReminderPopUp] = useState(false)
    const [repeatObject, setRepeatObject] = useState({
      repeatType : false,
      repeatValue : 1,
      error: ""
    })
    const [triggerNotifyFunction, setTriggerNotifyFunction] = useState(false)

    const HandleDimiss = () => {
      /* 
        Set reminder cookie to ignore
        Set reminderPopUp object to false
        Set repeatObject back to default
      */
      setCookie("reminder","ignore",{path: "/", maxAge:86400});
      setReminderPopUp(false);
      setRepeatObject({
        repeatType : false,
        repeatValue : 1,
      })
    }

    const HandleSave = () => {
      /*
        if the repeatType is true          
          Send update message to backend via websocket 
          Hide reminder pop-up
          Reset reminder object information
        else
          flag and display error
      */
      console.log("repeat object: ", repeatObject);
      if (repeatObject.repeatType) {
        delete repeatObject.error
        WSSend({
          type: "Reminder",
          message: repeatObject
        })
        console.log("Sent: ", repeatObject);
        setReminderPopUp(false);
        setRepeatObject({
          repeatType : false,
          repeatValue : 1,
        })
        
      } else {
        setRepeatObject({
          ...repeatObject,
          error: "Select time"
        })
      }
    }
    
    const HandleChange = (event) => {
      const { name, value } = event.target; 
      let maxValue = RepeatFunctions[name].max

      setRepeatObject({
          ...repeatObject,
          repeatValue: value && Number(value) > maxValue ? maxValue : value,
          error : "",
      });  
    }

    const HandleSelectRepeatType = (funcType) => {
      setRepeatObject({
        repeatType : funcType,
        repeatValue : 1,
        error : "",
      });  
    }

    const HandleBlur = (event) => {
      let {value,name} = event.target

      if (!value || Number(value) < 1) {
          setRepeatObject({
              ...repeatObject,
              repeatValue: 1,
              error : "",
          })
      }
    }


    useEffect(() => {


      async function checkAllowNotifications() {
        /*
          check if user as granted permission to access notifications
          IF permissions as been granted
            change the permission state to true
            send the user notify permission to the backend
          ELSE
            Skip
        */
        const allowNotifyPermission =  Notification.permission;
        console.log("Notification State",allowNotifyPermission);
        if (allowNotifyPermission === "granted") {
            setNotifyPermission(true)
            await askPermission(setNotifyPermission)
        } else {
          setNotifyPermission(false)
        }
      }
    
      if ( ( cookies.log && cookies.uid || cookies.log && cookies.adminUid ) && userObject ) {
        console.log("Gonna run notifications request");
        checkAllowNotifications();
      }

    }, [triggerNotifyFunction])

    useEffect(() => {

      const ReminderPopUp = async() => {
        /* 
          if triggerNotifyfunction is false
            set it to on 
          else 
            skip
          if reminder cookie is set to ignore 
            skip
          Else
            Retrieve the userObject
            Check if the user has a knife sharpning reminder set-up 
            IF yes
              skip
            else 
              display pop up
        */

        if (!triggerNotifyFunction) {
          setTriggerNotifyFunction(true);
        }

        if (cookies.reminder !== "ignore") {
          if (!userObject.repeatType || !userObject.repeatValue) {
            console.log("Display reminder pop-up");
            setReminderPopUp(true)            
          }
        }  

      }
    
      if ( ( cookies.log && cookies.uid || cookies.log && cookies.adminUid ) && userObject ) {
        console.log("Gonna run Reminder");
        ReminderPopUp();
      }

    }, [userObject])

    

  return (
    <>
      {
        !notifyPermission ?
        <button onClick={() => askPermission(setNotifyPermission)} className={` ${notifyPermission ? "hidden" : ""} outline-none primary flex justify-center gap-1 text-white`}>
            To recieve notifications <span className="underline">click here</span>
        </button>      
        : <></>
      }

      {
        reminderPopUp ?
        <div className='absolute overlayBg inset-0 z-[999999999999] flex justify-center items-center'>

          <div className="bg-white w-[300px] sm:w-[350px] p-2 px-5 rounded">
            <div className="max-w-[350px] w-full flex items-center flex-col gap-2 ">
                <div className="w-[100px] ">
                  <a href="/" className="">
                      <Logo />
                  </a>
                </div>
            </div>
            <div className="font-bold text-2xl text-center">Reminder</div>
            <div className="font-medium">Select time to be notified for knife sharpening.</div>
            <div className={` flex pl-2 py-2 flex-col gap-2`}>
                {
                    Object.keys(RepeatFunctions).map((funcType, index) => {
                        return(
                            <div key={index} className="">
                                <div className=" flex gap-2 items-center ">
                                    <input type="radio" name="repeatType" id={funcType} checked={repeatObject.repeatType === funcType ? true : false} onChange={()=>HandleSelectRepeatType(funcType)} className=' ' />
                                    <label htmlFor={funcType} className="">
                                      Every 
                                      <input type="number" name={funcType} id="" value={repeatObject.repeatValue} onChange={HandleChange} onBlur={HandleBlur} className={` ${repeatObject.repeatType === funcType ? "" : "hidden"} w-[40px] border-b-[1px] border-black text-center outline-none bg-transparent `}/> 
                                      {` ${funcType}`}
                                    </label>
                                </div> 
                                <div className="px-5">
                                    <div className={`${repeatObject.repeatType === funcType ? "" : "hidden"} text-[12px] italic font-semibold primaryText `}>This reminder will repeat every {repeatObject.repeatValue} {Number(repeatObject.repeatValue ) > 1 ? RepeatFunctions[funcType].plural : RepeatFunctions[funcType].singular }</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
              
            <div className="text-[12px] accentText">{repeatObject.error}</div>
            <div className="text-white w-full py-2 flex items-center justify-center gap-10">
              <button onClick={HandleDimiss} className="rounded-[20px] outline-none uppercase accent p-2 px-4 text-[14px]">Dismiss</button>
              <button onClick={HandleSave} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Create</button>
            </div>

          </div>


        </div>
        :<></>
      }

    </>


  )
}

export default RequestNotification