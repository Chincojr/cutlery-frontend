import React, { useEffect, useState } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import uploadImage from '../../assets/uploadImage.png'
import Unavailable from '../Unavailable/Unavailable'
import { DexieGet } from '../../DexieDb'
import Sort from '../Sort/Sort'

const eventSortFunctions = ["Title","Date created","Date modified"]

const UserViewEvents = () => {

  const [events, setEvents] = useState([])

  useEffect(() => {
    
    const GetEvents = async() => {
        let userEvents = await DexieGet("Event") 
        if (userEvents) {
            console.log(userEvents);
            setEvents(userEvents)
        }
    }

    

    GetEvents()
  
  }, [])

  console.log("This is the inside events info: ", events);

  return (
    <div className=' w-full flex flex-col items-center gap-2 py-2 h-full overflow-hidden  ' >

        <div className="flex px-2 w-full justify-end">
            <div className="sm:w-[350px] w-full">
                <SearchBar searchInfo={events && events.length > 0 ? events : []} setSearchInfo={setEvents} type={"Events"} />
            </div>
        </div>

        <Sort setInfo={setEvents} info={events} sortFunctions={eventSortFunctions} />


        <div className="grid eventsGrid gap-3 w-full h-full overflow-auto place-items-center px-2   ">
            {
                events && events.length > 0 
                ?
                events.map((obj,index) => {
                    return (
                        <a key={index} href={`/event/${obj.systemID}`} className="">
                            <div className={` neutral w-[300px] h-[250px] border-[1px] p-1 border-black rounded grid grid-rows-[60%_10%_20%_10%] `}>
                                <img src={obj.image ? `${process.env.REACT_APP_IMAGE_URL}${obj.image}` : uploadImage } alt="" className='w-full overflow-hidden h-full' />
                                <div className="truncate primaryText font-bold">{obj.title}</div>
                                <div className="text-[10px] textOverflow font-bold  ">{obj.content}</div>
                                <div className="text-[10px] text-end  ">Jan 19th</div>
                            </div>
                        </a>
                    )
                })
                : <Unavailable type={"Events"} /> 

            }
        </div>
    </div>
  )
}

export default UserViewEvents