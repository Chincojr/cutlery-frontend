import React from 'react'
import IconSelector from '../IconSelector/IconSelector'

const sideBarFormat = [
  {
    name : "Home",
    url : "/",
    icon : "Home",
  },
  {
    name : "Reminders",
    url : "/view/reminders",
    icon : "Reminder",
  },
  {
    name : "Admin Notification",
    url : "/admin/view/notify",
    icon : "CreateNotify",
  },
  {
    name : "Admin Events",
    url : "/admin/view/events",
    icon : "CreateEvent",
  },
]

const Sidebar = () => {
  return (
    <div className='flex flex-col sm:border-r-[2px] px-[10%] py-3 w-full ' >
        {
          sideBarFormat.map((obj,index) => {
            return (
              <a href={obj.url} key={index} className="">
                <div className="flex items-center gap-5 py-2 ">
                    <IconSelector type={obj.icon} />
                    <div className="">{obj.name}</div>
                </div>
              </a>

            )
          })
        }
    </div>
  )
}

export default Sidebar