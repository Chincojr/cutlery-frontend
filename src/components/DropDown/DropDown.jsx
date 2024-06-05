import React from 'react'

const DropDown = ({children, position}) => {
  return (
    <div className={`${position ? position : ""} absolute top-[100%] bg-red-400`}>
        {children}
    </div>
  )
}

export default DropDown