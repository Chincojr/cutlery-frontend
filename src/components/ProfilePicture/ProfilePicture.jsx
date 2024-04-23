import React, { useState } from 'react'
import IconSelector from '../IconSelector/IconSelector'

const ProfilePicture = ({size}) => {
    
  const [userImage, setUserImage] = useState(false)

  return (
    <div className="">
        {
            userImage ? (
                <></>
            ) : (
                <a href="/user-profile" className="">
                    <IconSelector type={"User"} size={size} />
                </a>
            )
            
        }
    </div>
  )
}

export default ProfilePicture