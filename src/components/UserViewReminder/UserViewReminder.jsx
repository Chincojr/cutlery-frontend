import React, { useEffect, useState } from 'react'
import IconSelector from '../IconSelector/IconSelector'
import dayjs from 'dayjs'
import { SortPastTodayFuture, getMonthNameWithSuffix } from '../../UtilityFunctions'
import SearchBar from '../SearchBar/SearchBar'
import { DexieGet } from '../../DexieDb'
import Unavailable from '../Unavailable/Unavailable'
import Sort from '../Sort/Sort'
import BulkDelete from '../BulkDelete/BulkDelete'

const reminderSortFunctions = ["Title","Date created","Date modified","Alert Date"]

const UserViewReminder = () => {

  const [reminders, setReminders] = useState([])
  const [bulkDelete, setBulkDelete] = useState([])
  const [arrange, setArrange] = useState({
    past : [],
    today : [],
    future : []
  })

  useEffect(() => {
    
    if ( reminders && reminders.length > 0 ) {
        let {past,today,future} =   SortPastTodayFuture(reminders) 
        setArrange({past,today,future})
    }

    console.log("This is the arranged reminders: ", arrange);

  }, [reminders])

  useEffect(() => {

    const GetReminders = async() => {
        let userReminders = await DexieGet("Reminders") 
        if (userReminders) {
            console.log(userReminders);
            setReminders(userReminders)
        }
    }

    GetReminders()
  
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
    <div className=' w-full flex flex-col items-center gap-2 py-2 h-full overflow-hidden  ' >

        <div className="flex px-2 w-full justify-between">
            <BulkDelete bulkDelete={bulkDelete} info={reminders} type={"Reminders"} />
            <div className="sm:w-[350px] w-full">
                <SearchBar searchInfo={reminders && reminders.length > 0 ? reminders : []}  setSearchInfo={setReminders} type={"Reminders"} />
            </div>
        </div>


        <Sort setInfo={setReminders} info={reminders} sortFunctions={reminderSortFunctions} />

        <div className="flex flex-col gap-2  h-full overflow-auto px-2 w-full  ">
            {
                reminders && reminders.length > 0 
                ?
                <div className='flex flex-col gap-2' >
                    {
                        arrange.past && arrange.past.length > 0 
                        ?
                        <>
                            <div className="font-bold">Past</div>
                            {
                                arrange.past.map((obj,index) => {
                                    let dateObj = dayjs(`${obj.selectDay}T00:00`)
                                    let { monthName,dayWithSuffix } = getMonthNameWithSuffix(dateObj.$M,dateObj.$D)
                                    return (
                                        <div key={index} className=' neutral px-2 py-2 rounded  w-full grid grid-cols-[10%_90%] max-w-[700px] '>
                                            <div className="">
                                                <input type="checkbox" name={obj.systemID} id="" checked={
                                                        bulkDelete && bulkDelete.includes(obj.systemID) ? 
                                                        true 
                                                        : bulkDelete && bulkDelete.includes("all") ? 
                                                        true 
                                                        : false
                                                    } onChange={HandleBulk} />                            
                                            </div>
                                            <a href={`/edit/reminder/${obj.systemID}`} className="text-[12px] ">
                                                <div className="font-bold primaryText">{obj.title}</div>
                                                <div className=" font- ">{obj.caption}</div>
                                                <div className=" font-bold ">{monthName} {dayWithSuffix}</div>
                                                <div className={`${obj.repeat ? "flex items-center gap-1" : "hidden"} `}>
                                                    <IconSelector type={"Repeat"} size={15}/>
                                                    Every {obj.repeat}
                                                </div>
                                            </a>
                                        </div>
                                    )
                                })
                            }
                        </>
                        :<></>
                    }

                    {
                        arrange.today && arrange.today.length > 0 
                        ?
                        <>
                            <div className="font-bold">Today</div>
                            {
                                arrange.today.map((obj,index) => {
                                    let dateObj = dayjs(`${obj.selectDay}T00:00`)
                                    let { monthName,dayWithSuffix } = getMonthNameWithSuffix(dateObj.$M,dateObj.$D)
                                    return (
                                        <div key={index} className=' neutral px-2 py-2 rounded  w-full grid grid-cols-[10%_90%] max-w-[700px] '>
                                            <div className="">
                                                <input type="checkbox" name={obj.systemID} id="" checked={
                                                        bulkDelete && bulkDelete.includes(obj.systemID) ? 
                                                        true 
                                                        : bulkDelete && bulkDelete.includes("all") ? 
                                                        true 
                                                        : false
                                                    } onChange={HandleBulk} />                            
                                            </div>
                                            <a href={`/edit/reminder/${obj.systemID}`} className="text-[12px] ">
                                                <div className="font-bold primaryText">{obj.title}</div>
                                                <div className=" font- ">{obj.caption}</div>
                                                <div className=" font-bold ">{monthName} {dayWithSuffix}</div>
                                                <div className={`${obj.repeat ? "flex items-center gap-1" : "hidden"} `}>
                                                    <IconSelector type={"Repeat"} size={15}/>
                                                    Every {obj.repeat}
                                                </div>
                                            </a>
                                        </div>
                                    )
                                })
                            }
                        </>
                        :<></>
                    }

                    {
                        arrange.future && arrange.future.length > 0 
                        ?
                        <>
                            <div className="font-bold">Future</div>
                            {
                                arrange.future.map((obj,index) => {
                                    let dateObj = dayjs(`${obj.selectDay}T00:00`)
                                    let { monthName,dayWithSuffix } = getMonthNameWithSuffix(dateObj.$M,dateObj.$D)
                                    return (
                                        <div key={index} className=' neutral px-2 py-2 rounded  w-full grid grid-cols-[10%_90%] max-w-[700px] '>
                                            <div className="">
                                                <input type="checkbox" name={obj.systemID} id="" checked={
                                                        bulkDelete && bulkDelete.includes(obj.systemID) ? 
                                                        true 
                                                        : bulkDelete && bulkDelete.includes("all") ? 
                                                        true 
                                                        : false
                                                    } onChange={HandleBulk} />                            
                                            </div>
                                            <a href={`/edit/reminder/${obj.systemID}`} className="text-[12px] ">
                                                <div className="font-bold primaryText">{obj.title}</div>
                                                <div className=" font- ">{obj.caption}</div>
                                                <div className=" font-bold ">{monthName} {dayWithSuffix}</div>
                                                <div className={`${obj.repeat ? "flex items-center gap-1" : "hidden"} `}>
                                                    <IconSelector type={"Repeat"} size={15}/>
                                                    Every {obj.repeat}
                                                </div>
                                            </a>
                                        </div>
                                    )
                                })
                            }
                        </>
                        :<></>
                    }
                </div>
                : <Unavailable type={"Reminders"} />
            }
        </div>
    </div>
  )
}

export default UserViewReminder