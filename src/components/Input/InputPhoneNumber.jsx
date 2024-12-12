import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useState } from 'react'


/**
 * A phone number input component utilizing react-phone-number-input.
 * 
 * @param {string} inputName - The name attribute for the input element.
 * @param {string} labelText - The label text to display above the input field.
 * @param {string} error - The error message to display below the input field.
 * @param {function} handleChange - The function to call when the input value changes.
 * @param {string} value - The current value of the phone number input.
 * @param {string} placeholder - The placeholder text for the phone number input.
 * 
 * @returns {JSX.Element} The rendered phone number input component.
 */
const InputPhoneNumber = ({
    inputName,
    labelText,
    error,
    handleChange,
    value, 
    placeholder
  }) => {


  /**
   * Handles the change event of the phone number input. Calls the `handleChange`
   * function with a new event object that has the `name` property set to the
   * `inputName` and the `value` property set to the new value of the phone number
   * input.
   * @param {string} val - The new value of the phone number input.
   */
  const HandleChange = (val) => {
    handleChange({target:{name:inputName,value:val}})
  }
  
  return (
        <div className="flex flex-col gap-2">
            <label htmlFor={inputName} className={labelText ? "" : "hidden"}>{labelText}:</label>
            <div className={`neutral px-1 py-2 rounded ${error ? "invalidBorder" : ""} focusBorder`}>
                <PhoneInput
                    placeholder={placeholder}
                    value={value}
                    onChange={HandleChange}
                />
            </div>
            <div className="text-[12px] accentText">{error}</div>
        </div>   

  )
}

export default InputPhoneNumber
