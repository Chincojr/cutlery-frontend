import React from 'react'
import IconSelector from '../IconSelector/IconSelector'


const Notifications = () => {
  return (
    <div className='relative' >
        <a href="/notifications" className="">
            <IconSelector type={"Notify"} />
            <div className="rounded-full h-[5px] w-[5px] accent absolute top-[2px] right-0 ">

            </div>
        </a>

    </div>
  )
}

export default Notifications