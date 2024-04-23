import React from 'react'

const UserViewSpecificEvent = ({event}) => {
  return (
    <div>
        
        <div className="flex justify-between items-center py-2">
            <div className="truncate primaryText font-bold text-3xl ">{event.title}</div>
            <div className="text-[12px] italic ">Jan 19th</div>
        </div>
        <div className="  ">{event.caption}</div>

    </div>
  )
}

export default UserViewSpecificEvent