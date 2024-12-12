import React from 'react'
import IconSelector from './IconSelector'
import { allCookies } from '../UtilityObjs'
import { useCookies } from 'react-cookie'

/**
 * An array of objects containing the name, url and icon of the sidebar
 * links for users.
 * @typedef {Object} userSideBarFormat
 * @property {string} name - The name of the link
 * @property {string} url - The url of the link
 * @property {string} icon - The icon of the link
 */
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
];

/**
 * An array of objects containing the name, url and icon of the sidebar
 * links for admins.
 * @typedef {Object} adminSideBarFormat
 * @property {string} name - The name of the link
 * @property {string} url - The url of the link
 * @property {string} icon - The icon of the link
 */
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
];

/**
 * A functional component that renders the sidebar of the website.
 * 
 * The component renders a sidebar that is either for admins or users based on the
 * type of the user in the cookie. The sidebar contains links to the home page, 
 * events page, admin notification page, admin events page and contact page.
 * @returns {JSX.Element} The rendered JSX element of the sidebar.
 */
const Sidebar = () => {
  const [cookies] = useCookies(allCookies);

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