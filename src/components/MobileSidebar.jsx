import React, { useState } from 'react'
import IconSelector from './IconSelector'
import Logo from './Logo'
import Sidebar from './Sidebar'

/**
 * MobileSidebar component for rendering a mobile-friendly sidebar with toggling functionality.
 * 
 * This component displays a button to toggle the visibility of the sidebar. When the button is clicked,
 * the sidebar slides in and out of view, providing a smooth animation effect. The component uses state
 * hooks to manage the visibility of the navigation bar and whether the sidebar is open or closed. The
 * sidebar includes a logo and links rendered by the Sidebar component.
 * 
 * @param {boolean} display - Controls whether the sidebar is visible or hidden on larger screens.
 * @returns {JSX.Element} The rendered mobile sidebar component.
 */
const MobileSidebar = ({display}) => {

  const [navBar, setNavBar] = useState(false)
  const [open, setOpen] = useState(false)

  /**
   * Toggles the navigation bar's visibility state.
   * Sets the `navBar` state to its opposite value and ensures the sidebar is open by setting `open` to true.
   */
  const HandleNavBar = () => {
    setNavBar(!navBar)
    setOpen(true)
  }

  return (
    <div className={` ${display ? "" : " lg:hidden "}`}>
      <button onClick={HandleNavBar} className="outline-none bg-transparent">
        <IconSelector type={"Bars"} />
      </button>
      <div className={` ${navBar ? "animate-ToRight translate-x-[0%] " : "animate-ToLeft -translate-x-[100%]"} inset-0 absolute z-[10]  grid-cols-[300px_auto]  ${open ? "grid" : "hidden"} `}>

        <div className="bg-white shadow-2xl ">
            <div className="border-b-[2px] border-[#ecf0f1] p-2 flex justify-center ">
              <a href='/' className="h-[50px] flex">
                <Logo />
              </a>
            </div>
            <Sidebar />
        </div>

        <button onClick={HandleNavBar} className="">
          
        </button>
      </div>
    </div>
  )
}

export default MobileSidebar