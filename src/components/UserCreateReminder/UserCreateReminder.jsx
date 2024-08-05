import React, { useEffect, useState } from 'react'
import Input from '../Input/Input'
import InputTextArea from '../Input/InputTextArea'
import { TodaysDate } from '../../UtilityFunctions'
import DatePick from '../DatePicker/DatePick'
import InputToggle from '../Input/InputToggle'
import { reminderFormFormat,reminderErrMessage, allCookies, CreateRemindersMessage, EditRemindersMessage } from '../../UtilityObjs'
import Notify from '../Notify/Notify'
import Loading from '../Loading/Loading'
import { useCookies } from 'react-cookie'
import { RequestCreateReminder, RequestEditReminder } from '../../RequestFunction'
import { useParams } from 'react-router-dom'

const RepeatFunctions = {
    day:{
        singular : "day",
        plural: "days"
    },
    week:{
        singular : "week",
        plural: "weeks"
    },
    year:{
        singular : "year",
        plural: "years"
    },
    month:{
        singular : "month",
        plural: "months"
    }
}

const UserCreateReminder = ({userObject, userID}) => {

    let {reminderID} = useParams() 
    const [loading, setLoading] = useState()
    const [notify, setNotify] = useState({
      outcome: null,
      message: ""
    })
    const [cookies, setCookie, removeCookie] = useCookies(allCookies);
    let {presentDay} = TodaysDate()
    const [reminderInfo, setReminderInfo] = useState({
        title: "",
        caption: "",
        selectDay: presentDay,
        repeatState : false,
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
                break;   
            case "day":
                value = Number(value)
                if ( value > 365  ) {
                    setReminderInfo({
                        ...reminderInfo,
                        [name]: 365
                    })
                }
                break;   
            case "week":
                value = Number(value)
                if ( value > 52  ) {
                    setReminderInfo({
                        ...reminderInfo,
                        [name]: 52
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
                break;  
            case "year":
                value = Number(value)
                if ( value > 10  ) {
                    setReminderInfo({
                        ...reminderInfo,
                        [name]: 10
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

    const HandleCreate = async() => {
        let formErr = false

        for (let key in reminderInfo) {
            if (HandleInvalid(key,reminderInfo[key])) {
              formErr = true;
              console.log(key);
              return;
            }
        }

        let modifiedReminderInfo 
        if (typeof reminderInfo.repeatState === "boolean") {
            modifiedReminderInfo = {
                title :reminderInfo.title,
                caption: reminderInfo.caption,
                selectDay: reminderInfo.selectDay,
                admin: userID,
                repeatState:false,
                isAdmin: cookies.uid ? false : true 
            }
        } else {
            modifiedReminderInfo = {
                title :reminderInfo.title,
                caption: reminderInfo.caption,
                selectDay: reminderInfo.selectDay,
                admin: userID,
                repeatState:reminderInfo.repeatState,
                [reminderInfo.repeatState]:reminderInfo[reminderInfo.repeatState],
                isAdmin: cookies.uid ? false : true 
            }
        }

        



        console.log(JSON.stringify({obj:modifiedReminderInfo,admin:cookies.uid}));
        setLoading(true)
        if (reminderID) {
            modifiedReminderInfo = {
                ...modifiedReminderInfo,
                systemID :reminderInfo.systemID
            }
            var ReminderRequest = await RequestEditReminder(modifiedReminderInfo,userID)
            var message = EditRemindersMessage
        } else {
            var ReminderRequest = await RequestCreateReminder(modifiedReminderInfo)
            var message = CreateRemindersMessage
        }
        setLoading(false)

        if (ReminderRequest) {
            setNotify({
                outcome: true,
                message: message["success"]
            })
            window.location.href = "/view/reminders"
        }else {
            setNotify({
                outcome: false,
                message: message["failure"]
            })
        }
    
        setTimeout(() => {
            setNotify({
                outcome: null,
                message: ""
              })
          }, 2000);

        console.log(modifiedReminderInfo);
    }

    const HandleDiscard = () => {
        setReminderInfo({
            title: "",
            caption: "",
            selectDay: presentDay,
            repeatState : false,
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
        })
    }

    const HandleBlur = (event) => {
        let {value,name} = event.target

        if (!value || Number(value) < 1) {
            setReminderInfo({
                ...reminderInfo,
                [name]: 1
            })
        }

    }

    useEffect(() => {
    
        const GetSpecificReminder = async() => {
            
            if (
                userObject && 
                userObject.Reminders && 
                userObject.Reminders.length > 0                
            ) {
                let specificReminder = userObject.Reminders.filter(reminder => reminder.systemID === reminderID )
                if (specificReminder.length === 1) {
                    setReminderInfo(specificReminder[0])
                } else {
                    window.location.href = "/"

                }
            }
    
        }
        if (reminderID) {
            GetSpecificReminder();
        }
    
    }, [userObject])

    
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
                                            <DatePick datename={obj.date}  labelText={obj.label} valueDate={reminderInfo[obj.date]}handleChange={HandleChange} errorDay={err[obj.date]} minDate={obj.minDate === "today" ? presentDay : reminderInfo[obj.minDate]} />
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

                    <InputToggle labelText={"Repeat"} inputName={"repeatState"} value={reminderInfo["repeatState"]}  handleChange={HandleChange} />

                    <div className={` ${reminderInfo["repeatState"] ? "flex" : "hidden"} pl-4 py-2 flex-col gap-2`}>
                        {

                            Object.keys(RepeatFunctions).map((func, index) => {
                                return(
                                    <div key={index} className="">
                                        <div className=" flex gap-2 items-center ">
                                            <input type="radio" name="repeatState" id={func} checked={reminderInfo.repeatState === func ? true : false} onChange={HandleRepeat} className=' ' />
                                            <label htmlFor={func} className="">Every <input type="number" name={func} id="" value={reminderInfo[func]} onChange={HandleChange} onBlur={HandleBlur} className={` ${reminderInfo.repeatState === func ? "" : "hidden"} w-[40px] border-b-[1px] border-black text-center outline-none bg-transparent `}/> {func}</label>
                                        </div> 
                                        <div className="px-5">
                                            <div className={`${reminderInfo.repeatState === func ? "" : "hidden"} text-[12px] italic font-semibold primaryText `}>This reminder will repeat every {reminderInfo[func]} {Number(reminderInfo[func] ) > 1 ? RepeatFunctions[func].plural : RepeatFunctions[func].singular }</div>
                                        </div>
            
                                    </div>
                                )
                            })

                        }
                    </div>

                </div>

                <div className="text-white w-full py-2 flex items-center justify-center gap-10">
                    <button onClick={HandleDiscard} className="rounded-[20px] outline-none uppercase accent p-2 px-4 text-[14px]">Discard</button>
                    <button onClick={HandleCreate} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Create</button>
                </div>
                
            </div>
        </div>
        <Notify outcome={notify.outcome} message={notify.message} />
        <Loading loading={loading}  />
                
    </div>
  )
}

export default UserCreateReminder