import React from 'react'
import IconSelector from './IconSelector'
import { allCookies } from '../UtilityObjs'
import { useCookies } from 'react-cookie'

const userSideBarFormat = [

  {
    name : "Home",
    url : "/",
    icon : "Home",
  },
  {
    name : "Events",
    url : "/view/events",
    icon : "Event",
  },
  {
    name : "Contact",
    url : "/contact",
    icon : "Msgs",
  },

]

const adminSideBarFormat = [
  {
    name : "Home",
    url : "/",
    icon : "Home",
  },
  {
    name : "Events",
    url : "/view/events",
    icon : "Event",
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
  {
    name : "Contact",
    url : "/admin/view/msg",
    icon : "Msgs",
  },
]

const Sidebar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);

  return (
    <div className='flex flex-col sm:border-r-[2px] px-[10%] py-3 w-full ' >

        {
          cookies.type === "Admin" ?
            adminSideBarFormat.map((obj,index) => {
              return (
                <a href={obj.url} key={index} className="">
                  <div className="flex items-center gap-5 py-2 ">
                      <IconSelector type={obj.icon} />
                      <div className="">{obj.name}</div>
                  </div>
                </a>

              )
            })
          : 
            userSideBarFormat.map((obj,index) => {
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