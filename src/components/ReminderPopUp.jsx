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


/**
 * A component that displays a reminder pop-up to the user for setting up a
 * knife sharpening reminder. The pop-up allows the user to select the
 * frequency of the reminder, and handles the saving of the reminder
 * information to the user's record. If the user has not set the reminder
 * cookie to ignore and the user does not have a knife sharpning reminder
 * set-up, it displays the reminder pop-up.
 * 
 * @param {Object} userObject - The user's object containing their information.
 * @param {boolean} triggerDisplayExt - External trigger to display the pop-up.
 * @param {function} HandleSaveExt - External function to call after the reminder
 * is saved.
 * @param {function} HandleDismissExt - External function to call after the
 * reminder pop-up is dismissed.
 */
const ReminderPopUp = ({
    userObject, 
    displayReminderPopUp,
    setDisplayReminderPopUp,
  }) => {

  /**
   * Manages the cookies for the component.
   * @type {Array}
   */
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);

  /**
   * State object for repeat settings.
   * @type {Object}
   * @property {boolean} repeatType - Indicates if repeat is enabled.
   * @property {number} repeatValue - The value for repeat frequency.
   * @property {string} error - Error message for invalid input.
   */
  const [repeatObject, setRepeatObject] = useState({
    repeatType: false,
    repeatValue: 1,
    error: ""
  });

  /**
   * Loading state for asynchronous operations.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  /**
   * State for displaying the popup.
   * @type {boolean}
   */
  // const [displayReminderPopUp, setDisplayReminderPopUp] = useState(false);


  /**
   * Handles the change event of an input field. Updates the repeatObject state
   * with the new value of the input field. If the value is greater than the
   * maximum value for the specific repeat type, it sets the value to the
   * maximum. If the value is invalid, it sets the error state to an empty
   * string.
   * @param {object} event - The event object triggered by the input field.
   */
  const HandleChange = (event) => {
    const { name, value } = event.target; 
    let maxValue = RepeatFunctions[name].max

    setRepeatObject({
        ...repeatObject,
        repeatValue: value && Number(value) > maxValue ? maxValue : value,
        error : "",
    });  
  }

  /**
   * Handles the selection of a repeat type. Updates the repeatObject state
   * to set the selected repeat type, resets the repeat value to 1, and clears
   * any error message.
   * @param {string} funcType - The selected repeat type.
   */
  const HandleSelectRepeatType = (funcType) => {
    setRepeatObject({
      repeatType : funcType,
      repeatValue : 1,
      error : "",
    });  
  }

  /**
   * Handles the blur event of an input field. If the input value is invalid,
   * it resets the repeat value to 1 and clears any error message.
   * @param {object} event - The event object triggered by the input field.
   */
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

/**
 * Dismisses the reminder pop-up by setting the reminder cookie to "ignore",
 * hiding the pop-up, and resetting the repeatObject state to its default values.
 * Calls an external dismiss handler if provided.
 */
  const HandleDimiss = () => {
    setCookie("reminder","ignore",{path: "/", maxAge:86400});
    setDisplayReminderPopUp(false);
    setRepeatObject({
      repeatType : false,
      repeatValue : 1,
    })
  }

  /**
   * Handles the save action of the reminder pop-up by updating the user's
   * record with the reminder information and hiding the pop-up. If the
   * repeatType is false, it displays an error message. If a HandleSaveExt
   * function is provided, it calls it after the reminder pop-up is hidden.
   */
  const HandleSave = async() => {
    
    if (repeatObject.repeatType) {
      delete repeatObject.error

      setLoading(true);
      let updateUserReminderInfo = await RequestAddReminderInformation(repeatObject.repeatValue,repeatObject.repeatType)
      setCookie("reminder","ignore",{path: "/", maxAge:86400});
      setLoading(false)

      if (updateUserReminderInfo) {
        setDisplayReminderPopUp(false);
        window.location.reload(true);

      } else {
        setRepeatObject({
          ...repeatObject,
          error: "Select time"
        })          
      }


    } else {
      setRepeatObject({
        ...repeatObject,
        error: "Select time"
      })
    }
  }

  useEffect(() => {

  /**
   * Handles the display of the reminder pop-up based on the user's notification
   * preference and reminder status.
   * 
   * If the user has not set the reminder cookie to ignore and the user does not
   * have a knife sharpning reminder set-up, it displays the reminder pop-up.
   */
    const ReminderPopUp = async() => {
      if (cookies.reminder !== "ignore") {
        if (!userObject.nextReminder) {          
          setDisplayReminderPopUp(true)            
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
        displayReminderPopUp  ?
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