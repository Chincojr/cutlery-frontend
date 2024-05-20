import React from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import UserViewEvents from '../components/UserViewEvents/UserViewEvents'

const UserViewEventsPage = () => {
  return (
    <div className='h-screen overflow-hidden grid grid-rows-[11%_89%] '>
        <Header />
        <div className="grid lg:grid-cols-[20%_80%] h-full  ">
            <div className=" hidden lg:flex ">
                <Sidebar />
            </div>
            <div className="flex flex-col h-full overflow-hidden  ">
              <div className="w-full flex flex-between items-center px-2">
                  <div className="font-bold text-2xl py-4 w-full p-">Upcoming Events</div>
              </div>
              <UserViewEvents />
            </div>
        </div>
    </div>
  )
}

export default UserViewEventsPage