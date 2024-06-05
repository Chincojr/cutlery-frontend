import React from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import IconSelector from '../components/IconSelector/IconSelector'
import AdminViewEvents from '../components/AdminViewEvents/AdminViewEvents'

const AdminViewEventsPage = () => {
  return (
    <div className='flex flex-col h-screen overflow-hidden'>
        <Header />
        <div className="grid lg:grid-cols-[20%_80%] h-full overflow-hidden ">
            <div className=" hidden lg:flex ">
                <Sidebar />
            </div>
            <div className="flex flex-col overflow-hidden p-2">
                <div className="w-full h-fit flex flex-between items-center">
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