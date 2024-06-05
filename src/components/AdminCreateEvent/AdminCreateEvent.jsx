import React, { useEffect, useState } from 'react'
import Input from '../Input/Input'
import InputTextArea from '../Input/InputTextArea'
import InputImage from '../Input/InputImage';
import { CreateEventMessage , EditEventMessage, adminEventErrMessage, allCookies, eventFormFomart } from '../../UtilityObjs';
import { RequestCreateEvent, RequestEditEvent } from '../../RequestFunction';
import Notify from '../Notify/Notify';
import Loading from '../Loading/Loading';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { DexieSpecificGet } from '../../DexieDb';


const AdminCreateEvent = () => {
 
  let {eventID} = useParams() 
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [eventInfo, setEventInfo] = useState({
    title: "",
    content: "",
    image: "",
    admin: cookies.adminUid
  })
  const [err, setErr] = useState({
    title: "",
    content: "",
    image : ""
  })
  const [loading, setLoading] = useState()
  const [notify, setNotify] = useState({
    outcome: null,
    message: ""
  })

  const HandleInvalid = (name,value) => {

    switch (name) {
        case "title":
            if ( !value ) {
                setErr({...err, [name] : adminEventErrMessage[name]})
                return true
            }
            break;   
        case "content":
            if ( !value ) {
                setErr({...err, [name] : adminEventErrMessage[name]})
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
    setEventInfo({
        ...eventInfo,
        [name]: value,
    });  

    HandleInvalid(name,value)

  }

  const HandleCreate = async() => {
    let formErr = false

    for (let key in eventInfo) {
        if (HandleInvalid(key,eventInfo[key])) {
          formErr = true;
          console.log(key);
          return;
        }
    }

    console.log(JSON.stringify({obj:eventInfo,admin:cookies.adminUid}));

    // return
    setLoading(true)
    if (eventID) {
        var EventRequest = await RequestEditEvent(eventInfo,cookies.adminUid)
        var message = EditEventMessage
    } else {
        var EventRequest = await RequestCreateEvent(eventInfo)
        var message = CreateEventMessage
    }
    setLoading(false)


    if (EventRequest) {
        setNotify({
            outcome: true,
            message: message["success"]
        })
        window.location.href = "/admin/view/events"
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
    console.log(eventInfo);

  }

  const HandleDiscard = () => {
    setEventInfo({
        title: "",
        caption: "",
        image: "",
    })

    setErr({
        title: "",
        caption: "",
        image: "",
    })
  }

  useEffect(() => {
    
    const GetSpecificEvent = async() => {
        let specificEvent = await DexieSpecificGet("Event",eventID)
        if (specificEvent && specificEvent.length === 1) {
            let specifiedEvent = specificEvent[0]
            if (specifiedEvent.image) {
                specifiedEvent.image = process.env.REACT_APP_IMAGE_URL + specifiedEvent.image
            }
            setEventInfo(specifiedEvent)
        } else {
            window.location.href = "/"
        }
    }

    if (eventID) {
        GetSpecificEvent();
    }

    

  }, [])

  return (
    <div className='' >

        <div className="w-full flex flex-col justify-center items-center py-2">
            <div className="max-w-[350px] w-full flex gap-2 flex-col">
                {
                    eventFormFomart.map((obj,index) => {
                        return (
                            <div key={index} className='px-2' >
                                {
                                    obj.type === "textarea" ? (
                                        <InputTextArea inputName={obj.name} handleChange={HandleChange} labelText={obj.label} value={eventInfo[obj.name]} maxLength={obj.maxLength} placeholder={obj.placeholder} iconType={obj.iconType}  />
                                    ) : 
                                    obj.type === "image" ? (
                                        <InputImage name={obj.name} setInfo={setEventInfo} info={eventInfo} error={err[obj.name]} handleInvalid={HandleInvalid} />
                                    ) : (
                                        <Input inputName={obj.name} labelText={obj.label} error={err[obj.name]} value={eventInfo[obj.name]} handleChange={HandleChange} placeholder={obj.placeholder} type={obj.type}  /> 
                                    )
                                }
                            </div>
                        )
                    })
                }
                <div className="text-white w-full py-2 flex items-center justify-center gap-10">
                    <button onClick={HandleDiscard} className="rounded-[20px] outline-none uppercase accent p-2 px-4 text-[14px]">Discard</button>
                    <button onClick={HandleCreate} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">{eventID ? "Edit" : "Create"}</button>
                </div>
                
            </div>
        </div>
        <Notify outcome={notify.outcome} message={notify.message} />
        <Loading loading={loading}  />
    </div>
  )
}

export default AdminCreateEvent