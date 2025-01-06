import React from 'react'
import IconSelector from './IconSelector';

const UnavailableMessage = {
  Reminders: {
    iconType: "NoReminders",
    text: "No reminders"
  },
  Events: {
    iconType: "Event",
    text: "No events"
  },
  Notify: {
    iconType: "NoNotify",
    text: "No Notification"
  },
  Msg: {
    iconType: "NoMsg",
    text: "No message"
  },
  SelectMsg: {
    iconType: "Msgs",
    text: "Select Chat"
  },
  Offline: {
    iconType: "Offline",
    text: "You are Offline"
  },
  Users: {
    iconType: "Users",
    text: "No User"
  }
}



const Unavailable = ({type}) => {
  return (
    <div className="flex flex-col items-center gap-2 h-full justify-center py-5 w-full col-span-full">
        <IconSelector type={UnavailableMessage[type].iconType} size={150} />
        <div className="italic text-lightgray"> {UnavailableMessage[type].text} </div>
    </div>
  )
}

export default Unavailable