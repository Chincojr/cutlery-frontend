import React from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import AdminCreateNotifs from '../components/AdminCreateNotifs/AdminCreateNotifs'
import IconSelector from '../components/IconSelector/IconSelector'



const AdminCreateNotifPage = () => {
  return (
    <div className='h-screen overflow-hidden grid grid-rows-[11%_89%] '>
        <Header />
        <div className="grid lg:grid-cols-[20%_80%] h-full ">
          <div className=" hidden lg:flex ">
            <Sidebar />
          </div>
          <div className="flex flex-col overflow-auto h-full">
            <a href='/admin/view/notify' className="w-full p-2 px-2">
                <IconSelector type={"Arrow"} />
            </a>
            <div className="font-bold text-2xl py-4 w-full text-center">
                Create New Notification
            </div>
            <AdminCreateNotifs />
          </div>
        </div>
    </div>
  )
}

export default AdminCreateNotifPage