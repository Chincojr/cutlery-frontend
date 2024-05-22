import React, { useState } from 'react'

const InputToggle = ({labelText,inputName,value,handleChange}) => {

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

