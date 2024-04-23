import React from 'react'
import IconSelector from '../IconSelector/IconSelector';



const DatePick = ({valueDate,valueTime,handleChange,datename,timename,labelText,minDate,minTime,errorDay,errorTime}) => {

  return (
    <div className="">
        <label htmlFor={datename} className="">{labelText}:</label>
        <div className="flex gap-2 ">
                <div className={`${datename ? "flex" : "hidden"}  neutral items-center focusBorder w-full rounded px-1 py-2 ${errorDay ? "invalidBorder" : ""} `}>
                    <div className="lg:hidden">
                        <label htmlFor={datename}>
                            <IconSelector type={"Date"} size={20} />
                            
                        </label>
                    </div>
                    <input type="date" min={minDate} value={valueDate} onChange={handleChange} className=' pl-1 bg-transparent w-full outline-none ' name={datename} id={datename} />                   
                </div>
                <div className={`${timename ? "flex" : "hidden"} neutral items-center focusBorder w-full  rounded px-1 py-2 ${errorTime ? "invalidBorder" : ""} `}>
                    <div className="lg:hidden">
                        <label htmlFor={timename}>
                            <IconSelector type={"Time"} size={20} />
                        </label>
                    </div>
                    <input type="time" min={minTime} value={valueTime} onChange={handleChange} className=' pl-1 bg-transparent w-full outline-none ' name={timename} id={timename} />
                </div>
        </div>
        <div className="text-[12px] accentText">{errorDay}</div>
        <div className="text-[12px] accentText">{errorTime}</div>
    </div>
  )
}

export default DatePick



















