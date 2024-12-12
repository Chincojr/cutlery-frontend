import React from 'react'

/**
 * Notify renders a notification message with a specific outcome.
 * 
 * The color of the notification depends on the outcome.
 * If the outcome is true, the notification is green (secondary), otherwise it is red (accent).
 * The notification is positioned at the top right corner of the screen.
 * The notification is hidden when the message is empty.
 * @param {string} message - The message to display in the notification.
 * @param {boolean} outcome - The outcome of the action that triggered the notification.
 * @returns {JSX.Element} The rendered notification component.
 */
const Notify = ({message,outcome}) => {
  return (
    <div className={`${outcome ? "secondary" :"accent"} text-white absolute z-[9999] max-w-[250px] top-2 right-2 p-1 px-2 rounded shadow-3xl ${message ? "flex" : "hidden"} `} >
        {message} 
    </div>
  )
}

export default Notify