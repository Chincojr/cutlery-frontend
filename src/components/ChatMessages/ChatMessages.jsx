import React, { useEffect, useState } from 'react'
import DisplayMessage from '../DisplayMessage/DisplayMessage'
import IconSelector from '../IconSelector/IconSelector'
import SearchBar from '../SearchBar/SearchBar'
import Unavailable from '../Unavailable/Unavailable'


const ChatMessages = ({selectedChat,isAdmin,userID, type, onlineUsers}) => {
  const [displaySearch, setDisplaySearch] = useState(false)
  const [groupActionsIDs, setGroupActionsIDs] = useState({})

  const HideSearch = () => {
    setDisplaySearch(!displaySearch)
    setGroupActionsIDs({})
  }

  const HideGroupActions = () => {
    setDisplaySearch(false)
    setGroupActionsIDs({})
  }

  const HandleGroupActions = () => {

  }

  


  



  return (
    <div className="flex flex-col gap-1 overflow-auto border-l-2 border-[#ecf0f1] ">

        {
            selectedChat ?
            <>
                <div className="flex h-[60px] justify-between primary p-2 text-white items-center">
                    {
                        groupActionsIDs && Object.keys(groupActionsIDs).length > 0 ?
                            <div className="flex w-full justify-between">
                                <div className="w-full flex gap-2 items-center">
                                    <div className="">
                                        {groupActionsIDs.length} Selected                                        
                                    </div>
                                    <button className="outline-none">
                                        <IconSelector type={"Copy"} size={25} />
                                    </button>                                    
                                </div>
                                <div className="flex w-full justify-end ">

                                    <button onClick={HideGroupActions} className="rotate-45 outline-none">
                                        <IconSelector type={"Plus"} size={25} />
                                    </button>                                    
                                </div>

                            </div>
                        :
                        displaySearch ?
                            <div className="flex w-full">
                                <SearchBar noBorder={true} otherFunctions={HideSearch} />
                                <button onClick={HideSearch} className="rotate-45 outline-none">
                                    <IconSelector type={"Plus"} size={25} />
                                </button>
                            </div>
                        : <>
                            <div className="flex gap-2">
                                {
                                    selectedChat.imageID ? 
                                    <div className="relative h-[40px] w-[40px] rounded-full">
                                        <img src={selectedChat.imageID} alt="" className="h-[40px] w-[40px] rounded-full" />
                                            <div className="text-[10px]">{
                                                onlineUsers && 
                                                onlineUsers.length > 0 && 
                                                onlineUsers.includes(selectedChat.systemID)? 
                                                "Online" : 
                                                "Offline"
                                            }
                                        </div>
                                    </div>
                                    :
                                    <div className="relative rounded-full flex items-center ">
                                        <IconSelector type={"User"} size={40} color={"black"} />
                                        <div className={`absolute secondary h-[10px] w-[10px] rounded-full right-[1px] bottom-[5px] ${
                                                onlineUsers && 
                                                onlineUsers.length > 0 && 
                                                onlineUsers.includes(selectedChat.systemID)? 
                                                "" : 
                                                "hidden"
                                            }`}
                                        >
                                        </div>
                                    </div>
                                }
                                <div className="">
                                    <div className="">{selectedChat.name}</div>
                                    <div className="text-[10px]">{
                                            onlineUsers && 
                                            onlineUsers.length > 0 && 
                                            onlineUsers.includes(selectedChat.systemID)? 
                                            "Online" : 
                                            "Offline"
                                        }
                                    </div>
                                </div>
                            </div>
                            <button onClick={HideSearch} className="outline-none">
                                <IconSelector type={"Search"} />
                            </button>    
                        </>
                

                    }
                </div>
                <DisplayMessage 
                    privateChat={true} 
                    chat={selectedChat}
                    type={type} 
                    to={selectedChat.systemID} 
                    isAdmin={isAdmin} 
                    userID={userID}  
                />
            </>
            : 
            <Unavailable type={"SelectMsg"} />
        }

    </div>
  )
}

export default ChatMessages