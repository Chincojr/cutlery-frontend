import React, { useState } from 'react'
import IconSelector from './IconSelector'
import Logo from './Logo'
import Sidebar from './Sidebar'

const MobileSidebar = ({display}) => {

  const [navBar, setNavBar] = useState(false)
  const [open, setOpen] = useState(false)

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