import React, { useEffect, useState } from 'react'
import { isValidURL } from '../UtilityFunctions'
import Input from './Input/Input'
import InputTextArea from './Input/InputTextArea'
import { CreateNotificationMessage , EditNotificationMessage, adminNotifyErrMessage, notifsFormFormat } from '../UtilityObjs'
import Loading from './Loading'
import Notify from './Notify'
import { RequestCreateNotification, RequestEditNotification } from '../RequestFunction'
import { useParams } from 'react-router-dom'



const AdminNotifs = ({userObject}) => {

  /**
   * Hook to retrieve notification ID from URL parameters
   * @type {string}
   */
  let { notifyID } = useParams();

  /**
   * State hook for loading status
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  /**
   * State hook for notification outcome and message
   * @type {Object}
   * @property {string|null} outcome - Outcome of the notification
   * @property {string} message - Message of the notification
   */
  const [notify, setNotify] = useState({
    outcome: null,
    message: "",
  });

  /**
   * State hook for notification information
   * @type {Object}
   * @property {string} title - Title of the notification
   * @property {string} caption - Caption of the notification
   * @property {string} link - Link associated with the notification
   */
  const [notifyInfo, setNotifyInfo] = useState({
    title: "",
    caption: "",
    link: "",
  });

  /**
   * State hook for error messages
   * @type {Object}
   * @property {string} title - Error message for the title
   * @property {string} caption - Error message for the caption
   */
  const [err, setErr] = useState({
    title: "",
    caption: "",
  });

  /**
   * Checks if the given value is valid for the given name.
   * @param {string} name - The name of the input field
   * @param {string} value - The value of the input field
   * @returns {boolean} - True if the value is invalid, false if the value is valid
   */
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

  /**
   * Handles the change event of an input field. Updates the notify information
   * state with the new value of the input field. Calls the `HandleInvalid` function
   * to check if the field is invalid and updates the error state accordingly.
   * @param {object} event - The event object triggered by the input field.
   */
  const HandleChange = (event) => {
    const { name, value } = event.target; 
    setNotifyInfo({
        ...notifyInfo,
        [name]: value,
    });  
    HandleInvalid(name,value)
  }

  /**
   * Handles the creation or editing of a notification based on the notify information
   * state. Checks each field for validity and if all fields are valid, sends a request
   * to the server to create or edit the notification. If the request is successful,
   * displays a success message and redirects to the notification list page after a
   * short delay. If the request is unsuccessful, displays an error message.
   */
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

  /**
   * Resets the event information state and clears all error messages.
   * This is called when the user clicks the "Discard" button.
   */
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
  }


  useEffect(() => {
    
    /**
     * Fetches and sets the user's specific notification if available.
     * 
     * This asynchronous function checks if the userObject is defined,
     * contains a Notify property, and if the Notify array has at least
     * one notification. If these conditions are met, it sets the notifyInfo
     * state with the user's specific notification data. If the notification
     * can't be found, it redirects to the home page.
     */
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