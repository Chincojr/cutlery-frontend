import React, { useRef } from 'react'

/**
 * A component for displaying and managing a text area input field.
 * Allows the user to input and edit text, and displays an error message if needed.
 *
 * @param {string} inputName - The name of the text area input field.
 * @param {function} handleChange - The function to call when the text area input changes.
 * @param {string} labelText - The label text to display above the text area field.
 * @param {string} value - The current value of the text area input.
 * @param {number} maxLength - The maximum number of characters allowed in the text area input.
 * @param {string} placeholder - The placeholder text to display in the text area input.
 * @param {string} errorText - The error message to display, if any.
 */
const InputTextArea = ({
    inputName,
    handleChange,
    labelText,
    value,
    maxLength,
    placeholder,        
    errorText
  }) => {

  /**
   * Reference to the textarea element.
   * @type {React.RefObject<HTMLTextAreaElement>}
   */
  let textAreaRef = useRef()

  /**
   * Handles the change event of the text area input. Calls the `handleChange`
   * function with a new event object that has the `name` property set to the
   * `inputName` and the `value` property set to the new value of the text area
   * input.
   * @param {object} event - The event object triggered by the text area input.
   */
  const HandleDescChange = (event) => {
    const { name, value } = event.target; 
    handleChange({target:{name,value:value}})
  }

  /**
   * Adjusts the height of the textarea element to fit its content.
   * Sets the height to a minimum value and then updates it based on the scrollHeight,
   * ensuring the content is fully visible without a vertical scrollbar.
   */
  const HandleReSize = () => {
    const textarea = textAreaRef.current;
    textarea.style.height = "10px"
    if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  };


  return (
    <div className=" ">
        <label htmlFor={inputName} className="">{labelText}:</label>
        <div className="flex gap-1 neutral focusBorder rounded p-2 ">
            <textarea onInput={HandleReSize} ref={textAreaRef} value={value} onChange={HandleDescChange}  className='pl-1 bg-transparent text-wrap break-all focus: outline-none w-full overflow-hidden resize-none ' placeholder={placeholder} rows={"1"} id={inputName} name={inputName} maxLength={maxLength}  > </textarea>
        </div>
        <div className="w-full flex justify-end text-[12px]">{value ? `${value.length}` :  "0" }/{maxLength}</div>        
        <div className="text-[12px] accentText">{errorText}</div>
    </div>
  )
}

export default InputTextArea