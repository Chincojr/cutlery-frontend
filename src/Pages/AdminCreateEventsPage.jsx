import React from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import IconSelector from '../components/IconSelector/IconSelector'
import AdminCreateEvent from '../components/AdminCreateEvent/AdminCreateEvent'
import { useParams } from 'react-router-dom'

const AdminCreateEventsPage = () => {

  let {eventID} = useParams() 

  return (
    <div className='h-screen overflow-hidden flex flex-col '>
        <Header />
        <div className="grid lg:grid-cols-[20%_80%] h-full ">
          <div className=" hidden lg:flex ">
            <Sidebar />
          </div>
          <div className="flex flex-col overflow-auto h-full">
            <a href='/admin/view/events' className="w-full p-2 px-2">
                <IconSelector type={"Arrow"} />
            </a>
            <div className="font-bold text-2xl py-4 w-full text-center">
              {eventID
               ? "Edit" : "Create New"} Event
            </div>
            <AdminCreateEvent />
          </div>
        </div>
    </div>
  )
}

export default AdminCreateEventsPage