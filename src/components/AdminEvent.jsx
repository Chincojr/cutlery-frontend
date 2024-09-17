import React, { useEffect, useState } from 'react'
import Input from './Input/Input'
import InputImage from './Input/InputImage';
import { CreateEventMessage , EditEventMessage, adminEventErrMessage, allCookies } from '../UtilityObjs';
import { RequestCreateEvent, RequestEditEvent } from '../RequestFunction';
import Notify from './Notify';
import Loading from './Loading';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import InputEditor from './Input/InputEditor';

const eventFormFomart = [
    {
        name : "image",
        label : "Select Image",
        type: "image",
    },
    {
        name : "title",
        label : "Title",
        type: "text",
        placeholder: "Enter Title..."
    },
    {
        name : "content",
        label : "Content",
        type: "editor",
        placeholder: "Enter content...",
        maxLength: 1500,
    }
]

const AdminEvent = ({userObject}) => {
 
  let {eventID} = useParams() 
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [eventInfo, setEventInfo] = useState({
    title: "",
    content: "",
    image: "",
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

  const HandleEditor = (value) => {
    setEventInfo((prevEventInfo) => ({
        ...prevEventInfo,
        "content": value,
      }));
    

    HandleInvalid("content",value)

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

    // return
    setLoading(true)
    console.log("Edit Event: ",eventInfo);    
    if (eventID) {
        var EventRequest = await RequestEditEvent(eventInfo)
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
        if (userObject && userObject.Event && userObject.Event.length > 0) {
            let specifiedEvent = userObject.Event.find(event => event.systemID === eventID);
            if (specifiedEvent) {
                setEventInfo(specifiedEvent)
            } else {
                window.location.href = "/"
            }
        }
    }

    if (eventID) {
        GetSpecificEvent();
    }

  }, [userObject])

  

  

  return (
    <div className='overflow-hidden py-2 h-full'>
            <div className="w-full flex gap-2 flex-col items-center overflow-auto h-full ">                
                {
                    eventFormFomart.map((obj,index) => {                        
                        return (
                            <div key={index} className={` px-2  ${obj.type !== "image" ? "w-full" : "max-w-[350px]"}`} >
                                {
                                    obj.type === "editor" ? (
                                        <InputEditor value={eventInfo[obj.name]} onChange={HandleEditor} error={err[obj.name]} />
                                    ) : 
                                    obj.type === "image" ? (
                                        <InputImage name={obj.name} setInfo={setEventInfo} info={eventInfo} error={err[obj.name]} handleInvalid={HandleInvalid} />
                                    ) : (
                                        <div className="px-[10%]">
                                            <div className="max-w-[350px]">
                                                <Input inputName={obj.name} labelText={obj.label} error={err[obj.name]} value={eventInfo[obj.name]} handleChange={HandleChange} placeholder={obj.placeholder} type={obj.type}  /> 
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                }
                <div className="text-white w-full  flex items-center justify-center gap-10">
                    <button onClick={HandleDiscard} className="rounded-[20px] outline-none uppercase accent p-2 px-4 text-[14px]">Discard</button>
                    <button onClick={HandleCreate} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">{eventID ? "Edit" : "Create"}</button>
                </div>
                
            </div>
        <Notify outcome={notify.outcome} message={notify.message} />
        <Loading loading={loading}  />
    </div>
  )
}

export default AdminEvent