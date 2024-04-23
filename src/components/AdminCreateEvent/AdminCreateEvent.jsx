import React, { useState } from 'react'
import Input from '../Input/Input'
import InputTextArea from '../Input/InputTextArea'
import InputImage from '../Input/InputImage';
import { adminEventErrMessage, eventFormFomart } from '../../UtilityObjs';


const AdminCreateEvent = () => {
 
  const [eventInfo, setEventInfo] = useState({
    title: "",
    caption: "",
    image: "",
  })

  const [err, setErr] = useState({
    title: "",
    caption: "",
    image : ""
  })

  const HandleInvalid = (name,value) => {

    switch (name) {
        case "title":
            if ( !value ) {
                setErr({...err, [name] : adminEventErrMessage[name]})
                return true
            }
            break;     
        case "image":
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

  const HandleCreate = () => {
    let formErr = false

    for (let key in eventInfo) {
        if (HandleInvalid(key,eventInfo[key])) {
          formErr = true;
          console.log(key);
          return;
        }
    }
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
                    <button onClick={HandleCreate} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Create</button>
                </div>
                
            </div>
        </div>


    </div>
  )
}

export default AdminCreateEvent