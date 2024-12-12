import React, { useEffect, useState } from 'react'
import AdminChatList from '../../components/AdminChatList'
import ChatMessages from '../../components/ChatMessages'
import IconSelector from '../../components/IconSelector'
import PageContainer from '../PageContainer'
import { useCookies } from 'react-cookie'
import { allCookies } from '../../UtilityObjs'
import { WSClose, WSConnect } from '../../WebSocket'

const AdminContactPage = ({
    userObject,
    userID, 
    logged,    
    setUserObject
  }) => {
    
  
  const [selectedChat, setSelectedChat] = useState();
  const [cookies] = useCookies(allCookies);
  const [connectivityState, setConnectivityState] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [pendingMessages, setPendingMessages] = useState({})

  const HandleRemovePending = (chatID,messageID) => {
    if (!chatID || !messageID) {
        return
    }
    var prevPendingMessages 

    setPendingMessages(lastPendingMessages => {
        prevPendingMessages = lastPendingMessages
        return lastPendingMessages
    })

    if (prevPendingMessages && prevPendingMessages[chatID]) {
        prevPendingMessages[chatID] = prevPendingMessages[chatID].filter(message => message.messageID !== messageID)
        setPendingMessages(prevPendingMessages)
    }

  }

  const HandleUpdateChat = (updatedChat) => {
    
    var prevUserObject 
    var prevSelectedChat

    setUserObject(lastUserObject => {
        prevUserObject = lastUserObject
        return lastUserObject
    })

    setSelectedChat(lastSelectedChat => {
        prevSelectedChat = lastSelectedChat
        return lastSelectedChat
    })
                 
      console.log("Updated User Object");
      
      if(cookies.type === "Admin") {  
        console.log("WebSocket Cookies: ", cookies.type);              
        prevUserObject.UsersInformation[updatedChat.clientID] = JSON.parse(updatedChat.chat) || null
      } else {      
        console.log("WebSocket Cookies: ", cookies.type);  
        prevUserObject.Admin = JSON.parse(updatedChat.chat) || null;        
      }
      setUserObject(prevUserObject)           
          

    setSelectedChat(prevChat => ({
        ...prevChat,
        messages: JSON.parse(updatedChat.chat) || null
    }))    

  }

  
  useEffect(() => {
    WSConnect(cookies,setConnectivityState,HandleRemovePending,HandleUpdateChat,setOnlineUsers)
    return () => {      
      window.removeEventListener('beforeunload', WSClose);
    };
  }, []); 
  

  console.log("Online Users: ", onlineUsers);
  
  

  return (
    <PageContainer userObject={userObject} logged={logged} >
      <div className="md:hidden grid grid-cols-[50px_auto] overflow-hidden h-full w-full  ">

        {/* mobile view */}
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
            <AdminChatList setSelectedChat={setSelectedChat} selectedChat={selectedChat} userObject={userObject}  />
        }
      </div>

      {/* desktop view */}
      <div className="hidden md:grid md:grid-cols-[300px_auto]  lg:grid-cols-2 xl:grid-cols-[30%_70%] overflow-hidden h-full w-full  " >
        <AdminChatList setSelectedChat={setSelectedChat} selectedChat={selectedChat} userObject={userObject}  />
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

export default AdminContactPage