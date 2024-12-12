import React from 'react'
import IconSelector from './IconSelector'

/**
 * A component to display a user's profile picture.
 * If no userImage is provided, a User IconSelector is displayed, which links to the user's profile.
 * @param {string} userImage - The URL of the user's profile picture.
 * @param {number} size - The size of the User IconSelector to display if there is no userImage.
 * @param {string} link - The link to the user's profile, if different from the default '/user-profile'.
 * @returns {JSX.Element} The JSX element of the ProfilePicture component.
 */
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