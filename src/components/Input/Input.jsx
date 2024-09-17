import React from 'react'
import IconSelector from '../IconSelector'

const Input = ({inputName,labelText,error,value,handleChange,placeholder,type,iconType,prePlaceholder,readonly,handleClick,viewOnly}) => {

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
                {
                    readonly ? (
                        <textarea value={value} onChange={theChange} onClick={handleClick} type={type}  name={inputName} id={inputName} className="w-full pl-1 bg-transparent outline-none" rows={"1"} readOnly placeholder={placeholder} ></textarea> 

                    ) : viewOnly ? (
                        <input value={value} className='pl-1 w-full focus: invalid: bg-transparent outline-none' id={inputName} name={inputName} type={"text"} />
                    ) :                        
                    (
                        <input value={value} onChange={handleChange} className='w-full pl-1 focus: invalid: bg-transparent outline-none' id={inputName} name={inputName} type={type} placeholder={placeholder}  />
                    )
                }
            </div>
            <div className="text-[12px] accentText">{error}</div>
        </div>   
    </div>
  )
}

export default Input