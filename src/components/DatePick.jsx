import React from 'react'
import IconSelector from './IconSelector';


/**
 * A component for displaying and managing a date and time input field.
 * The component is divided into two parts, with the date input on the left and the time input on the right.
 * The component also displays an error message if the date or time is invalid.
 *
 * @param {string} valueDate - The current value of the date input.
 * @param {string} valueTime - The current value of the time input.
 * @param {function} handleChange - The function to call when the date or time input changes.
 * @param {string} datename - The name attribute for the date input field.
 * @param {string} timename - The name attribute for the time input field.
 * @param {string} labelText - The label text to display above the date and time input fields.
 * @param {string} minDate - The minimum date that can be selected.
 * @param {string} minTime - The minimum time that can be selected.
 * @param {string} errorDay - The error message to display if the date is invalid.
 * @param {string} errorTime - The error message to display if the time is invalid.
 *
 * @returns {JSX.Element} The rendered date and time input component.
 */
const DatePick = ({
        valueDate,
        valueTime,
        handleChange,
        datename,
        timename,
        labelText,
        minDate,
        minTime,
        errorDay,
        errorTime
    }) => {

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



















