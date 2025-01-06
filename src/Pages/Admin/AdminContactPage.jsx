import React, { useEffect, useState } from 'react'
import AdminChatList from '../../components/AdminChatList'
import ChatMessages from '../../components/ChatMessages'
import IconSelector from '../../components/IconSelector'
import PageContainer from '../PageContainer'
import { useCookies } from 'react-cookie'
import { allCookies } from '../../UtilityObjs'
import { WSClose, WSConnect } from '../../WebSocket'
import UserInformation from '../../components/UserInformation'

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
  const [chatInfo, setChatInfo] = useState(false)

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
                       
    for (let i = 0; i < prevUserObject.UsersInformation.length; i++) {
      const user = prevUserObject.UsersInformation[i];
      if (user.systemID === updatedChat.clientID) {
        user.messsages = updatedChat.chat ?? null
      }
      break;          
    }          
    setUserObject(prevUserObject)           
          
    setSelectedChat(prevChat => ({
        ...prevChat,
        messages: updatedChat.chat ?? null
    }))    

  }

  
  useEffect(() => {
    WSConnect(cookies,setConnectivityState,HandleRemovePending,HandleUpdateChat,setOnlineUsers)
    return () => {      
      window.removeEventListener('beforeunload', WSClose);
    };
  }, []); 
    
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
              setChatInfo={setChatInfo}         
            />                                    
          :
            <AdminChatList 
              setSelectedChat={setSelectedChat} 
              selectedChat={selectedChat} 
              userObject={userObject} 
              onlineUsers={onlineUsers}  
              setChatInfo={setChatInfo}
            />
        }
      </div>

      {/* desktop view */}
      <div className="hidden md:grid md:grid-cols-[300px_auto]  lg:grid-cols-2 xl:grid-cols-[30%_70%] overflow-hidden h-full w-full  " >
        <AdminChatList 
          setSelectedChat={setSelectedChat} 
          selectedChat={selectedChat} 
          userObject={userObject} 
          onlineUsers={onlineUsers} 
          setChatInfo={setChatInfo}
        />
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
          setChatInfo={setChatInfo}
        />
      </div>
      
      {
        chatInfo ?
          <div className="absolute overlayBg inset-0 flex items-center justify-center">
            <UserInformation chatInfo={chatInfo} setChatInfo={setChatInfo} />        
          </div>
        :<></>        
      }

    </PageContainer>
  )
}

export default AdminContactPage