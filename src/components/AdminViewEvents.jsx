import React, { useEffect, useState } from 'react'
import Unavailable from './Unavailable'
import SearchBar from './SearchBar'
import Sort from './Sort'
import BulkDelete from './BulkDelete'

const adminEventSortFunctions = ["Title","Date created","Date modified"]


/**
 * The Admin View Events component, displays the user's events
 * @param {object} userObject - The user object
 * @returns {ReactElement} The JSX element of the admin view events page
 */
const AdminViewEvents = ({userObject}) => {
  
  const [events, setEvents] = useState([])
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
          if (userObject && userObject.Event) {            
            setEvents(userObject.Event)
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
  
  console.log({events,events});
  

  return (
    <div className='overflow-auto w-full flex flex-col gap-2 h-fit'>
        <div className="flex px-2 w-full justify-between">
            <BulkDelete bulkDelete={bulkDelete} info={events} type={"Event"} />
            <div className="sm:w-[350px] w-full">
                <SearchBar searchInfo={events} setSearchInfo={setEvents} type={"Events"} />
            </div>
        </div>
        <Sort setInfo={setEvents} info={events} sortFunctions={adminEventSortFunctions} />

        {
            events && events.length > 0
            ?
            <div className='w-full min-w-[500px] border-[1px] border-black overflow-hidden flex flex-col  '>
                <div className=' grid col-span-full grid-cols-4 border-b-[1px] border-black w-full' >
                    <div className="px-2">
                        <input type="checkbox" name={"all"}  checked={ bulkDelete && bulkDelete.includes("all") ? true : false } onChange={HandleBulk} />
                    </div>
                    <div className=''>Title</div>
                    <div className=''>Content</div>
                    <div className=''>Publish Date</div>
                </div>
                <div className="w-full h-full flex flex-col overflow-y-auto">
                {
                    events.map((obj,index) => {
                        
                        let created = obj.created_at.split(" ")
                        let createdDate = created[0];
                        let createdTime = created[1];
                        return (
                            <div key={index} className='even:bg-[#ecf0f1] grid col-span-full grid-cols-4 py-2 group/item '>
                                <div className="px-2 ">
                                    <input type="checkbox" name={obj.systemID} id="" checked={
                                        bulkDelete && bulkDelete.includes(obj.systemID) ? 
                                        true 
                                        : bulkDelete && bulkDelete.includes("all") ? 
                                        true 
                                        : false
                                    } onChange={HandleBulk} />
                                </div>
                                <div className="primaryText grid grid-rows-2">
                                    <div className='font-bold textOverflow  ' >{obj.title}</div>
                                    <div className="group-hover/item:visible invisible flex gap-2 text-[12px] font-normal items-center">
                                        <a href={`/admin/edit/event/${obj.systemID}`}className="">Edit</a>
                                        <a href={`/event/${obj.systemID}`} className="">View</a>
                                    </div>
                                </div>
                                <div className=' textOverflow font-light' dangerouslySetInnerHTML={{ __html: obj.content }} />
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
            : <Unavailable type={"Events"} />
        }

    </div>
  )
}

export default AdminViewEvents