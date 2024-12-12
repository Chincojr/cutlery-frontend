import React from 'react'
import IconSelector from '../IconSelector'

/**
 * A component that displays a labeled icon with a value.
 * 
 * @param {string} labelText - The label text to display next to the icon.
 * @param {string} prePlaceholder - Text to display before the value.
 * @param {string} iconType - The type of icon to display.
 * @param {string} value - The value to display next to the icon.
 * @param {string} inputName - The name attribute for the displayed elements.
 */
const InputView = ({
        labelText,
        prePlaceholder,
        iconType,
        value,
        inputName
    }) => {
  return (
    <div>
        <div className="">
            <label htmlFor={inputName} className={labelText ? "" : "hidden"}>{labelText}:</label>
            <div className={`flex neutral items-center focusBorder  rounded px-1 py-2`}>
                <div className="">
                    <label htmlFor={inputName}>
                        <IconSelector type={iconType} size={20} />
                    </label>
                </div>
                <div className="pl-1">{prePlaceholder}</div>
                <div className='pl-1 w-full h-fit focus: invalid: bg-transparent outline-none' id={inputName} name={inputName}>{value}</div> 
            </div>
        </div>   
    </div>
  )
}

export default InputView