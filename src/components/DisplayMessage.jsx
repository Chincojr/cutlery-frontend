import React, { useEffect, useRef, useState } from 'react'
import InputMessage from './Input/InputMessage'
import DisplayImages from './DisplayImages'
import IconSelector from './IconSelector'

const Reply = ({userObject,userID,reply}) => {
    return (
        <div className="flex flex-col text-[14px] p-1 bg-white w-full border-l-[3px] border-[#3498db] rounded-l-lg ">                        
            <div className="flex grid-cols-2  w-full ">
                <div className="flex flex-col w-full">
                    <div className="textOverflow  ">{reply.text}</div>      
                    <div className="text-[12px] font-bold">{
                            reply.from === userID ? 
                            "You" : 
                            userObject && userObject.UsersInformation[reply.from] ?
                            userObject.UsersInformation[reply.from].name 
                            : ""   
                        }
                    </div>                                                                             
                </div>
                <div className={` ${reply.images[0] ? "" : "hidden"} w-[70px]  flex justify-end  `}>
                    <img src={reply.images[0] ? `${process.env.REACT_APP_IMAGE_URL}${reply.images[0]}` : ""} alt="" className="  rounded-lg object-fit" />
                </div>
            </div>
        </div>
    )
}    

const Message = ({text,images,pending}) => {
    // console.log("Msg images: ", images,typeof images);
    // console.log(images ? JSON.parse(images) : "No images");
    
    return (
        <div className="">
            <div className="flex w-full justify-center ">
                <DisplayImages images={images} pending={pending} />
            </div>
            <div className="text-[14px] font-semibold ">{text}</div>
        </div>        
    )
}

const CheckUser = ({msg,userID,selectedMessages,handleSelectMessages}) => {
    return (
        <div onClick={() => handleSelectMessages(msg.messageID, msg)} className={`w-full flex items-center px-2 ${msg.from === userID ? "" : "justify-end"} ${selectedMessages && Object.keys(selectedMessages).length > 0 ? "" : "invisible"}`}>
            <div className={ ` w-[20px] h-[20px] flex items-center ${selectedMessages && Object.keys(selectedMessages).length > 0 ? "border-[1px]" : "invisible"} ${selectedMessages && Object.keys(selectedMessages).length > 0 && selectedMessages[msg.messageID] ? "primary" : "" } `}>
                <div className={`flex w-full h-full items-center${selectedMessages && Object.keys(selectedMessages).length > 0 && selectedMessages[msg.messageID] ? "" : "invisible" }`}>
                    <IconSelector type={"Check"} size={25} color={"white"} />                                                
                </div>

            </div>
        </div>
    )
}   

