import React, { useEffect, useRef, useState } from 'react'
import InputMessage from '../Input/InputMessage'
import DisplayImages from '../DisplayImages/DisplayImages'
import IconSelector from '../IconSelector/IconSelector'



const DisplayMessage = ({privateChat,chat,to,type, isAdmin, userID, userObject}) => {

  const [reply, setSelectReply] = useState("")
  let messagesObject = {}
  const [pendingMessages, setPendingMessages] = useState({})
  const lastMessage = useRef(null);
  

  const HandSelect = (value) => {
    setSelectReply(value)
    console.log(value);
  }

  const HandleClearSelectReply = () => {
    setSelectReply("")
  }



  // twhen chat object changes retrieve pending messsages in the local storage
  useEffect(() => {

   const GetPendingMessages = () => {
        const localStoragePendingMessages = JSON.parse(localStorage.getItem('pendingMsg')) || {};
        const currentTypeMessages = localStoragePendingMessages[type] || {};
        setPendingMessages(currentTypeMessages)
   }

   GetPendingMessages()

  }, [chat])

  //  when the chat object or pending Objects changes scroll into view the last message
//   useEffect(() => {
//     // Scroll the element into view when the component mounts
//     if (lastMessage.current) {
//         lastMessage.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [chat, pendingMessages]);




   console.log("Dispaly meessgae use effect",chat);




  return (
    <div className="grid gap-2 h-full items-end overflow-hidden ">


        <div className="px-1 flex flex-col gap-2 overflow-auto h-full  ">
            
            {
                chat && JSON.parse(chat.messages) && JSON.parse(chat.messages).length > 0  
                ?
                <>
                    {
                        JSON.parse(chat.messages).map((msgString,index) => {
                            let msg = JSON.parse(msgString)
                            messagesObject = {
                                ...messagesObject,
                                [msg.messageID] : msg
                            }
                            let reply = msg.replyTo ? messagesObject[msg.replyTo] : false
                            let time = new Date(msg.time);
                            const hours = time.getHours();
                            const minutes = time.getMinutes();

                            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                            return (
                                <div key={index} className={` group flex gap-2 justify-start ${msg.from === userID ? "flex-row-reverse" : ""} `}>

                                    {/* User Image */}
                                    {
                                        !privateChat ?
                                        <div className="">
                                            {
                                                chat.imageID ? 
                                                <img src={chat.imageID ? `${process.env.REACT_APP_IMAGE_URL}${chat.imageID}` : ""} alt="" className="h-[40px] w-[40px]" />
                                                :
                                                <IconSelector type={"User"} size={40} color={"black"} />
                                            }
                                        </div>        
                                        : <></>                        
                                    }



                                    {/* Message Container */}
                                    <div  className={` ${msg.from === userID ? "userChatMsg" : "neutral"} p-2 w-fit rounded-r-xl rounded-bl-xl max-w-[60%] flex flex-col gap-2   `}>
                                        
                                        {/* sender */}
                                        <div className="flex gap-1 text-[12px]">
                                            {
                                                !privateChat ?
                                                <div className="">
                                                    <div className="">{msg.from},</div>
                                                </div>        
                                                : <></>                                                                
                                            }

                                            <div className="">{formattedTime}</div>
                                        </div>

                                        {/* reply */}
                                        {
                                            reply ?
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
                                            :<></>
                                        }



                                        {/* message */}
                                        <div className="">

                                            <div className="flex w-full justify-center ">
                                                <DisplayImages images={msg.images ? msg.images : []} />
                                            </div>

                                            <div className="text-[14px] font-semibold ">{msg.text}</div>

                                        </div>
                                        
                                        {
                                            index === JSON.parse(chat.messages).length-1 && 
                                            Object.values(pendingMessages).length === 0 ? 
                                            <div ref={lastMessage}></div>
                                            :<></>
                                        }



                                    </div>
                                    
                                    {/* Reply Arrow Button */}
                                    <div className=" hidden group-hover:flex items-center justify-center w-fit">
                                        <button onClick={() => HandSelect(msg)} className={` w-fit ${msg.from === userID ? "-scale-y-[1]" : "rotate-180"}`}>
                                            <IconSelector type={"Reply"} />
                                        </button>
                                    </div>


                                </div>
                            )
                        })
                    }
                </>
                :<></>
            }


            {/* 
                Pending Messages
            */}            
            {
                Object.values(pendingMessages).map((pendingObj,index) => {
                    let msg = pendingObj.message
                    messagesObject = {
                        ...messagesObject,
                        [msg.messageID] : msg
                    }
                    let reply = msg.replyTo ? messagesObject[msg.replyTo] : false
                    return (
                        <div key={index} className={` flex gap-2 justify-start ${msg.from === userID ? "flex-row-reverse" : ""} `}>

                            {/* User Image */}
                            {
                                !privateChat ?
                                <div className="">
                                    {
                                        chat.imageID ? 
                                        <img src={chat.imageID ? `${process.env.REACT_APP_IMAGE_URL}${chat.imageID}` : ""} alt="" className="h-[40px] w-[40px]" />
                                        :
                                        <IconSelector type={"User"} size={40} color={"black"} />
                                    }
                                </div>        
                                : <></>                        
                            }


                            {/* Message Container */}
                            <div className={` ${msg.from === userID ? "userChatMsg" : "neutral"} p-2 w-fit rounded-r-xl rounded-bl-xl max-w-[60%] flex flex-col gap-2 `} >
                                
                                {/* sender */}
                                <div className="flex gap-1 text-[12px]">
                                    {
                                        !privateChat ?
                                        <div className="">
                                            <div className="">{msg.from},</div>
                                        </div>        
                                        : <></>                                                                
                                    }

                                </div>

                                {/* reply */}
                                {
                                    reply ?
                                    <div className="flex flex-col text-[14px] p-1 bg-white w-full border-l-[3px] border-[#3498db] rounded-l-lg ">                        
                                        <div className="flex grid-cols-2  w-full ">
                                            <div className="flex flex-col w-full">
                                                <div className="textOverflow  ">{reply.text}</div>      
                                                <div className="text-[12px] font-bold">{reply.from}</div>                                                                             
                                            </div>
                                            <div className={` ${reply.images[0] ? "" : "hidden"} w-[70px]  flex justify-end  `}>
                                                <img src={reply.images[0] ? `${process.env.REACT_APP_IMAGE_URL}${reply.images[0]}` : ""} alt="" className=" rounded-lg" />
                                            </div>
                                        </div>
                                    </div>
                                    :<></>
                                }


                                {/* message */}
                                <div className="">

                                    <div className="flex w-full justify-center ">
                                        <DisplayImages images={msg.images} pending={true} />
                                    </div>

                                    <div className="text-[14px] font-semibold ">{msg.text}</div>

                                </div>


                                <div className="w-full flex justify-end">
                                    <IconSelector type={"Pending"} size={15} />
                                </div>

                                {
                                    index === Object.values(pendingMessages).length-1 ? 
                                    <div ref={lastMessage}></div>
                                    :<></>
                                }


                            </div>

                            <div className="flex items-center justify-center w-fit">
                                <button onClick={() => HandSelect(msg)} className={` w-fit ${msg.from === userID ? "-scale-y-[1]" : "rotate-180"}`}>
                                    <IconSelector type={"Reply"} />
                                </button>
                            </div>


                        </div>
                    )
                })
            }

        </div>
        <div className="px-2 py-1">
            <InputMessage selectReply={reply} handleClearSelectReply={HandleClearSelectReply} setPendingMessages={setPendingMessages} userID={userID} to={to} type={type} isAdmin={isAdmin} />
        </div>

    </div>
  )
}

export default DisplayMessage