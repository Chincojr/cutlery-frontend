import React from 'react'
import IconSelector from './IconSelector'

const ProfilePicture = ({userImage,size,link}) => {
    
  return (
    <div className="">
        {
            userImage ? (
                <img src={userImage} alt="" className="w-full h-full rounded-full object-cover" />
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