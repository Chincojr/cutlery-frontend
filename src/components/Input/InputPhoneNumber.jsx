import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useState } from 'react'


const InputPhoneNumber = ({inputName,labelText,error,handleChange,value, placeholder}) => {


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
