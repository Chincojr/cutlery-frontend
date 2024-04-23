import React, { useState } from 'react'
import IconSelector from '../IconSelector/IconSelector'
import Logo from '../Logo/Logo'
import Sidebar from './Sidebar'

const MobileSidebar = () => {

  const [navBar, setNavBar] = useState(false)
  const [open, setOpen] = useState(false)

  const HandleNavBar = () => {
    setNavBar(!navBar)
    setOpen(true)
  }

  return (
    <div className='lg:hidden'>
      <button onClick={HandleNavBar} className="outline-none bg-transparent">
        <IconSelector type={"Bars"} />
      </button>
      <div className={` ${navBar ? "animate-ToRight translate-x-[0%] " : "animate-ToLeft -translate-x-[100%]"} inset-0 absolute z-[10]  grid-cols-[75%_25%] sm:grid-cols-[35%_65%] ${open ? "grid" : "hidden"} `}>
        <div className="bg-white shadow-2xl ">
            <div className="border-b-[2px] sm:hidden border-[#ecf0f1] py-3 px-2 flex justify-center ">
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