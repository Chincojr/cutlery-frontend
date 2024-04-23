import React, { useState } from 'react'
import { TodaysDate, timeCompare } from '../../UtilityFunctions'
import DatePick from '../DatePicker/DatePick'
import Input from '../Input/Input'
import InputTextArea from '../Input/InputTextArea'
import { adminNotifyErrMessage, notifsFormFormat } from '../../UtilityObjs'
import InputToggle from '../Input/InputToggle'


const AdminCreateNotifs = () => {

    let {presentDay,presentTime,presentMonth,presentDayOfMonth} = TodaysDate()

  const [notifInfo, setNotifInfo] = useState({
    title: "",
    caption: "",
    selectDay: presentDay,
    selectTime: presentTime,
    automate : false
  })

  const [err, setErr] = useState({
    title: "",
    caption: "",
    selectDay: "",
    selectTime: "",
  })

  const HandleInvalid = (name,value) => {

    switch (name) {
        case "title":
            if ( !value ) {
                setErr({...err, [name] : adminNotifyErrMessage[name]})
                return true
            }
            break;    
        case "caption":
            if ( !value ) {
                setErr({...err, [name] : adminNotifyErrMessage[name]})
                return true
            }
            break;   
            case "selectDay":
                if ( !value ) {
                    setErr({...err, [name] : adminNotifyErrMessage[name]})
                    return true
                }

                if (value !== presentDay ) {
                    setErr({...err, ["selectTime"] : ""})
                    return true
                }

                break;   
            case "selectTime":
                if (notifInfo.selectDay === presentDay) {
                    let checkTime = timeCompare(value,presentTime)
                    if ( !checkTime  ) {
                        setErr({...err, [name] : adminNotifyErrMessage[name]})
                        return true
                    }
                }

                
        default:
            return false
            break;
    }



    setErr({...err, [name] : ""})
    return false

}

  const HandleChange = (event) => {
    const { name, value } = event.target; 
    setNotifInfo({
        ...notifInfo,
        [name]: value,
    });  


    HandleInvalid(name,value)
  }

  const HandleCreate = () => {
    let formErr = false

    for (let key in notifInfo) {
        if (HandleInvalid(key,notifInfo[key])) {
          formErr = true;
          console.log(key);
          return;
        }
    }
  }

  return (
    <div className='' >

        <div className="w-full flex flex-col justify-center items-center py-2">
            <div className="max-w-[350px] w-full flex gap-2 flex-col">
                {
                    notifsFormFormat.map((obj,index) => {
                        return (
                            <div key={index} className='px-2' >
                                {
                                    obj.type === "textarea" ? (
                                        <InputTextArea inputName={obj.name} handleChange={HandleChange} labelText={obj.label} value={notifInfo[obj.name]} maxLength={obj.maxLength} placeholder={obj.placeholder} iconType={obj.iconType}  />
                                    ) : 
                                    (
                                        <Input inputName={obj.name} labelText={obj.label} error={err[obj.name]} value={notifInfo[obj.name]} handleChange={HandleChange} placeholder={obj.placeholder} type={obj.type}  /> 
                                    )
                                }
                            </div>
                        )
                    })
                }

                <div className="px-2 flex flex-col gap-2">
                    <InputToggle labelText={"Automate"} inputName={"automate"} value={notifInfo["automate"]}  handleChange={HandleChange} />
                    {
                        notifInfo.automate ? (
                            <DatePick datename={"selectDay"} timename={"selectTime"} labelText={"SelectTime"} valueDate={notifInfo["selectDay"]} valueTime={notifInfo["selectTime"]} handleChange={HandleChange} errorDay={err["selectDay"]} errorTime={err["selectTime"]} minDate={presentDay} />

                        ) : <></>
                    }
                </div>


                <div className="text-white w-full py-2 text-center">
                    <button onClick={HandleCreate} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Create</button>
                </div>
                
            </div>
        </div>

        
    </div>
  )
}

export default AdminCreateNotifs