import React, { useEffect, useState } from 'react'
import ProfilePicture from '../../components/ProfilePicture'
import Uploader from '../../components/Uploader'
import Input from '../../components/Input/Input'
import { getNextReminder, HandleLogOut } from '../../UtilityFunctions'
import IconSelector from '../../components/IconSelector'
import PageContainer from '../PageContainer'
import ReminderPopUp from '../../components/ReminderPopUp'
import { RequestProfileChange } from '../../RequestFunction'


/**
 * Renders the User Account page.
 *
 * This component allows users to view and update their profile information, 
 * including their name and image. It also enables users to set reminders and 
 * log out. The component handles various states such as loading, profile 
 * changes, and reminder pop-up display.
 *
 * @param {Object} userObject - The object containing user-specific information.
 * @param {boolean} logged - Indicates if the user is logged in.
 * @returns {JSX.Element} The rendered User Account component.
 */
const UserAccount = ({userObject,logged}) => {

  /**
   * State to store the user's image.
   * @type {boolean|string}
   */
  const [userImage, setUserImage] = useState(false);

  /**
   * State to store the user's image.
   * @type {boolean|string}
  */
    const [newUserImage, setNewUserImage] = useState(false);
  
  /**
   * State to store the user's name.
   * @type {string|null}
   */
  const [userName, setUserName] = useState(null);
  
  /**
   * State to store the reminder date.
   * @type {string}
   */
  const [reminderDate, setReminderDate] = useState("Reminder not Set");
  
  /**
   * State to trigger the reminder pop-up.
   * @type {boolean}
   */
  const [displayReminderPopUp, setDisplayReminderPopUp] = useState(false)
  // const [triggerReminderPopUp, setTriggerReminderPopUp] = useState(false);
  
  /**
   * State to allow profile changes.
   * @type {boolean}
   */
  const [allowProfileChange, setAllowProfileChange] = useState(false);
  
  /**
   * State to indicate loading status.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  const HandleNameChange = (event) => {
    setAllowProfileChange(true);
    setUserName(event.target.value)
  }
  const HandleImageChange = (image) => {
    setAllowProfileChange(true);
    setUserImage(image);
  }

  /**
   * Resets the user's image and name to their original values.
   *
   * This function checks if the userObject is defined and attempts to reset
   * the userImage and userName states to the user's original image and name.
   * If the userObject is not defined, it sets the userImage to false and 
   * userName to null. It also sets allowProfileChange to false to prevent
   * any profile changes from being saved.
   */
  const HandleClear = () => {
    if (userObject) {
      let image = userObject && userObject.imageID ? `${process.env.REACT_APP_IMAGE_URL}${userObject.imageID}` : null
      let name = userObject && userObject.name ? userObject.name : null
      setUserImage(image);
      setUserName(name);
    } else {
      setUserImage(false);
      setUserName(null)      
    }

    setAllowProfileChange(false)

  }

  /**
   * Handles profile changes by updating the user's name and/or image.
   * 
   * This function checks if the userObject is defined and if the user's
   * name and/or image has changed. If the userObject is defined and
   * changes are detected, it calls the RequestProfileChange function
   * and passes the updated user information. If the request is successful,
   * it reloads the page to reflect the changes. If the request is not
   * successful, it sets the loading state to false and does not make
   * any changes to the user's profile.
   */
  const HandleProfileChange = async () => {
    setLoading(true)
    setAllowProfileChange(false)
    
    let image = userObject && userObject.imageID && `${process.env.REACT_APP_IMAGE_URL}${userObject.imageID}` === userImage ? null : userImage
    let name = userName

    let profileUpdate = await RequestProfileChange({name,image});
    setLoading(false)
    if (profileUpdate) {
      window.location.reload(true);
    }    

        
  }

  /**
   * Handles the display of the reminder pop-up by setting the triggerReminderPopUp
   * state to true.
   */
  const HandleDisplayReminderPopUp = () => {    
    setDisplayReminderPopUp(true)
  }



  useEffect(() => {
    /**
     * Sets the reminder date to the user's next reminder date if it exists
     */
    if (userObject && userObject.nextReminder) {
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      let date = new Date(userObject.nextReminder);
      /**
       * The user's next reminder date in short date format (e.g. "Wed Aug 12 2026")
       * @type {string}
       */
      setReminderDate(date.toLocaleDateString('en-US', options))
    }

    
    /**
     * The user's profile picture URL or null if they don't have one
     * @type {string|null}
     */
    let image = userObject && userObject.imageID ? userObject.imageID : null
    /**
     * The user's name or null if they don't have one
     * @type {string|null}
     */
    let name = userObject && userObject.name ? userObject.name : null
    setUserImage(image);
    setUserName(name);
    

  }, [userObject])


  
  

  return (
    <PageContainer loading={loading} userObject={userObject} logged={logged}  >
      <div className="h-full grid grid-rows-[80%_20%] justify-center py-4  ">
          <div className="flex flex-col items-center px-2 gap-2 h-full">
                  
            <div className="w-fit h-fit relative">
              {
                userImage ?
                  <div className="h-[100px] w-[100px] rounded-full border-[1px] border-black flex">
                    <ProfilePicture userImage={userObject && userObject.imageID == userImage  ? `${process.env.REACT_APP_IMAGE_URL}${userImage}` : userImage} size={120} />
                  </div>                
                :
                  <ProfilePicture userImage={userImage} size={120} />
              }

              <div className="primary h-[35px] w-[35px] rounded-full flex justify-center items-center absolute right-[5px] bottom-[0px]">
                <Uploader color={"white"} size={20} setSelectedFile={HandleImageChange}  uploadType={"image/*"} />
              </div>
            </div>

            <div className="">
              <Input inputName={"changeName"} labelText={"Change Name"} value={userName} handleChange={HandleNameChange} placeholder={"Enter new name"} type={"text"} iconType={"Edit"} /> 
            </div>
            {
              allowProfileChange ?
              <div className="flex justify-between w-full">
                <button onClick={HandleProfileChange} className="w-[30px] h-[30px] rounded-full secondary">
                  <IconSelector type={"Check"} color={"white"} />
                </button>
                <button onClick={HandleClear} className="outline-none w-[30px] h-[30px] rounded-full accent flex items-center justify-center rotate-45">
                  <IconSelector type={"Plus"} color={"white"} size={20} />
                </button>
              </div>           
              :<></>       
            }

            <div className="w-full border-t-[1px] py-1 flex flex-col gap-2">
              <div className="w-full font-semibold">
                Next reminder
              </div>
              <div className="text-[14px] text-center">{reminderDate}</div>
              <button onClick={HandleDisplayReminderPopUp} className="rounded-md outline-none capitalize primary p-2 px-4 text-[14px] w-full text-white">set reminder</button>

            </div>


          </div>
          <div className=" text-white w-full flex flex-col items-center  ">
                <button onClick={HandleLogOut} className="rounded-md outline-none uppercase accent p-2 px-4 text-[14px]">LOG OUT</button>
          </div>

          {
            displayReminderPopUp ?
              <ReminderPopUp 
                userObject={userObject} 
                displayReminderPopUp={displayReminderPopUp}
                setDisplayReminderPopUp={setDisplayReminderPopUp}
              /> 
            : <></>
          }      
      </div>     

    </PageContainer>
  )
}

export default UserAccount