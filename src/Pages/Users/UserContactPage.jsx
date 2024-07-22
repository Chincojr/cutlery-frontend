import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import Sidebar from '../../components/Sidebar/Sidebar'
import ChatMessages from '../../components/ChatMessages/ChatMessages'
import { useEffect } from 'react'

const UserContactPage = ({userObject, userID, onlineUsers}) => {

  console.log("This is user Object admin", userObject);
  const [selectedChat, setSelectedChat] = useState();



  useEffect(() => {
    if (
      userObject &&
      userObject.Admin
    ) {
        setSelectedChat(userObject.Admin)
    }
  }, [userObject])
  

  return (
    <div className='h-screen overflow-hidden flex flex-col relative'>
        <Header />
        <div className="grid lg:grid-cols-[20%_80%] h-full overflow-hidden ">
          <div className=" hidden lg:flex ">
            <Sidebar />
          </div>
          <div className="  grid  overflow-hidden h-full w-full  " >
                {/* <ChatList  setSelectedChat={setSelctedChat} selectedChat={selectedChat} userObject={userObject}  /> */}
                <ChatMessages 
                  userObject={ userObject } 
                  selectedChat={selectedChat} 
                  isAdmin={false} 
                  userID={userID}
                  type={"Admin"}
                  onlineUsers={onlineUsers}
                />
            </div>
        </div>
    </div>
  )
}

export default UserContactPage