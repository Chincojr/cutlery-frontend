import React from 'react'
import ChatList from '../../components/ChatsList/ChatList'
import Header from '../../components/Header/Header'
import Sidebar from '../../components/Sidebar/Sidebar'

const AdminPage = () => {
  return (
    <div className='h-screen overflow-hidden'>
        <Header />
        <div className="grid lg:grid-cols-[20%_80%] h-full ">
          <div className=" hidden lg:flex ">
            <Sidebar />
          </div>
          <ChatList />
        </div>
    </div>
  )
}

export default AdminPage