import React, { useEffect, useState } from 'react'
import { DexieGet } from '../../DexieDb'
import Unavailable from '../Unavailable/Unavailable'
import SearchBar from '../SearchBar/SearchBar'
import Sort from '../Sort/Sort'
import BulkDelete from '../BulkDelete/BulkDelete'

const adminEventSortFunctions = ["Title","Date created","Date modified"]


const AdminViewEvents = () => {
  
  const [events, setEvents] = useState([])
  const [bulkDelete, setBulkDelete] = useState([])

  useEffect(() => {
      const GetEvents = async() => {
          let adminEvents = await DexieGet("Event") 
          console.log("Admin events: ", adminEvents );
          if (adminEvents) {
              console.log(adminEvents);
              setEvents(adminEvents)
          }
      }
      GetEvents()
  }, [])

  const HandleBulk = (event) => {
    let { value, name} = event.target;

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
  

  return (
    <div className='overflow-auto w-full flex flex-col gap-2 h-fit'>
        <div className="flex px-2 w-full justify-between">
            <BulkDelete bulkDelete={bulkDelete} info={events} type={"Event"} />
            <div className="sm:w-[350px] w-full">
                <SearchBar searchInfo={events && events.length > 0 ? events : []} setSearchInfo={setEvents} type={"Events"} />
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
                        // console.log("This are events obj", obj);
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
                                <div className=' textOverflow font-light ' >{obj.content}</div>
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