import React from 'react'

const Notify = ({message,outcome}) => {
  return (
    <div className={`${outcome ? "secondary" :"accent"} text-white absolute z-[9999] max-w-[250px] top-2 right-2 p-1 px-2 rounded shadow-3xl ${message ? "flex" : "hidden"} `} >
        {message} 
    </div>
  )
}

export default Notify