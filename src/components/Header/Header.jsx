import React from 'react'
import MobileSidebar from '../Sidebar/MobileSidebar'
import Logo from '../Logo/Logo'
import ProfilePicture from '../ProfilePicture/ProfilePicture'
import Notifications from '../Notifications/Notifications'
import { useCookies } from 'react-cookie'
import { allCookies } from '../../UtilityObjs'
import AllowNotification from '../AllowNotification/AllowNotification'


const Header = ({displaySideBar}) => {
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);

  return (
    <div className='flex flex-col   '>
          {
            cookies.log && cookies.uid ?
            <AllowNotification />
            :
            cookies.log && cookies.adminUid ?
            <AllowNotification />
            : <></>
          }
          <div className="p-2 border-b-[2px]  border-[#ecf0f1] flex items-center justify-between ">
              {
                cookies.log && cookies.uid ?
                <>
                    <MobileSidebar display={displaySideBar} />

                    <a href='/' className="h-[50px] flex">
                      <Logo />
                    </a>

                    <div className="flex gap-1">
                      <ProfilePicture />
                      <Notifications />
                    </div>
                </> 
                :  cookies.log && cookies.adminUid ?
                <>
                    <MobileSidebar display={displaySideBar} />

                    <a href='/' className="h-[50px] flex">
                      <Logo />
                    </a>

                    <div className="flex gap-1">
                      <ProfilePicture />
                      <Notifications />
                    </div>
                </> 
                :
                <>

                    <a href='/' className="h-[50px] flex">
                      <Logo />
                    </a>
                  
                  <div className="">
                    <ProfilePicture link="/login" />
                  </div>

                </>
              }
          </div>


    </div>
  )
}

export default Header