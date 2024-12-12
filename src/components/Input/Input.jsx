import React from 'react'
import IconSelector from '../IconSelector'

/**
 * A form input component, with a label and an input field.
 * Also displays an error message if the error prop is set.
 * The input field has a placeholder and an icon.
 *
 * @param {string} inputName - The name of the input field.
 * @param {string} labelText - The text to display next to the input field.
 * @param {string} error - The error message to display.
 * @param {string} value - The value of the input field.
 * @param {function} handleChange - The function to call when the input field changes.
 * @param {string} placeholder - The placeholder text to display in the input field.
 * @param {string} type - The type of the input field.
 * @param {string} iconType - The type of icon to display.
 * @param {string} prePlaceholder - The text to display before the placeholder.
 */
const Input = ({
        inputName,
        labelText,
        error,
        value,
        handleChange,
        placeholder,
        type,
        iconType,
        prePlaceholder
    }) => {

    const theChange = () => {

    }

  return (
    <div>
        <div className="">
            <label htmlFor={inputName} className={labelText ? "" : "hidden"}>{labelText}:</label>
            <div className={`flex neutral items-center focusBorder  rounded px-1 py-2 ${error ? "invalidBorder" : ""}`}>
                <div className="">
                    <label htmlFor={inputName}>
                        <IconSelector type={iconType} size={20} />
                    </label>
                </div>
                <div className="pl-1">{prePlaceholder}</div>
                <input value={value} onChange={handleChange} className='w-full pl-1 focus: invalid: bg-transparent outline-none' id={inputName} name={inputName} type={type} placeholder={placeholder}  />
            </div>
            <div className="text-[12px] accentText">{error}</div>
        </div>   
    </div>
  )
}

export default Input