import React, { useEffect, useRef, useState } from 'react'
import DisplayMessage from './DisplayMessage'
import IconSelector from './IconSelector'
import Unavailable from './Unavailable'

const Actions = ({
    selectedMessages,
    HideGroupActions,
    userID,
    userObject,
    isAdmin    
}) => {

    
    const HandleGroupActions = (type) => {
        switch (type) {
            case "Copy":
                /*
                    Loop through all the Selected messages
                    and merge them in such a mannaer that each message starts on its own line
                */            
                let msgs = Object.values(selectedMessages)
                let copiedText = ""
                msgs.sort((a, b) => new Date(a.time) - new Date(b.time));
                        
                msgs.forEach((msg,index) => {
                    let split = index == 0 ? "" : "\n";
                    if (isAdmin) {                    
                        var userName = msg.from === userID ? userObject.name : userObject.UsersInformation.find(user => user.systemID === msg.from).name
                    } else {
                        var userName = msg.from === userID ? userObject.name : userObject.Admin.name
                    }
                    copiedText = `${copiedText}${split}[${msg.time}] ${userName}: ${msg.text}`
                });
                navigator.clipboard.writeText(copiedText).then(() => {
                    HideGroupActions();
                    console.log('Text copied to clipboard');
                }).catch((error) => {
                    console.error('Could not copy text: ', error);
                });                                
                break;
        
            default:
                break;
        }
    }    



    return (
        <div className="flex w-full justify-between">

            <div className="w-full flex gap-2 items-center">
                <div className="">
                    {Object.keys(selectedMessages).length} Selected                                        
                </div>
                <button onClick={() => HandleGroupActions("Copy")} className="outline-none">
                    <IconSelector type={"Copy"} size={25} />
                </button>                                    
            </div>

            <div className="flex w-full justify-end ">

                <button onClick={HideGroupActions} className="rotate-45 outline-none">
                    <IconSelector type={"Plus"} size={25} />
                </button>                                    
            </div>

        </div>
    )
}

