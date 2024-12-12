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

/**
 * AdminEvent component for creating and editing events.
 * 
 * This component manages the state and logic for creating a new event or editing an existing one.
 * It handles form field changes, validates input fields, and communicates with the backend to submit
 * event data. The component also manages state for loading and notification messages to provide user
 * feedback during the process. It utilizes URL parameters to determine whether to create a new event
 * or edit an existing one, and fetches specific event data if available.
 * 
 * @param {object} userObject - The object containing user-specific information, including events.
 * @returns {JSX.Element} The rendered component displaying the event form and controls.
 */
const AdminEvent = ({userObject}) => {
 
  /**
   * Retrieves the event ID from the URL parameters.
   * @type {string}
   */
  let { eventID } = useParams();
  
  /**
   * Manages the cookies using the react-cookie hook.
   * @type {Array}
   */
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  
  /**
   * State to store event information.
   * @type {object}
   */
  const [eventInfo, setEventInfo] = useState({
    title: "",
    content: "",
    image: "",
  });
  
  /**
   * State to store error messages for event fields.
   * @type {object}
   */
  const [err, setErr] = useState({
    title: "",
    content: "",
    image: "",
  });
  
  /**
   * State to track the loading status.
   * @type {boolean}
   */
  const [loading, setLoading] = useState();
  
  /**
   * State to manage notification messages.
   * @type {object}
   */
  const [notify, setNotify] = useState({
    outcome: null,
    message: "",
  });




  /**
   * Checks if the given event field is invalid.
   * @param {string} name The name of the event field.
   * @param {string} value The value of the event field.
   * @returns {boolean} True if the field is invalid, false otherwise.
   */
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

  /**
   * Handles the change event of an event field. Updates the event information
   * state with the new value of the field. Calls the `HandleInvalid` function to
   * check if the field is invalid and updates the error state accordingly.
   * @param {object} event - The event object triggered by the event field.
   */
  const HandleChange = (event) => {
    const { name, value } = event.target; 
    setEventInfo({
        ...eventInfo,
        [name]: value,
    });  
    HandleInvalid(name,value)
  }

  /**
   * Handles the change event of the content editor. Updates the event information
   * state with the new value of the content. Calls the `HandleInvalid` function to
   * check if the field is invalid and updates the error state accordingly.
   * @param {string} value - The new value of the content.
   */
  const HandleEditor = (value) => {
    setEventInfo((prevEventInfo) => ({
        ...prevEventInfo,
        "content": value,
      }));
    HandleInvalid("content",value)
  }

/**
 * Handles the creation or editing of an event.
 * Validates the event information and displays error messages if necessary.
 * If an event ID is present, attempts to edit the event; otherwise, attempts to create a new one.
 * Displays a loading indicator during the request and notifies the user of the success or failure
 * of the operation. Redirects to the event view page upon success.
 */
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

  /**
   * Resets the event information state and clears all error messages.
   * This is called when the user clicks the "Discard" button.
   */
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
    
    /**
     * Fetches and sets the user's specific event if available.
     * 
     * This asynchronous function checks if the userObject is defined,
     * contains an Event property, and if the Event array has at least
     * one event. If these conditions are met, it sets the event state with
     * the user's specific event data. If the event can't be found, it
     * redirects to the home page.
     */
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