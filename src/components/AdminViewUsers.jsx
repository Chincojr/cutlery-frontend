import React, { useEffect, useState } from 'react'
import Unavailable from './Unavailable'
import SearchBar from './SearchBar'
import Sort from './Sort'
import defaultUser from '../assets/defaultUser.png'

const adminEventSortFunctions = ["Name","Email","Phone Number","Notification State","Date created"]


/**
 * The Admin View Users component, displays the user's events
 * @param {object} userObject - The user object
 * @returns {ReactElement} The JSX element of the admin view events page
 */
const AdminViewUsers = ({userObject}) => {
  
  const [users, setUsers] = useState([])
  const [bulkDelete, setBulkDelete] = useState([])

  useEffect(() => {
    /**
     * Fetches and sets the user's events if available.
     * 
     * This asynchronous function checks if the userObject is defined,
     * contains an Event property, and if the Event array has at least
     * one event. If these conditions are met, it updates the events
     * state with the user's Event data.
     */
      const GetEvents = async() => {
          
          console.log("ASYNC check for userInformation",userObject,users);
          
          if (userObject && userObject.UsersInformation) {            
            setUsers(userObject.UsersInformation)
          }
      }      
      GetEvents()
  }, [userObject])

  /**
   * Handles the bulk select/deselect checkboxes for events.
   * 
   * When a checkbox is checked, it adds the event ID to the bulkDelete
   * state array. If the checkbox is unchecked, it removes the event ID
   * from the bulkDelete state array. If the "all" checkbox is
   * checked/unchecked, it sets the bulkDelete state to either ["all"] or
   * an empty array.
   * @param {object} event - The event object from the checkbox element.
   */
  const HandleBulk = (event) => {
    let name = event.target.name;

    if (name === "all") {
        setBulkDelete(["all"])
        return
    }

    if (bulkDelete.includes(name)) {
        let newBulkEdit = bulkDelete.filter((val) => val !== name )
        setBulkDelete(newBulkEdit)
    }else {
        if (bulkDelete.includes("all")) {
            setBulkDelete([name])
        } else {
            setBulkDelete([...bulkDelete,name])
        }
        
    }
  }
  
  
  console.log("Users: ", users);
  
  

  return (
    <div className='overflow-auto w-full flex flex-col gap-2 h-fit'>
        <div className="flex px-2 w-full justify-end">            
            <div className="sm:w-[350px] w-full">
                <SearchBar searchInfo={users} setSearchInfo={setUsers} type={"Users"} />
            </div>
        </div>
        <Sort setInfo={setUsers} info={users} sortFunctions={adminEventSortFunctions} />

        {
            users && users.length > 0
            ?
            <div className='w-full min-w-[500px] border-[1px] border-black overflow-hidden flex flex-col  '>
                <div className='p-2 grid col-span-full grid-cols-5 border-b-[1px] border-black w-full gap-1'>
                    <div className='break-words'>Name</div>
                    <div className='break-words'>Email</div>
                    <div className='break-words'>PhoneNumber</div>
                    <div className="break-words">Notification State</div>
                    <div className="break-words">Joined</div>
                </div>
                <div className="w-full h-full flex flex-col overflow-y-auto">
                {
                    users.map((obj,index) => {
                        console.log(obj);
                        
                        
                        let created = obj.created_at.split(" ")
                        let createdDate = created[0];
                        let createdTime = created[1];
                        return (
                            <div key={index} className='even:bg-[#ecf0f1] grid col-span-full grid-cols-5 gap-1 p-2 group/item '>
                                <div className=" grid grid-cols-[50px_auto] items-center gap-2">
                                    {
                                        obj.imageID ? 
                                            <img src={`${process.env.REACT_APP_IMAGE_URL}${obj.imageID}`} alt="" className="h-[45px] w-[45px] rounded-full" />
                                        :   
                                            <div className="border-black border-[1px] h-fit w-fit rounded-full">
                                                <img src={defaultUser} alt="" className="h-[45px] w-[45px] rounded-full" />          
                                            </div>                                                                                                                                                               
                                    }
                                    <div className="primaryText flex flex-col">
                                        <div className='font-bold break-words overflow-hidden  ' >{obj.name}</div>
                                        <div className="group-hover/item:visible invisible flex gap-2 text-[12px] font-normal items-center">                                        
                                            <a href={`/admin/view/msg/${obj.systemID}`} className="">chat</a>
                                        </div>
                                    </div>                                    
                                </div>

                                {/* <div className=' textOverflow font-light' dangerouslySetInnerHTML={{ __html: obj.content }} /> */}
                                <div className="break-words overflow-hidden">{obj.email}</div>
                                <div className="break-words">{obj.phoneNumber}</div>
                                <div className="break-words">{obj.notify === 1 ? "true" : "false"}</div>
                                <div className="font-light text-[12px]">
                                    <div className="">{obj.state}</div>
                                    <div className=' '>{createdDate} at {createdTime}</div>
                                </div>
                            </div>
                        )
                    })
                }
                </div>

            </div> 
            : <Unavailable type={"Users"} />
        }

    </div>
  )
}

export default AdminViewUsers