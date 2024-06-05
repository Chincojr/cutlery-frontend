import React, { useState } from 'react'
import IconSelector from '../IconSelector/IconSelector'

const ProfilePicture = ({size,link}) => {
    
  const [userImage, setUserImage] = useState(false)

  return (
    <div className="">
        {
            userImage ? (
                <></>
            ) : (
                <a href={`${link ? link : '/user-profile'}`} className="">
                    <IconSelector type={"User"} size={size} />
                </a>
            )
            
        }
    </div>
  )
}

export default ProfilePicture