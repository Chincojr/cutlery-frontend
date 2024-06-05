import React, { useEffect, useState } from 'react'
import { TodaysDate, isValidURL, timeCompare } from '../../UtilityFunctions'
import DatePick from '../DatePicker/DatePick'
import Input from '../Input/Input'
import InputTextArea from '../Input/InputTextArea'
import { CreateNotificationMessage , EditNotificationMessage, adminNotifyErrMessage, allCookies, notifsFormFormat } from '../../UtilityObjs'
import InputToggle from '../Input/InputToggle'
import Loading from '../Loading/Loading'
import Notify from '../Notify/Notify'
import { RequestCreateNotification, RequestEditNotification } from '../../RequestFunction'
import { useCookies } from 'react-cookie'
import { useParams } from 'react-router-dom'
import { DexieSpecificGet } from '../../DexieDb'


const AdminCreateNotifs = () => {

  let {presentDay,presentTime} = TodaysDate()
  let {notifyID} = useParams() 
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [loading, setLoading] = useState()
  const [notify, setNotify] = useState({
    outcome: null,
    message: "",
    admin: cookies.adminUid

  })
  const [notifInfo, setNotifInfo] = useState({
    title: "",
    caption: "",
    selectDay: presentDay,
    selectTime: presentTime,
    automate : false,
    link:""
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
        case "selectDay":
            if (notifInfo.automate) {
                if ( !value ) {
                    setErr({...err, [name] : adminNotifyErrMessage[name]})
                    return true
                }
                if (value !== presentDay ) {
                    setErr({...err, ["selectTime"] : ""})
                    return true
                }
            }
            break;   
        case "selectTime":
            if (notifInfo.automate) {
                if (notifInfo.selectDay === presentDay) {
                    let checkTime = timeCompare(value,presentTime)
                    if ( !checkTime  ) {
                        setErr({...err, [name] : adminNotifyErrMessage[name]})
                        return true
                    }
                }
            }

            break
        case "link":
            if ( value && isValidURL(value) ) {
                setErr({...err, [name] : adminNotifyErrMessage[name]})
                return true
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
    setNotifInfo({
        ...notifInfo,
        [name]: value,
    });  


    HandleInvalid(name,value)
  }

  const HandleCreate = async() => {

    for (let key in notifInfo) {
        let check = HandleInvalid(key,notifInfo[key])
        if (check) {
          console.log(key,notifInfo[key],check);
          return;
        }
    }

    // change the selectTime and the selectDay to NULL if the automate buttoon is off
    let modifiedNotifInfo = notifInfo
    if (!notifInfo.automate) {
        modifiedNotifInfo = {...notifInfo, selectDay : "", selectTime : ""}
    }

    console.log(JSON.stringify({obj:notifInfo,admin:cookies.adminUid}));
    setLoading(true)
    if (notifyID) {
        var NotifRequest = await RequestEditNotification(modifiedNotifInfo,cookies.adminUid)
        var message = EditNotificationMessage
    } else {
        var NotifRequest = await RequestCreateNotification(modifiedNotifInfo,cookies.adminUid)
        var message = CreateNotificationMessage
    }
    setLoading(false)


    if (NotifRequest) {
        setNotify({
            outcome: true,
            message: message["success"]
        })
        window.location.href = "/admin/view/notify"
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
    console.log(modifiedNotifInfo);

    console.log(notifInfo);

  }

  const HandleDiscard = () => {
    setErr({
        title: "",
        caption: "",
        selectDay: "",
        selectTime: "",
    })
    setNotifInfo({
        title: "",
        caption: "",
        selectDay: presentDay,
        selectTime: presentTime,
        automate : false,
        link:""
    })    
    console.log({notifInfo});

  }


  useEffect(() => {
    
    const GetSpecificNotify = async() => {
        let specificNotify = await DexieSpecificGet("Notify",notifyID)
        if (specificNotify && specificNotify.length === 1) {
            setNotifInfo(specificNotify[0])
        } else {
            window.location.href = "/"
        }

    }
    if (notifyID) {
        GetSpecificNotify();
    }
    

  }, [])



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


                <div className="text-white w-full py-2 flex items-center justify-center gap-10">
                    <button onClick={HandleDiscard} className="rounded-[20px] outline-none uppercase accent p-2 px-4 text-[14px]">Discard</button>
                    <button onClick={HandleCreate} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">{notifyID ? "Edit" : "Create"}</button>
                </div>
                
            </div>
        </div>
        <Notify outcome={notify.outcome} message={notify.message} />
        <Loading loading={loading}  />
    </div>
  )
}

export default AdminCreateNotifs