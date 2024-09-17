import React from 'react'
import IconSelector from '../IconSelector'

const InputSelect = ({inputName,labelText,error,values,handleChange,iconType}) => {
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
                <select className='outline-none w-full bg-transparent focus: ' onChange={handleChange} name={inputName} id={inputName}>
                            {
                                values.map((value) => (
                                    <option value={value}>{value}</option>
                                ))
                            }
                </select>               
            </div>
            <div className="text-[12px] accentText">{error}</div>
        </div>   
    </div>
  )
}

export default InputSelect