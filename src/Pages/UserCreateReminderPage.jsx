import React from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import IconSelector from '../components/IconSelector/IconSelector'
import UserCreateReminder from '../components/UserCreateReminder/UserCreateReminder'

const CreateReminderPage = () => {
  return (
    <div className='h-screen overflow-x-hidden'>
        <Header />
        <div className="grid lg:grid-cols-[20%_80%] h-full ">
            <div className=" hidden lg:flex ">
                <Sidebar />
            </div>
            <div className="flex flex-col">
              <a href='/view/reminders' className="w-full p-2 px-2">
                  <IconSelector type={"Arrow"} />
              </a>
              <div className="font-bold text-2xl py-4 w-full text-center">
                  Create new Reminder
              </div>
              <UserCreateReminder />
          </div>
        </div>
    </div>
  )
}

export default CreateReminderPage