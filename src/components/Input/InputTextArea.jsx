import React, { useRef } from 'react'

const InputTextArea = ({inputName,handleChange,labelText,value,maxLength,placeholder,imageName,readonly,errorText}) => {

  let textAreaRef = useRef()

  const HandleDescChange = (event) => {
    const { name, value } = event.target; 
    handleChange({target:{name,value:value}})
  }

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
        {
          readonly ?
           <></> 
          :   
          <div className="w-full flex justify-end text-[12px]">{value ? `${value.length}` :  "0" }/{maxLength}</div>
        }

        <div className="text-[12px] accentText">{errorText}</div>



    </div>
  )
}

export default InputTextArea