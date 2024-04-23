import React, { useState } from 'react'

const InputToggle = ({labelText,inputName,value,handleChange}) => {

  const [select, setSelect] = useState(value)

  const HandleSelect = () => {
    setSelect(!select)
    handleChange({target:{name:inputName,value:!select}})
  }

  return (
    <div  className="flex justify-between items-center ">
        <div onClick={HandleSelect} className="cursor-pointer">{labelText}</div>
        <button onClick={HandleSelect} id={inputName} name={inputName} className={`${ select ? "bg-[#a6bfad]" : "bg-[#e6cac8]" } rounded-[20px] w-[40px] outline-none `}>
            <div className={` h-[20px] w-[20px] ${select ? "secondary animate-toggleRight translate-x-full" : "accent animate-toggleLeft"} rounded-full  `}>
            </div>
        </button>
    </div>


  )
}

export default InputToggle

