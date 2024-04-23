import React, { useState } from 'react'
import Input from '../Input/Input'
import InputTextArea from '../Input/InputTextArea'
import { TodaysDate, getMonthNameWithSuffix, timeCompare } from '../../UtilityFunctions'
import DatePick from '../DatePicker/DatePick'
import InputToggle from '../Input/InputToggle'
import { reminderFormFormat,reminderErrMessage } from '../../UtilityObjs'



const UserCreateReminder = () => {


    let {presentDay,presentTime,presentMonth,presentDayOfMonth} = TodaysDate()

    let { monthName,dayWithSuffix } = getMonthNameWithSuffix(presentMonth,presentDayOfMonth)

    const [reminderInfo, setReminderInfo] = useState({
        title: "",
        caption: "",
        selectDay: presentDay,
        selectTime: presentTime,
        repeat : false,
        week: 1,
        day: 1,
        dayOfWeek : "",
        month: 1,
        year: 1,
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
                    setErr({...err, [name] : reminderErrMessage[name]})
                    return true
                }
                break;    
            case "selectDay":
                if ( !value ) {
                    setErr({...err, [name] : reminderErrMessage[name]})
                    return true
                }

                if (value !== presentDay ) {
                    setErr({...err, ["selectTime"] : ""})
                    return true
                }

                break;   
            case "selectTime":
                if (reminderInfo.selectDay === presentDay) {
                    let checkTime = timeCompare(value,presentTime)
                    if ( !checkTime  ) {
                        setErr({...err, [name] : reminderErrMessage[name]})
                        return true
                    }
                }

                
                break;   
            case "day":

                if ( value > 365  ) {
                    setReminderInfo({
                        ...reminderInfo,
                        [name]: 365
                    })
                }

                if ( value < 1  ) {
                    setReminderInfo({
                        ...reminderInfo,
                        [name]: 1
                    })
                }
                
                break;   

            case "week":

                if ( value > 52  ) {
                    setReminderInfo({
                        ...reminderInfo,
                        [name]: 52
                    })
                }

                if ( value < 1  ) {
                    setReminderInfo({
                        ...reminderInfo,
                        [name]: 1
                    })
                }
                
                break;   

            case "month":

                if ( value > 12  ) {
                    setReminderInfo({
                        ...reminderInfo,
                        [name]: 12
                    })
                }

                if ( value < 1  ) {
                    setReminderInfo({
                        ...reminderInfo,
                        [name]: 1
                    })
                }
                
                break;  

            case "month":

                if ( value > 12  ) {
                    setReminderInfo({
                        ...reminderInfo,
                        [name]: 12
                    })
                }

                if ( value < 1  ) {
                    setReminderInfo({
                        ...reminderInfo,
                        [name]: 1
                    })
                }
                
                break;   

            default:
                return false
                break;
        }



        setErr({...err, [name] : ""})
        return false

    }

  
    const HandleChange = (event) => {
        const { name, value } = event.target; 
        setReminderInfo({
            ...reminderInfo,
            [name]: value,
        });  
        HandleInvalid(name,value)
    }

    const HandleRepeat = (event) => {
        const { name, value,id } = event.target; 
        setReminderInfo({
            ...reminderInfo,
            [name]: id,
        });  
    }

    const HandleCreate = () => {
        let formErr = false

        for (let key in reminderInfo) {
            if (HandleInvalid(key,reminderInfo[key])) {
              formErr = true;
              console.log(key);
              return;
            }
        }

        console.log("success");
    }

    const HandleDiscard = () => {
        setReminderInfo({
            title: "",
            caption: "",
            selectDay: presentDay,
            selectTime: presentTime,
            repeat : false,
            week: 1,
            day: 1,
            dayOfWeek : "",
            month: 1,
            year: 1,
        })


        setErr({
            title: "",
            caption: "",
            selectDay: "",
            selectTime: "",
        })
    }

    
  return (
    <div className='' >

        <div className="w-full flex flex-col justify-center items-center py-2">
            <div className="max-w-[350px] w-full flex gap-2 flex-col">
                {
                    reminderFormFormat.map((obj,index) => {
                        return (
                            <div key={index} className='px-2' >
                                {
                                    obj.type === "textarea" ? (
                                        <InputTextArea inputName={obj.name} handleChange={HandleChange} labelText={obj.label} value={reminderInfo[obj.name]} maxLength={obj.maxLength} placeholder={obj.placeholder} iconType={obj.iconType}  />
                                    ) : 
                                    obj.type === "date" ? (
                                        <>
                                            <div className="w-full border-[1px] my-3 "></div>
                                            <DatePick datename={obj.date} timename={obj.time} labelText={obj.label} valueDate={reminderInfo[obj.date]} valueTime={reminderInfo[obj.time]} handleChange={HandleChange} errorDay={err[obj.date]} errorTime={err[obj.time]} minDate={obj.minDate === "today" ? presentDay : reminderInfo[obj.minDate]} minTime={obj.minTime} />
                                        </>
                                    ) :
                                    (
                                        <Input inputName={obj.name} labelText={obj.label} error={err[obj.name]} value={reminderInfo[obj.name]} handleChange={HandleChange} placeholder={obj.placeholder} type={obj.type}  /> 
                                    )
                                }
                            </div>
                        )
                    })
                }

                <div className="px-2 ">

                    <InputToggle labelText={"Repeat"} inputName={"repeat"} value={reminderInfo["repeat"]}  handleChange={HandleChange} />

                    <div className={` ${reminderInfo["repeat"] ? "flex" : "hidden"} pl-4 py-2 flex-col gap-2`}>
                        <div className="">
                            <div className=" flex gap-2 items-center ">
                                <input type="radio" name="repeat" id="day" checked={reminderInfo.repeat === "day" ? true : false} onChange={HandleRepeat} className=' ' />
                                <label htmlFor="day" className="">Every <input type="number" name="day" id="" value={reminderInfo.day} onChange={HandleChange}  className={` ${reminderInfo.repeat === "day" ? "" : "hidden"} w-[40px] border-b-[1px] border-black text-center outline-none bg-transparent `}/> day</label>
                            </div> 
                            <div className="px-5">
                                <div className={`${reminderInfo.repeat === "day" ? "" : "hidden"} text-[12px] italic font-semibold primaryText `}>This reminder will repeat every {reminderInfo.day} {Number(reminderInfo.day ) > 1 ? "days" : "day" }</div>
                            </div>

                        </div>

                        <div className="">
                            <div className=" flex gap-2 items-center ">
                                <input type="radio" name="repeat" id="week" checked={reminderInfo.repeat === "week" ? true : false} onChange={HandleRepeat} className=' ' />
                                <label htmlFor="week" className="">Every <input type="number" name="week" id="" value={reminderInfo.week} onChange={HandleChange}  className={` ${reminderInfo.repeat === "week" ? "" : "hidden"} w-[40px] border-b-[1px] border-black text-center outline-none bg-transparent `}/> week</label>
                            </div> 
                            <div className="px-5">
                                <div className={`${reminderInfo.repeat === "week" ? "" : "hidden"} text-[12px] italic font-semibold primaryText `}>This reminder will repeat every {Number(reminderInfo.week) > 1 ? `${reminderInfo.week} weeks` : "week"} on {monthName} {dayWithSuffix} </div>
                            </div>
                        </div>

                        <div className="">
                            <div className=" flex gap-2 items-center ">
                                <input type="radio" name="repeat" id="month" checked={reminderInfo.repeat === "month" ? true : false} onChange={HandleRepeat} className=' ' />
                                <label htmlFor="month" className="">Every <input type="number" name="month" id="" value={reminderInfo.month} onChange={HandleChange}  className={` ${reminderInfo.repeat === "month" ? "" : "hidden"} w-[40px] border-b-[1px] border-black text-center outline-none bg-transparent `}/> month</label>
                            </div> 
                            <div className="px-5">
                                <div className={`${reminderInfo.repeat === "month" ? "" : "hidden"} text-[12px] italic font-semibold primaryText `}>This reminder will repeat every {Number(reminderInfo.month) > 1 ? `${reminderInfo.month} months` : "month"} on {monthName} {dayWithSuffix} </div>
                            </div>
                        </div>

                        <div className="">
                            <div className=" flex gap-2 items-center ">
                                <input type="radio" name="repeat" id="year" checked={reminderInfo.repeat === "year" ? true : false} onChange={HandleRepeat} className=' ' />
                                <label htmlFor="year" className="">Every <input type="number" name="year" id="" value={reminderInfo.year} onChange={HandleChange}  className={` ${reminderInfo.repeat === "year" ? "" : "hidden"} w-[40px] border-b-[1px] border-black text-center outline-none bg-transparent `}/> year</label>
                            </div> 
                            <div className="px-5">
                                <div className={`${reminderInfo.repeat === "year" ? "" : "hidden"} text-[12px] italic font-semibold primaryText `}>This reminder will repeat every {Number(reminderInfo.year) > 1 ? `${reminderInfo.year} years` : "year"} on {monthName} {dayWithSuffix} </div>
                            </div>
                        </div>
                    </div>



                </div>

                <div className="text-white w-full py-2 flex items-center justify-center gap-10">
                    <button onClick={HandleDiscard} className="rounded-[20px] outline-none uppercase accent p-2 px-4 text-[14px]">Discard</button>
                    <button onClick={HandleCreate} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Create</button>
                </div>
                
            </div>
        </div>
        
                
    </div>
  )
}

export default UserCreateReminder