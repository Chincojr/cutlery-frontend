import React from 'react'
import MobileSidebar from './MobileSidebar'
import Logo from './Logo'
import ProfilePicture from './ProfilePicture'
import Notifications from './Notifications'
import TopBar from './TopBar'


/**
 * The Header component, displays the top bar, logo, and navigation links.
 * 
 * The component takes in three props: `displaySideBar`, `userObject`, and `logged`. `displaySideBar` determines whether the sidebar is displayed. `userObject` is the user object containing the user's information. `logged` determines whether the user is logged in or not.
 * If the user is logged in, the component renders the TopBar, the logo, and the navigation links. If the user is not logged in, the component renders the logo and a login link.
 * @param {boolean} displaySideBar - Whether to display the sidebar
 * @param {object} userObject - The object containing the user's information
 * @param {boolean} logged - Whether the user is logged in or not
 * @returns {ReactElement} The JSX element of the header
 */
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