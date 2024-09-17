import React from 'react'
import MobileSidebar from './MobileSidebar'
import Logo from './Logo'
import ProfilePicture from './ProfilePicture'
import Notifications from './Notifications'
import TopBar from './TopBar'


const Header = ({displaySideBar, userObject,logged}) => {

  return (
    <div className='flex flex-col'>
          {
            logged ?
            <TopBar userObject={userObject} logged={logged} />
            : <></>
          }
          <div className="p-2 border-b-[2px]  border-[#ecf0f1] flex items-center justify-between ">
              {
                logged ?
                <>
                    <MobileSidebar display={displaySideBar} />

                    <a href='/' className="h-[50px] flex">
                      <Logo />
                    </a>

                    <div className="flex gap-1">
                      <ProfilePicture />
                      <Notifications userObject={userObject} />
                    </div>
                </> 
                :
                <>

                  <a href='/' className="h-[50px] flex">
                    <Logo />
                  </a>
                  
                  <a href='/login' className="text-white primary px-3 py-2 rounded ">
                    Login
                  </a>

                </>
              }
          </div>


    </div>
  )
}

export default Header