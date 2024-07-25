import React from 'react'
import Header from '../../components/Header/Header'
import Sidebar from '../../components/Sidebar/Sidebar'
import IconSelector from '../../components/IconSelector/IconSelector'
import UserCreateReminder from '../../components/UserCreateReminder/UserCreateReminder'
import { useParams } from 'react-router-dom'

const UserCreateReminderPage = ({userObject, userID}) => {

  let {reminderID} = useParams() 

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
              {reminderID ? "Edit" : "Create New"} Reminder
              </div>
              <UserCreateReminder userID={userID} userObject={userObject}  />
          </div>
        </div>
    </div>
  )
}

export default UserCreateReminderPage