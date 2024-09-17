import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import uploadImage from '../assets/uploadImage.png'
import Unavailable from './Unavailable'
import Sort from './Sort'
import { getMonthNameWithSuffix } from '../UtilityFunctions'
import dayjs from 'dayjs'


const eventSortFunctions = ["Title","Date created","Date modified"]

const UserViewEvents = ({userObject}) => {

  const [events, setEvents] = useState([])

  useEffect(() => {
    
    const GetSpecificEvent = async() => {
        if (userObject && userObject.Event && userObject.Event.length >= 0) {
            setEvents(userObject.Event)
        }
    }

    GetSpecificEvent();
  }, [userObject])


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
                    let objDate = dayjs(obj.modified)
                    var { monthName,dayWithSuffix } = getMonthNameWithSuffix(objDate.$M,objDate.$D)
                    return (
                        <a key={index} href={`/event/${obj.systemID}`} className="">
                            <div className={` neutral w-[300px] h-[250px] border-[1px] p-1 border-black rounded grid grid-rows-[60%_10%_20%_10%] `}>
                                <img src={obj.image ? `${process.env.REACT_APP_IMAGE_URL}${obj.image}` : uploadImage } alt="" className='w-full overflow-hidden h-full' />
                                <div className="truncate primaryText font-bold">{obj.title}</div>
                                <div className="text-[10px] textOverflow font-bold " dangerouslySetInnerHTML={{ __html: obj.content }} />
                                {/* <div >{obj.content}</div> */}
                                <div className="text-[10px] text-end  ">{monthName} {dayWithSuffix}</div>
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