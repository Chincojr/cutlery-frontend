import React, { useState } from 'react'
import ChatMessages from '../../components/ChatMessages'
import { useEffect } from 'react'
import PageContainer from '../PageContainer'
import { useCookies } from 'react-cookie'
import { allCookies } from '../../UtilityObjs'
import { WSClose, WSConnect } from '../../WebSocket'

/**
 * Renders the User Contact Page.
 *
 * This component manages the user's contact interactions, allowing them to view
 * and send messages. It utilizes websocket connections to update the connectivity
 * state and manage online user status. The component also maintains states for
 * selected chat, cookies, pending messages, and online users.
 *
 * @param {Object} userObject - The object containing user-specific information.
 * @param {string} userID - The unique identifier for the user.
 * @param {boolean} logged - Indicates if the user is logged in. 
 * @returns {JSX.Element} The rendered User Contact Page component.
 */
const UserContactPage = ({
    userObject, 
    userID,
    logged,
    setUserObject
  }) => {

  
  /**
   * State to store the selected chat
   * @type {Object}
   */
  const [selectedChat, setSelectedChat] = useState({});

  /**
   * State to store the user's cookies
   * @type {Object}
   */
  const [cookies] = useCookies(allCookies);

  /**
   * State to store the pending messages
   * @type {Object}
   */
  const [pendingMessages, setPendingMessages] = useState({});

  /**
   * State to store the connectivity state of the websocket
   * @type {boolean}
   */
  const [connectivityState, setConnectivityState] = useState(false);

  /**
   * State to store the online users
   * @type {Array}
   */
  const [onlineUsers, setOnlineUsers] = useState([]);


  useEffect(() => {
    /**
     * Sets the selected chat based on the user object
     * @param {Object} userObject - The user object
     */
    if (userObject && userObject.Admin) {
      setSelectedChat(userObject.Admin);
    }
  }, [userObject])

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

    prevUserObject.Admin.messages = updatedChat.chat ?? null;                     
    setUserObject(prevUserObject)           
          
    setSelectedChat(prevChat => ({
        ...prevChat,
        messages: updatedChat.chat ?? null
    }))    

  }
  
  /**
   * Connects to the websocket and sets the connectivity state
   * When the component is unmounted, it removes the event listener
   */
  useEffect(() => {
    /**
     * Connects to the websocket and sets the connectivity state
     * @param {Object} cookies - The user's cookies
     * @param {Function} setConnectivityState - The function to set the connectivity state
    
     * @param {Function} setPendingMessages - The function to set the pending messages
     * @param {Function} setOnlineUsers - The function to set the online users
     */
    WSConnect(cookies,setConnectivityState,HandleRemovePending,HandleUpdateChat,setOnlineUsers)    
    return () => {
      /**
       * Removes the event listener when the component is unmounted
       * @param {Function} WSClose - The function to close the websocket
       */
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