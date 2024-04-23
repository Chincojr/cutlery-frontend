import React from 'react'
import MobileSidebar from '../Sidebar/MobileSidebar'
import Logo from '../Logo/Logo'
import ProfilePicture from '../ProfilePicture/ProfilePicture'
import Notifications from '../Notifications/Notifications'

const Header = () => {
  return (
    <div className='flex justify-between p-2 py-2 border-b-[2px] border-[#ecf0f1] items-center '>
        <MobileSidebar />
        <a href='/' className="h-[50px] flex">
          <Logo />
        </a>
        <div className="flex gap-1">
          <ProfilePicture />
          <Notifications />
        </div>
    </div>
  )
}

export default Header