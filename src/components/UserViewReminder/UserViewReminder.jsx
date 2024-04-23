import React, { useState } from 'react'
import IconSelector from '../IconSelector/IconSelector'
import dayjs from 'dayjs'
import { getMonthNameWithSuffix } from '../../UtilityFunctions'
import SearchBar from '../SearchBar/SearchBar'
import InputSelect from '../Input/InputSelect'

const reminder = [
    {
        id: 1,
        "title": "Retrun System",
        "caption": "You can return",
        "selectDay": "2024-04-29",
        selectTime: "09:45",
        repeat: false
    },
    {
        id: 2,
        "title": "Retrun ",
        "caption": "You can return Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia sunt commodi incidunt quaerat, libero dolor iste quisquam laudantium, atque reiciendis harum! Fuga beatae, perspiciatis officia porro pariatur consequuntur expedita adipisci.",
        "selectDay": "2024-04-29",
        selectTime: "09:45",
        repeat: "day",
        day: 4,
    },
    {
        id: 3,
        "title": "Retrun System",
        "caption": "You can return",
        "selectDay": "2024-04-29",
        selectTime: "09:45",
        repeat: false
    },
    {
        id: 4,
        "title": "Retrun ",
        "caption": "You can return Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia sunt commodi incidunt quaerat, libero dolor iste quisquam laudantium, atque reiciendis harum! Fuga beatae, perspiciatis officia porro pariatur consequuntur expedita adipisci.",
        "selectDay": "2024-04-29",
        selectTime: "09:45",
        repeat: "day",
        day: 4,
    },
]

const UserViewReminder = () => {


  const [reminders, setReminders] = useState(reminder)
  const [sortBy, setSortBy ] = useState("")

  const  HandleApply = () => {

  }

  return (
    <div className=' w-full flex flex-col items-center gap-2 py-2 h-full overflow-hidden  ' >

        <div className="flex w-full justify-end">
            <div className="sm:w-[350px] w-full">
                <SearchBar searchInfo={reminders} setSearchInfo={setReminders} />
            </div>
        </div>


        <div className="w-full flex sm:justify-between items-center gap-2 bg-white">
            <div className=" gridr invisible grid-cols-1 gap-2 h-full">
                <button className="w-full ">
                    <IconSelector type={"Delete"} />
                </button>
                <div className=" invisible ">
                    
                </div>
            </div>

            <div className="grid grid-cols-3 sm:flex gap-2 items-center justify-center w-fit">
                <div className="w-fit ">Sort By :</div>
                <InputSelect inputName={"order"} values={["Ascending","Descending"]} />
                <InputSelect inputName={"order"} values={["Name","Date created","Date modified","Alert Time"]} />
                <button onClick={HandleApply} className="rounded outline-none uppercase primary p-2 px-4 text-[14px] text-white col-span-3  ">Filter</button>
            </div>
        </div>

        <div className="flex flex-col gap-2  h-full overflow-auto px-2  ">
            {
                reminders.map((obj,index) => {

                    let dateObj = dayjs(`${obj.selectDay}T${obj.selectTime}`)
                    let { monthName,dayWithSuffix } = getMonthNameWithSuffix(dateObj.$M,dateObj.$D)

                    console.log(monthName,dayWithSuffix);

                    return (
                        <div className=' neutral px-2 py-2 rounded  w-full grid grid-cols-[10%_90%] max-w-[700px] '>
                            <div className="">
                                <input type="checkbox" name={obj.id} id="" />
                            </div>
                            <div className="text-[12px] ">
                                <div className="font-bold primaryText">{obj.title}</div>
                                <div className=" font- ">{obj.caption}</div>
                                <div className=" font-bold ">{monthName} {dayWithSuffix}</div>
                                <div className={`${obj.repeat ? "flex items-center gap-1" : "hidden"} `}>
                                    <IconSelector type={"Repeat"} size={15}/>
                                    Every {obj.repeat}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default UserViewReminder