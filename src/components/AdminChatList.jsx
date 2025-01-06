import React, { useEffect, useState } from 'react'
import IconSelector from './IconSelector'
import Unavailable from './Unavailable'
import { useParams } from 'react-router-dom'
import defaultUser from '../assets/defaultUser.png'

const AdminChatList = ({
        setSelectedChat,
        selectedChat, 
        userObject,
        onlineUsers,
        setChatInfo
}) => {

  const [searchText, setSearchText] = useState("")
  const [chatList, setChatList] = useState([])
  const [unFilteredChatList, setUnFilteredChatList] = useState([])
  let {msgID} = useParams()

  const HandleSearch = (event) => {
      let value = event.target.value        
      if (chatList && value) {
        let listToUse = unFilteredChatList && unFilteredChatList.length > 0 ? unFilteredChatList : chatList
        let filteredChatList = listToUse.filter(chat => chat.name && chat.name.toLowerCase().includes(value.toLowerCase().trim()))
        setChatList(filteredChatList)
      } else {
        setChatList(unFilteredChatList)
      }
      setSearchText(value)
  }

  const HandleBack = () => {
      setSearchText("")
  }

  useEffect(() => {
    /*
        Provided the url specifies the msgID
        select the msgID
    */
    
    const GetUsersInfo = async () => {        
        
        if (msgID && userObject && userObject.UsersInformation) {            
            setSelectedChat(() => {                
                return userObject.UsersInformation.find(user=> user.systemID === msgID)
            })
        }

    }

    GetUsersInfo()
  }, [msgID,userObject])


  useEffect(() => {
    /*
        On mount and userObject change 
        Select the usersInformation
    */

    const SelectUserInformation = () => {
        
        if (userObject && userObject.UsersInformation && userObject.UsersInformation.length > 0) {
            setChatList(userObject.UsersInformation)
            setUnFilteredChatList(userObject.UsersInformation)
        }
    }

    SelectUserInformation();
  }, [userObject])



  return (
    <div className="bg-white overflow-hidden flex flex-col rounded  ">
                
        <div className=" p-2 rounded flex items-center h-fit font-bold text-xl  ">
            <IconSelector type={"Group"} size={30} />
            <div className="pl-2 h-full flex items-center">Users</div>
        </div>
        
        <div className=" w-full flex flex-col gap-2 h-full overflow-hidden py-2  ">

            <div className="px-4 flex items-center h-fit">                
                <button onClick={HandleBack} className={`${searchText ? "" : "hidden"}`}>
                    <IconSelector type={"ArrowBack"} size={25} />
                </button>
                <div className="flex relative border-[2px] border-black px-2 py-1  w-full  rounded-[20px] items-center">
                    <label htmlFor='search' className="">
                        <IconSelector type={"Search"} size={20} />
                    </label>
                    <input id='search' name='searchText' value={searchText} onChange={HandleSearch} autoComplete="off" type="text" className=" pl-1 bg-transparent w-full outline-none " placeholder='Search Users list' /> 
                </div>
            </div>


            <div className=" p-2 overflow-auto grid   ">

                {
                    chatList  ? 
                        <>
                            {
                                chatList.map((chatObject, index) => {                                                                                                            
                                    return (
                                        <div  key={index} className={` ${selectedChat && selectedChat.systemID == chatObject.systemID ? "bg-[#ecf0f1]" : ""} grid hover:bg-[#ecf0f1] px-2 grid-cols-[50px_auto] py-1 gap-2 h-[60px] w-full items-center border-black border-b-[1px]`}>
                                            <div className=" flex items-center justify-center rounded-full relative ">
                                                <button onClick={() => setChatInfo(chatObject)} className="relative">
                                                    {
                                                        chatObject.imageID ? 
                                                            <img src={`${process.env.REACT_APP_IMAGE_URL}${chatObject.imageID}`} alt="" className="h-[45px] w-[45px] rounded-full" />
                                                        :   
                                                            <div className="border-black border-[1px] rounded-full">
                                                                <img src={defaultUser} alt="" className="h-[45px] w-[45px] rounded-full" />          
                                                            </div>                                                                                                                                                               
                                                    }
                                                    {
                                                        onlineUsers && onlineUsers.length > 0 && chatObject.systemID && onlineUsers.includes(chatObject.systemID) ?
                                                            <div className="h-[10px] w-[10px] rounded-full secondary absolute right-[4px] bottom-[1px]"></div>
                                                        : <></>                                                            
                                                    }
                                                    
                                                </button>
                                            </div>
                                            <button onClick={() => setSelectedChat(chatObject)} className="text-[11px] w-full flex h-full items-center ">
                                                <div className=' font-bold truncate' >{chatObject.name}</div>                                                
                                            </button>
                                        </div>
                                    )
                                })
                            }
                            
                        </>
                    :
                    <Unavailable type={"Msg"} />
                }
            </div>

        </div>

    </div>
  )
}

export default AdminChatList