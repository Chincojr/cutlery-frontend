import React, { useEffect, useState } from 'react'
import ChatList from '../../components/ChatList'
import ChatMessages from '../../components/ChatMessages'
import IconSelector from '../../components/IconSelector'
import PageContainer from '../PageContainer'
import { useCookies } from 'react-cookie'
import { allCookies } from '../../UtilityObjs'
import { WSClose, WSConnect } from '../../WebSocket'

const AdminViewMsgList = ({userObject, userID, logged,setRefreshCount}) => {

  console.log("This is user Object admin", userObject);
  const [selectedChat, setSelectedChat] = useState();
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [connectivityState, setConnectivityState] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [pendingMessages, setPendingMessages] = useState({})

  
  useEffect(() => {
    WSConnect(cookies,setConnectivityState,setRefreshCount,setPendingMessages,setOnlineUsers)
    return () => {
      window.removeEventListener('beforeunload', WSClose);
    };
  }, []); 
  
  

  return (
    <PageContainer userObject={userObject} logged={logged} >
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
              chatType={"Contact"}
              onlineUsers={onlineUsers}
              setSelectedChat={setSelectedChat}
              connectivityState={connectivityState}
              setPendingMessages={setPendingMessages} 
              pendingMessages={pendingMessages}
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
          chatType={"Contact"}
          onlineUsers={onlineUsers}
          setSelectedChat={setSelectedChat}
          connectivityState={connectivityState}
          setPendingMessages={setPendingMessages} 
          pendingMessages={pendingMessages}
        />
      </div>
    </PageContainer>
  )
}

export default AdminViewMsgList