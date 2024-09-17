import React from 'react'
import IconSelector from '../IconSelector'

const InputView = ({labelText,prePlaceholder,iconType,value,inputName}) => {
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