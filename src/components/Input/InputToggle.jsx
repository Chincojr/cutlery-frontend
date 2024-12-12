import React from 'react'

/**
 * A toggle input component with a label and a button.
 * Clicking the label or button toggles the state between true and false.
 * The button reflects the current state with a change in background color
 * and animation. Calls the `handleChange` function with the updated state.
 *
 * @param {string} labelText - The text to display as the label.
 * @param {string} inputName - The name attribute for the toggle button.
 * @param {boolean} value - The current state of the toggle button.
 * @param {function} handleChange - The function to call when the toggle state changes.
 */
const InputToggle = ({
    labelText,
    inputName,
    value,
    handleChange
  }) => {

  /**
   * Handles the toggle button click event. Calls the `handleChange` function with a new event object that has the `name` property set to the `inputName` and the `value` property set to the opposite of the current value of the toggle button.
   */
  const HandleSelect = () => {
    handleChange({target:{name:inputName,value:!value}})
  }

  return (
    <div  className="flex justify-between items-center ">
        <div onClick={HandleSelect} className="cursor-pointer">{labelText}</div>
        <button onClick={HandleSelect} id={inputName} name={inputName} className={`${ value ? "bg-[#a6bfad]" : "bg-[#e6cac8]" } rounded-[20px] w-[40px] outline-none `}>
            <div className={` h-[20px] w-[20px] ${value ? "secondary animate-toggleRight translate-x-full" : "accent animate-toggleLeft"} rounded-full  `}>
            </div>
        </button>
    </div>


  )
}

export default InputToggle

