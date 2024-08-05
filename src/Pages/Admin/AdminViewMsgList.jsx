import React, { useState } from 'react'
import ChatList from '../../components/ChatsList/ChatList'
import Header from '../../components/Header/Header'
import Sidebar from '../../components/Sidebar/Sidebar'
import ChatMessages from '../../components/ChatMessages/ChatMessages'
import IconSelector from '../../components/IconSelector/IconSelector'

const AdminViewMsgList = ({userObject, userID, onlineUsers}) => {

  console.log("This is user Object admin", userObject);
  const [selectedChat, setSelectedChat] = useState();

  return (
    <div className='h-screen overflow-hidden flex flex-col relative'>
        <Header userObject={userObject} />
        <div className="grid lg:grid-cols-[20%_80%] h-full overflow-hidden ">
          <div className=" hidden lg:flex ">
            <Sidebar />
          </div>

          <div className="md:hidden grid grid-cols-[50px_auto] overflow-hidden h-full w-full  ">
                <div className={`${selectedChat ? "" : "border-r-2 border-[#ecf0f1"} `}>
                  <button onClick={() => setSelectedChat()} className="outline-none flex items-center justify-center w-full p-2">
                    <IconSelector type={"Msgs"} />
                  </button >                  
                </div>

                {
                  selectedChat ? 
                    <ChatMessages 
                      userObject={ userObject } 
                      selectedChat={selectedChat} 
                      isAdmin={true} 
                      userID={userID}
                      type={"Admin"}
                      onlineUsers={onlineUsers}
                    />                                    
                  :
                    <ChatList setSelectedChat={setSelectedChat} selectedChat={selectedChat} userObject={userObject}  />
                }

          </div>

          <div className="hidden md:grid md:grid-cols-[300px_auto]  lg:grid-cols-2 xl:grid-cols-[30%_70%] overflow-hidden h-full w-full  " >
                <ChatList  setSelectedChat={setSelectedChat} selectedChat={selectedChat} userObject={userObject}  />
                <ChatMessages 
                  userObject={ userObject } 
                  selectedChat={selectedChat} 
                  isAdmin={true} 
                  userID={userID}
                  type={"Admin"}
                  onlineUsers={onlineUsers}
                />
          </div>
        </div>
    </div>
  )
}

export default AdminViewMsgList