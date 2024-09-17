import React, { useEffect, useState } from 'react'
import { isValidURL } from '../UtilityFunctions'
import Input from './Input/Input'
import InputTextArea from './Input/InputTextArea'
import { CreateNotificationMessage , EditNotificationMessage, adminNotifyErrMessage, allCookies, notifsFormFormat } from '../UtilityObjs'
import Loading from './Loading'
import Notify from './Notify'
import { RequestCreateNotification, RequestEditNotification } from '../RequestFunction'
import { useCookies } from 'react-cookie'
import { useParams } from 'react-router-dom'
import { DexieSpecificGet } from '../DexieDb'


const AdminNotifs = ({userObject}) => {

  let {notifyID} = useParams() 
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [loading, setLoading] = useState()
  const [notify, setNotify] = useState({
    outcome: null,
    message: "",
  })
  const [notifyInfo, setNotifyInfo] = useState({
    title: "",
    caption: "",
    link:""
  })

  const [err, setErr] = useState({
    title: "",
    caption: "",
  })

  const HandleInvalid = (name,value) => {
    let otherErr = {}
    switch (name) {
        case "title":
            if ( !value ) {
                setErr({...err, [name] : adminNotifyErrMessage[name]})
                return true
            }
            break;    
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
    setErr({...err, [name] : "", ...otherErr})
    return false
}

  const HandleChange = (event) => {
    const { name, value } = event.target; 
    setNotifyInfo({
        ...notifyInfo,
        [name]: value,
    });  


    HandleInvalid(name,value)
  }

  const HandleCreate = async() => {

    for (let key in notifyInfo) {
        let check = HandleInvalid(key,notifyInfo[key])
        if (check) {
          console.log(key,notifyInfo[key],check);
          return;
        }
    }

    setLoading(true)
    if (notifyID) {
        var NotifRequest = await RequestEditNotification(notifyInfo)
        var message = EditNotificationMessage
    } else {
        var NotifRequest = await RequestCreateNotification(notifyInfo)
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

    console.log(notifyInfo);

  }

  const HandleDiscard = () => {
    setErr({
        title: "",
        caption: "",
    })
    setNotifyInfo({
        title: "",
        caption: "",
        link:""
    })    
    console.log({notifyInfo});

  }


  useEffect(() => {
    
    const GetSpecificNotify = async() => {
        if (userObject && userObject.Notify && userObject.Notify.length > 0) {
            let specifiedNotification = userObject.Notify.find(notify => notify.systemID === notifyID);
            if (specifiedNotification) {
                setNotifyInfo(specifiedNotification)
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
    <div className='' >

        <div className="w-full flex flex-col justify-center items-center py-2">
            <div className="max-w-[350px] w-full flex gap-2 flex-col">
                {
                    notifsFormFormat.map((obj,index) => {
                        return (
                            <div key={index} className='px-2' >
                                {
                                    obj.type === "textarea" ? (
                                        <InputTextArea inputName={obj.name} handleChange={HandleChange} labelText={obj.label} value={notifyInfo[obj.name]} maxLength={obj.maxLength} placeholder={obj.placeholder} iconType={obj.iconType}  />
                                    ) : 
                                    (
                                        <Input inputName={obj.name} labelText={obj.label} error={err[obj.name]} value={notifyInfo[obj.name]} handleChange={HandleChange} placeholder={obj.placeholder} type={obj.type}  /> 
                                    )
                                }
                            </div>
                        )
                    })
                }

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

export default AdminNotifs