import React from 'react'
import Header from '../../components/Header/Header'
import Sidebar from '../../components/Sidebar/Sidebar'
import IconSelector from '../../components/IconSelector/IconSelector'
import UserViewReminder from '../../components/UserViewReminder/UserViewReminder'

const ViewReminderPage = ({userObject}) => {
  return (
    <div className='h-screen overflow-hidden flex flex-col '>
        <Header userObject={userObject} />
        <div className="grid lg:grid-cols-[20%_80%] h-full  ">
            <div className=" hidden lg:flex ">
                <Sidebar />
            </div>
            <div className="flex flex-col px-2 h-full overflow-hidden  ">
              <div className="w-full flex flex-between items-center">
                  <div className="font-bold text-2xl py-4 w-full p-">Reminders</div>
                  <a href="/new/reminder" className="">
                      <IconSelector type={"Plus"} />
                  </a>
              </div>
              <UserViewReminder />
            </div>
        </div>
    </div>
  )
}

export default ViewReminderPage