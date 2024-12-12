import React from 'react'
import IconSelector from '../IconSelector'

/**
 * A form select component, with a label and a select field.
 * Also displays an error message if the error prop is set.
 * The select field has options from the values array.
 *
 * @param {string} inputName - The name of the select field.
 * @param {string} labelText - The text to display next to the select field.
 * @param {string} error - The error message to display.
 * @param {array} values - The array of options to display in the select field.
 * @param {function} handleChange - The function to call when the select field changes.
 * @param {string} iconType - The type of icon to display.
 */
const InputSelect = ({
        inputName,
        labelText,
        error,
        values,
        handleChange,
        iconType
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
                <select className='outline-none w-full bg-transparent focus: ' onChange={handleChange} name={inputName} id={inputName}>
                    {
                        values.map((value) => (
                            <option value={value}>{value}</option>
                        ))
                    }
                </select>               
            </div>
            <div className="text-[12px] accentText">{error}</div>
        </div>   
    </div>
  )
}

export default InputSelect