const DisplayMessage = ({        
        chat,
        to,
        chatType, 
        isAdmin, 
        userID,
        userObject,
        selectedMessages,
        handleSelectMessages,
        pendingMessages,
        setPendingMessages,
        foundMessageID,
        messageRefs
    }) => {

  const [reply, setSelectReply] = useState("")
  const [messages, setMessages] = useState(null)
  let messagesObject = {}
  const messageContainer = useRef(null);
  

  const HandSelect = (value) => {
    setSelectReply(value)
    console.log(value);
  }

  const HandleClearSelectReply = () => {
    setSelectReply("")
  }

  
  useEffect(() => {              
    const scrollToBottom = () => {
        if (messageContainer.current) {
          messageContainer.current.scrollTo({
            top: messageContainer.current.scrollHeight,
            behavior: 'smooth',
          });
        } else {
          console.error("Element not found");
        }
    };

    scrollToBottom()
    
      
  }, [messages,pendingMessages,reply]);  

  useEffect(() => {    
    let chatMessages = chat && chat.messages && chat.messages.length > 0 ? chat.messages : []
    let chatPendingMessage = pendingMessages && pendingMessages[to] ? pendingMessages[to] : [] 
    setMessages([...chatMessages, ...chatPendingMessage])        
  }, [chat,pendingMessages])
  

  



  return (
    <div className="grid gap-2 h-full items-end overflow-hidden pt-1 ">


        <div ref={messageContainer} className="px-1 flex flex-col gap-2 overflow-auto h-full  ">
            
            {
                messages
                ?
                <>
                    {
                        messages.map((msg,index) => {                            
                            
                            // MessageReply
                            messagesObject = {
                                ...messagesObject,
                                [msg.messageID] : msg
                            }
                            let reply = msg.replyTo ? messagesObject[msg.replyTo] : false;

                            // Message Time
                            if (msg.state !== "pending") {
                                let date = new Date(msg.time);
                                const hours = date.getHours();
                                const minutes = date.getMinutes();
                                const dayOfMonth = date.getDate();
                                const month = date.getMonth() + 1;
                                const year = date.getFullYear();
                                var formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                                var formattedDate = `${month}/${dayOfMonth}/${year}`;                                

                                if (index !== 0) {
                                    let lastMsg = messages[index-1];
                                    let lastTime = new Date(lastMsg.time);
                                    const lastMsgDayOfMonth = lastTime.getDate();
                                    const lastMsgMonth = lastTime.getMonth() + 1;
                                    const lastMsgYear = lastTime.getFullYear();
                                    const lastMsgFormattedDate = `${lastMsgMonth}/${lastMsgDayOfMonth}/${lastMsgYear}`;
                                    
                                    formattedDate = formattedDate === lastMsgFormattedDate ? "" : formattedDate;
                                }                                
                            }
                            let state = msg.state
                            let images = state === "pending" ? msg.images : JSON.parse(msg.images) ? JSON.parse(msg.images) : [];
                            
                            return (
                                <div key={index} ref={el => (messageRefs.current[msg.messageID] = el)} className={`flex flex-col w-full ${msg.messageID === foundMessageID ? "secondary" : ""}`}>
                                    <div className="w-full flex justify-center">
                                        <div className={` w-fit p-1 text-[12px] text-center primary rounded-md text-white ${formattedDate ? "" : "hidden"} `}>{formattedDate}</div>
                                    </div>
                                    <div key={index} className={` group flex gap-2 justify-start ${msg.from === userID ? "flex-row-reverse" : ""} `}>

                                        {/* Message Container */}
                                        <div onDoubleClick={() => handleSelectMessages(msg.messageID, msg)} className={`flex ${msg.from === userID ? "justify-end" : ""}  w-full max-w-[60%] gap-2`}>

                                            {/* Reply Arrow Button */}
                                            <div className={` invisible ${msg.from === userID ? "group-hover:visible flex" : "hidden"} items-center justify-center w-fit `}>
                                                <button onClick={() => HandSelect(msg)} className={` w-fit ${msg.from === userID ? "-scale-y-[1]" : "rotate-180"}`}>
                                                    <IconSelector type={"Reply"} />
                                                </button>
                                            </div>

                                            <div className={`flex flex-col gap-2 ${msg.from === userID ? "userChatMsg rounded-l-xl " : "neutral rounded-r-xl "} p-2 rounded-b-xl w-fit`}>
                                                {/* sender */}
                                                <div className="flex gap-1 text-[12px]">
                                                    <div className="">{formattedTime}</div>
                                                </div>

                                                {/* reply */}
                                                {
                                                    reply ?
                                                    <Reply userObject={userObject} userID={userID} reply={reply} />
                                                    :<></>
                                                }

                                                {/* message */}
                                                <Message text={msg.text} images={images} pending={state === "pending" ? true : false} />                                               
                                       
                                            </div>

                                            {/* Reply Arrow Button */}
                                            <div className={` invisible ${msg.from === userID ? "hidden" : "group-hover:visible flex"} items-center justify-center w-fit `}>
                                                <button onClick={() => HandSelect(msg)} className={` w-fit ${msg.from === userID ? "-scale-y-[1]" : "rotate-180"}`}>
                                                    <IconSelector type={"Reply"} />
                                                </button>
                                            </div>
                                
                                        </div>                                        

                                        {/* Check Container */}
                                        <CheckUser msg={msg} userID={userID} selectedMessages={selectedMessages} handleSelectMessages={handleSelectMessages} />

                                    </div>       

                                </div>

                            )
                        })
                    }
                </>
                :<></>
            }




        </div>
        <div className="px-2 py-1">
            <InputMessage 
                selectReply={reply} 
                handleClearSelectReply={HandleClearSelectReply} 
                setPendingMessages={setPendingMessages} 
                userID={userID} 
                to={to} 
                chatType={chatType} 
                isAdmin={isAdmin} 
                userObject={userObject}                
            />
        </div>

    </div>
  )
}

export default DisplayMessage