const Search = ({    
    searchInfo,    
    setSearchInfo,
    selectedChat,
    messageRefs,
    ClearSearch
}) => {

    const scrollToElement = (index) => {
        if (messageRefs.current[index]) {
            // Scroll to the specific element
            messageRefs.current[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    const HandleSearch = (event) => {
        let {value} = event.target
        let foundlist = selectedChat.messages && JSON.parse(selectedChat.messages).length > 0 ? JSON.parse(selectedChat.messages).filter(msg => msg.text && value && msg.text.toLowerCase().includes(value.toLowerCase().trim())) :[]        
        let firstMessageThatIsAMatch = undefined
        
    
        if (value && foundlist && foundlist.length > 0) {
            firstMessageThatIsAMatch = foundlist[0]
            scrollToElement(firstMessageThatIsAMatch.messageID)
        }
    
        setSearchInfo({
            ...searchInfo,
            text: value,
            foundlist,
            foundMessageID:firstMessageThatIsAMatch ? firstMessageThatIsAMatch.messageID : null,
            foundMessageIndex : firstMessageThatIsAMatch ? 0 : null ,
        })
        
    }
      
    const NextMsgInSearch = () => {
        if (searchInfo.foundMessageIndex < searchInfo.foundlist.length - 1 ) {
            let nextIndex = searchInfo.foundMessageIndex + 1
            let nextMessageID = searchInfo.foundlist && searchInfo.foundlist.length > 0 && searchInfo.foundlist[nextIndex] && searchInfo.foundlist[nextIndex].messageID ? searchInfo.foundlist[nextIndex].messageID : null
            if (nextMessageID) {
                scrollToElement(nextMessageID)
            }
            setSearchInfo({
                ...searchInfo,
                foundMessageID : nextMessageID,
                foundMessageIndex: nextIndex
            })
        }
      }
    
      const PreviousMsgInSearch = () => {
        if (searchInfo.foundMessageIndex !== null && searchInfo.foundlist) {
            let previousIndex = searchInfo.foundMessageIndex - 1 <= 0 ? 0 : searchInfo.foundMessageIndex -1
            let previousMessageID = searchInfo.foundlist && searchInfo.foundlist.length > 0 && searchInfo.foundlist[previousIndex] && searchInfo.foundlist[previousIndex].messageID ? searchInfo.foundlist[previousIndex].messageID : null
            if (previousMessageID) {
                scrollToElement(previousMessageID)
            }
            setSearchInfo({
                ...searchInfo,
                foundMessageID : previousMessageID,
                foundMessageIndex: previousIndex
            })
        }
    }

    return(
        <div className="flex w-full gap-1">
            {
                selectedChat && selectedChat.messages && selectedChat.messages.length > 0
                ?                                    
                <div className={`flex relative px-2 py-1  w-full  rounded-[20px] items-center`}>
                    <label htmlFor='search' className="">
                        <IconSelector type={"Search"} size={25} />
                    </label>
                    <input id='search' name='searchText' value={searchInfo.text} onChange={HandleSearch} autoComplete="off" type="text" className=" pl-1 bg-transparent w-full outline-none " placeholder='Search...' /> 
                </div>
                : <></>
            }
            {
                searchInfo.foundlist && searchInfo.foundlist.length > 0 ?
                <div className="flex items-center text-[12px]">{searchInfo.foundMessageIndex !== null  ? searchInfo.foundMessageIndex+1 : 0 }/{searchInfo.foundlist.length}</div>
                :<></>
            }
            <button onClick={PreviousMsgInSearch} className="rotate-90 w-fit outline-none">
                <IconSelector type={"Arrow"} size={20} />
            </button>
            <button onClick={NextMsgInSearch} className="rotate-[270deg] w-fit outline-none">
                <IconSelector type={"Arrow"} size={20} />
            </button>
            <button onClick={ClearSearch} className="rotate-45 outline-none">
                <IconSelector type={"Plus"} size={25} />
            </button>
        </div>
    )
}

const ChatMessages = ({
        userObject,
        selectedChat,
        isAdmin,
        userID, 
        chatType, 
        onlineUsers,
        setSelectedChat,
        connectivityState,
        setPendingMessages,
        pendingMessages,
        setChatInfo
    }) => {

  const [displaySearch, setDisplaySearch] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState({})  
  const [searchInfo, setSearchInfo] = useState({
    text: "",
    foundMessageID: null,
    foundlist: null,
    foundMessageIndex:null
  })
  const messageRefs = useRef([]);  


  const ClearSearch = () => {
    setDisplaySearch(!displaySearch)
    setSelectedMessages({})
    setSearchInfo({
        text: "",
        foundMessageID: null,        
        foundlist: null,
        foundMessageIndex:0
    })
  }

  const HideGroupActions = () => {
    setDisplaySearch(false)
    ClearSearch()
  }

  const HandleSelectMessages = (id,msg) => {    
    if (selectedMessages[id]) {
        let newSelectedMessages = selectedMessages
        delete newSelectedMessages[id];
        setSelectedMessages({...newSelectedMessages});
    } else {
        setSelectedMessages({
            ...selectedMessages,
            [id]: msg
        })        
    }

  }

  useEffect(() => {
    setDisplaySearch(false)
    setSelectedMessages({})
    setSearchInfo({
        text: "",
        foundMessageID: null,
        foundlist: null,
        foundMessageIndex:null
    })

  }, [selectedChat])    
  
      
  return (
    <div className="flex flex-col overflow-auto border-l-2 border-[#ecf0f1] ">
        <div className={`text-white ${connectivityState ? "secondary" :"accent"} text-center text-[12px] font-semibold `}>{connectivityState ? "You are Online" : "You are offline"}</div>
        {
            selectedChat ?
            <>
                <div className="flex h-[60px] justify-between primary p-2 text-white items-center">
                    {
                        selectedMessages && Object.keys(selectedMessages).length > 0 ?
                            <Actions 
                                selectedMessages={selectedMessages} 
                                HideGroupActions={HideGroupActions} 
                                userID={userID}
                                userObject={userObject}
                                isAdmin={isAdmin}
                            />                        
                        :
                        displaySearch ?
                            <Search 
                                searchInfo={searchInfo}
                                setSearchInfo={setSearchInfo}
                                selectedChat={selectedChat}
                                messageRefs={messageRefs}
                                ClearSearch={ClearSearch}
                            />
                        : <>
                            <div className="flex gap-2">
                                
                                <button onClick={() => setChatInfo ?  setChatInfo(selectedChat) : null} className="">
                                    {
                                        selectedChat.imageID ? 
                                        <div className="relative h-[40px] w-[40px] rounded-full">
                                            <img src={`${process.env.REACT_APP_IMAGE_URL}${selectedChat.imageID}`} alt="" className="h-[40px] w-[40px] rounded-full" />
                                        </div>
                                        :
                                        <div className="relative rounded-full flex items-center ">
                                            <IconSelector type={"User"} size={40} color={"black"} />
                                        </div>
                                    }                                    
                                </button>

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
                            <button onClick={ClearSearch} className="outline-none">
                                <IconSelector type={"Search"} />
                            </button>    
                        </>
                

                    }
                </div>
                <DisplayMessage 
                    privateChat={true} 
                    chat={selectedChat}
                    chatType={chatType} 
                    to={selectedChat.systemID} 
                    isAdmin={isAdmin} 
                    userID={userID}  
                    selectedMessages = {selectedMessages}
                    handleSelectMessages = {HandleSelectMessages}
                    userObject={userObject}
                    setPendingMessages={setPendingMessages} 
                    pendingMessages={pendingMessages}
                    foundMessageID={searchInfo.foundMessageID}
                    messageRefs={messageRefs}                    
                />




            </>
            : 
            <Unavailable type={"SelectMsg"} />
        }

    </div>
  )
}

export default ChatMessages