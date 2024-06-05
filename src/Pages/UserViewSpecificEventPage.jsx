import React from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import UserViewSpecificEvent from '../components/UserViewSpecificEvent/UserViewSpecificEvent'


const UserViewSpecificEventPage = () => {
  return (
    <div className='h-screen overflow-hidden flex flex-col '>
        <Header />
        <div className="grid lg:grid-cols-[20%_80%] h-full  ">
            <div className=" hidden lg:flex ">
                <Sidebar />
            </div>
            <UserViewSpecificEvent />
        </div>
    </div>
  )
}

export default UserViewSpecificEventPage