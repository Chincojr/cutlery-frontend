import React from 'react'
import IconSelector from './IconSelector';
import { UnavailableMessage } from '../UtilityObjs';


const Unavailable = ({type}) => {
  return (
    <div className="flex flex-col items-center gap-2 h-full justify-center py-5 w-full col-span-full">
        <IconSelector type={UnavailableMessage[type].iconType} size={150} />
        <div className="italic text-lightgray"> {UnavailableMessage[type].text} </div>
    </div>
  )
}

export default Unavailable