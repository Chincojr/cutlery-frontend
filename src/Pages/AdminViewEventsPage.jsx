import React from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import IconSelector from '../components/IconSelector/IconSelector'
import AdminViewEvents from '../components/AdminViewEvents/AdminViewEvents'

const AdminViewEventsPage = () => {
  return (
    <div className='h-screen overflow-hidden'>
        <Header />
        <div className="grid lg:grid-cols-[20%_80%] h-full ">
        <div className=" hidden lg:flex ">
            <Sidebar />
        </div>
        <div className="flex overflow-hidden flex-col px-2">
            <div className="w-full flex flex-between items-center">
                <div className="font-bold text-2xl py-4 w-full p-">Events</div>
                <a href="/admin/new/event" className="">
                    <IconSelector type={"Plus"} />
                </a>
            </div>
            <AdminViewEvents />
        </div>
        </div>
    </div>
  )
}

export default AdminViewEventsPage