import React from 'react'

const notifs = [
    {
        id: 1,
        "title": "Retrun System",
        "caption": "You can return",
        "selectDay": "2024-04-19",
        "selectTime": "03:14",
        "state" : "Pending",
    },
    {
        id: 2,
        "title": "Retrun ",
        "caption": "You can return Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia sunt commodi incidunt quaerat, libero dolor iste quisquam laudantium, atque reiciendis harum! Fuga beatae, perspiciatis officia porro pariatur consequuntur expedita adipisci.",
        "selectDay": "2024-04-29",
        "selectTime": "03:14",
        "state" : "Sent",
    }
]

const AdminViewNotifs = () => {
  return (
    <div className='overflow-auto w-full' >
        <div className='w-full min-w-[500px] border-[1px] border-black  ' >
            <div className=' grid grid-cols-4 border-b-[1px] border-black w-full' >
                <div className="px-2">
                     <input type="checkbox" name={"all"} id="" />
                </div>
                <div className=''>Title</div>
                <div className=''>Content</div>
                <div className=''>Date</div>
            </div>
            {
                notifs.map((obj,index) => {
                    return (
                        <div className='even:bg-[#ecf0f1] grid grid-cols-4 py-2 group/item '>
                            <div className="px-2 ">
                                <input type="checkbox" name={obj.id} id="" />
                            </div>
                            <div className="primaryText grid grid-rows-2">
                                <div className='font-bold textOverflow  ' >{obj.title}</div>
                                <div className="group-hover/item:visible invisible flex gap-2 text-[12px] font-normal items-center">
                                    <a href="" className="">Edit</a>
                                    <a href="" className="">View</a>
                                    <button className="outline-none">Delete</button>
                                </div>
                            </div>
                            <div className=' textOverflow font-light ' >{obj.caption}</div>
                            <div className="font-light text-[12px]">
                                <div className="">{obj.state}</div>
                                <div className=' '>{obj.selectDay} at {obj.selectTime}</div>
                            </div>
                        </div>
                    )
                })
            }
        </div> 
    </div>
  )
}

export default AdminViewNotifs