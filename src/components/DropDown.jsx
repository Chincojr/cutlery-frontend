import React from 'react'

/**
 * A component to render a dropdown menu.
 * The position prop can be used to adjust the position of the dropdown relative to its parent.
 * The children of the component will be rendered as the contents of the dropdown.
 * @param {{children: React.ReactNode, position?: string}} props
 * @returns {JSX.Element}
 */
const DropDown = ({children, position}) => {
  return (
    <div className={`${position ? position : ""} absolute top-[100%] bg-red-400`}>
        {children}
    </div>
  )
}

export default DropDown