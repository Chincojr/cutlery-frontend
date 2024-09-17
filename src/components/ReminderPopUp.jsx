import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { allCookies } from '../UtilityObjs';
import { RequestAddReminderInformation } from '../RequestFunction';
import Logo from './Logo';
import Loading from './Loading';


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



const ReminderPopUp = ({userObject, triggerDisplayExt, HandleSaveExt, HandleDismissExt}) => {

  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [repeatObject, setRepeatObject] = useState({
    repeatType : false,
    repeatValue : 1,
    error: ""
  })
  const [loading, setLoading] = useState(false)
  const [displayPopUp, setDisplayPopUp] = useState(false)


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

  const HandleDimiss = () => {
    /* 
      Set reminder cookie to ignore
      Set reminderPopUp object to false
      Set repeatObject back to default
    */
    setCookie("reminder","ignore",{path: "/", maxAge:86400});
    setDisplayPopUp(false);
    setRepeatObject({
      repeatType : false,
      repeatValue : 1,
    })
    if (HandleDismissExt) {
      HandleDismissExt();
    }
  }

  const HandleSave = async() => {
    /*
      if the repeatType is true          
        Update the user record          
        Hide reminder pop-up
        Reset reminder object information
      else
        flag and display error
    */
    console.log("Repeat object: ", repeatObject);
    if (repeatObject.repeatType) {
      delete repeatObject.error

      setLoading(true);
      let updateUserReminderInfo = await RequestAddReminderInformation(repeatObject.repeatValue,repeatObject.repeatType)
      setCookie("reminder","ignore",{path: "/", maxAge:86400});
      setLoading(false)

      if (updateUserReminderInfo) {
        setDisplayPopUp(false);
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

      if (HandleSaveExt) {
        HandleSaveExt();
      }


    } else {
      setRepeatObject({
        ...repeatObject,
        error: "Select time"
      })
    }
  }

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

      if (cookies.reminder !== "ignore") {
        if (!userObject.nextReminder) {          
          setDisplayPopUp(true)            
        }
      }  

    }
  
    if ( cookies.type && cookies.uid  && userObject ) {      
      ReminderPopUp();
    }

  }, [userObject])


  return (
    <div>
      {
        displayPopUp || triggerDisplayExt ?
        <div className='absolute overlayBg inset-0 z-[9999] flex justify-center items-center'>

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
      <Loading loading={loading} /> 
    </div>
  )
}

export default ReminderPopUp