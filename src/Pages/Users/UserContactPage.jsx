import React, { useState } from 'react'
import ChatMessages from '../../components/ChatMessages'
import { useEffect } from 'react'
import PageContainer from '../PageContainer'
import { useCookies } from 'react-cookie'
import { allCookies } from '../../UtilityObjs'
import { WSClose, WSConnect } from '../../WebSocket'

const UserContactPage = ({userObject, userID,logged,setRefreshCount}) => {

  console.log("This is user Object admin", userObject);
  const [selectedChat, setSelectedChat] = useState();
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  const [pendingMessages, setPendingMessages] = useState({})
  const [connectivityState, setConnectivityState] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])


  useEffect(() => {
    if (
      userObject &&
      userObject.Admin
    ) {
        setSelectedChat(userObject.Admin)
    }
  }, [userObject])
  
  useEffect(() => {
    WSConnect(cookies,setConnectivityState,setRefreshCount,setPendingMessages,setOnlineUsers)    
    return () => {
      window.removeEventListener('beforeunload', WSClose);
    };
  }, []); 


  return (
    <PageContainer userObject={userObject} logged={logged}>
      <div className="grid overflow-hidden h-full w-full ">
            <ChatMessages 
              userObject={ userObject } 
              selectedChat={selectedChat} 
              isAdmin={false} 
              userID={userID}
              chatType={"Contact"}
              onlineUsers={onlineUsers}
              setPendingMessages={setPendingMessages} 
              pendingMessages={pendingMessages}
              connectivityState={connectivityState}
            />
      </div>
    </PageContainer>
  )
}

export default UserContactPage