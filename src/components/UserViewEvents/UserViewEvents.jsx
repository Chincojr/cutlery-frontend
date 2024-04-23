import React, { useState } from 'react'
import dayjs from 'dayjs'
import { getMonthNameWithSuffix } from '../../UtilityFunctions'
import SearchBar from '../SearchBar/SearchBar'
import InputSelect from '../Input/InputSelect'
import uploadImage from '../../assets/uploadImage.png'

const event = [
    {
        id: 1,
        "title": "Retrun System",
        "caption": "You can return",
        image : "",
        creationTime: "",
    },
    {
        id: 2,
        "title": "Retrun ",
        "caption": "You can return Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia sunt commodi incidunt quaerat, libero dolor iste quisquam laudantium, atque reiciendis harum! Fuga beatae, perspiciatis officia porro pariatur consequuntur expedita adipisci.",
        image : "",
        creationTime: "",
    },
    {
        id: 3,
        "title": "Retrun System",
        "caption": "You can return",
        image : "",
        creationTime: "",
    },
    {
        id: 4,
        "title": "Retrun ",
        "caption": "You can return Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia sunt commodi incidunt quaerat, libero dolor iste quisquam laudantium, atque reiciendis harum! Fuga beatae, perspiciatis officia porro pariatur consequuntur expedita adipisci.",
        image : "",
        creationTime: "",
    },
]

const UserViewEvents = () => {


  const [events, setEvents] = useState(event)
  const [sortBy, setSortBy ] = useState("")

  const  HandleApply = () => {

  }

  return (
    <div className=' w-full flex flex-col items-center gap-2 py-2 h-full overflow-hidden  ' >

        <div className="flex px-2 w-full justify-end">
            <div className="sm:w-[350px] w-full">
                <SearchBar searchInfo={events} setSearchInfo={setEvents} />
            </div>
        </div>


        <div className="w-full px-2 flex justify-end items-center gap-2 bg-white py-2">

            <div className="grid grid-cols-3 sm:flex gap-2 items-center justify-center w-fit">
                <div className="w-fit ">Sort By :</div>
                <InputSelect inputName={"order"} values={["Ascending","Descending"]} />
                <InputSelect inputName={"order"} values={["Name","Date created","Date modified","Alert Time"]} />
                <button onClick={HandleApply} className="rounded outline-none uppercase primary p-2 px-4 text-[14px] text-white col-span-3  ">Filter</button>
            </div>
        </div>

        <div className="grid eventsGrid gap-3 w-full h-full overflow-auto place-items-center px-2   ">
            {
                events.map((obj,index) => {

                    return (
                        <a href="/event/1" className="">
                            <div className={` neutral w-[300px] h-[250px] border-[1px] p-1 border-black rounded grid grid-rows-[60%_10%_20%_10%] `}>
                                <img src={obj.image ? obj.image : uploadImage } alt="" className='w-full overflow-hidden h-full' />
                                <div className="truncate primaryText font-bold">{obj.title}</div>
                                <div className="text-[10px] textOverflow font-bold  ">{obj.caption}</div>
                                <div className="text-[10px] text-end  ">Jan 19th</div>
                            </div>
                        </a>
                    )
                })
            }
        </div>
    </div>
  )
}

export default UserViewEvents