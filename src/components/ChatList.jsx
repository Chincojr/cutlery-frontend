import React, { useEffect, useState } from 'react'
import IconSelector from './IconSelector'
import Unavailable from './Unavailable'
import { useParams } from 'react-router-dom'
import SearchBar from './SearchBar'

const ChatList = ({setSelectedChat,selectedChat, userObject}) => {


  const [searchText, setSearchText] = useState("")
  const [usersInformation, setUserInformation] = useState([])
  let {msgID} = useParams()


  const HandleSearch = (event) => {
      setSearchText(event.target.value)
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
        if (msgID && userObject.UsersInformation[msgID]) {
            setSelectedChat(userObject.UsersInformation[msgID])
        }

    }

    GetUsersInfo()
  }, [])


  useEffect(() => {
    /*
        when the userObject changes 
        Re-select the chat 
    */
    const ReSelectChat = () => {
        if (selectedChat && selectedChat.systemID) {
            setSelectedChat(userObject.UsersInformation[selectedChat.systemID])
        }
    }
    ReSelectChat()
  }, [userObject])



  useEffect(() => {
    /*
        On mount and userObject change 
        Select the usersInformation
    */

    const SelectUserInformation = () => {
        if (userObject && userObject.UsersInformation && Object.keys(userObject.UsersInformation).length > 0) {
            setUserInformation(userObject.UsersInformation)
        }
    }

    SelectUserInformation();
  }, [userObject])
  


  





  console.log("Chat list ", selectedChat);
  


  return (
    <div className="bg-white overflow-hidden flex flex-col rounded  ">
                
        <div className=" p-2 rounded flex items-center h-fit font-bold text-xl  ">
            <IconSelector type={"Group"} size={30} />
            <div className="pl-2 h-full flex items-center">Users</div>
        </div>
        
        <div className=" w-full flex flex-col gap-2 h-full overflow-hidden py-2  ">

            <div className="px-4 flex items-center h-fit">
                <SearchBar searchInfo={usersInformation} setSearchInfo={setUserInformation} type={"UsersList"} />
                {/* <button onClick={HandleBack} className={`${searchText ? "" : "hidden"}`}>
                    <IconSelector type={"ArrowBack"} size={25} />
                </button>
                <div className="flex relative border-[2px] border-black px-2 py-1  w-full  rounded-[20px] items-center">
                    <label htmlFor='search' className="">
                        <IconSelector type={"Search"} size={20} />
                    </label>
                    <input id='search' name='searchText' value={searchText} onChange={HandleSearch} autoComplete="off" type="text" className=" pl-1 bg-transparent w-full outline-none " placeholder='People, groups, messages' /> 
                </div> */}
            </div>


            <div className=" p-2 overflow-auto grid   ">

                {
                    usersInformation  ? 
                        <>
                            {
                                Object.keys(usersInformation).map((user, index) => {

                                    let userObj = usersInformation[user]
                                    return (
                                        <button onClick={() => setSelectedChat(userObj)} key={index} className={` ${selectedChat && selectedChat.systemID == userObj.systemID ? "bg-[#ecf0f1]" : ""} grid hover:bg-[#ecf0f1] px-2 grid-cols-[10%_90%] py-1 gap-2 h-[60px] w-full items-center border-black border-b-[1px]`}>
                                            <div className=" flex items-center justify-center rounded-full relative ">
                                                <div className="relative">
                                                    {
                                                        userObj.imageID ? 
                                                        <img src={userObj.imageID} alt="" className="h-[40px] w-[40px]" />
                                                        :
                                                        <IconSelector type={"User"} size={40} />
                                                    }
                                                </div>
                                            </div>
                                            <div className="text-[11px] w-full flex ">
                                                <div className=' font-bold truncate' >{userObj.name}</div>
                                                <div className="truncate">{userObj.description}</div>
                                            </div>
                                        </button>
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

export default ChatList