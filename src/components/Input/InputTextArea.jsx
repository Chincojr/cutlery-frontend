import React, { useRef, useState } from 'react'
import IconSelector from '../IconSelector/IconSelector'



const InputDescription = ({inputName,handleChange,labelText,value,maxLength,placeholder,imageName,iconType}) => {

  let textAreaRef = useRef()


  const HandleDescChange = (event) => {
    const { name, value } = event.target; 

    handleChange({target:{name,value:value}})
  }


  const HandleReSize = () => {
    const textarea = textAreaRef.current;
    if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }
};


  return (
    <div className=" ">
        <label htmlFor={inputName} className="">{labelText}:</label>
        <div className="flex gap-1 neutral focusBorder rounded p-2">
            <div className="">
                <label htmlFor={inputName}>
                    <IconSelector type={iconType} size={20} />
                </label>
            </div>

            <textarea onInput={HandleReSize} ref={textAreaRef} value={value} onChange={HandleDescChange} className='pl-1 bg-transparent focus: outline-none w-full first-letter: h-full overflow-visible ' placeholder={placeholder} rows={"1"} id={inputName} name={inputName} maxLength={maxLength}  ></textarea>
        </div>
        <div className="w-full flex justify-end text-[12px]">{value ? `${value.length}` :  "0" }/{maxLength}</div>



    </div>
  )
}

export default InputDescription