import React, { useEffect, useState } from 'react'
import ProfilePicture from '../../components/ProfilePicture'
import Uploader from '../../components/Uploader'
import Input from '../../components/Input/Input'
import { getNextReminder, HandleLogOut } from '../../UtilityFunctions'
import IconSelector from '../../components/IconSelector'
import PageContainer from '../PageContainer'
import ReminderPopUp from '../../components/ReminderPopUp'
import { RequestProfileChange } from '../../RequestFunction'


const UserAccount = ({userObject,logged}) => {

  const [userImage, setUserImage] = useState(false)
  const [userName, setUserName] = useState(null)
  const [reminderDate, setReminderDate] = useState("Reminder not Set")
  const [triggerReminderPopUp, setTriggerReminderPopUp] = useState(false)
  const [allowProfileChange, setAllowProfileChange] = useState(false);
  const [loading, setLoading] = useState(false)

  const HandleNameChange = (event) => {
    setAllowProfileChange(true);
    setUserName(event.target.value)
  }
  const HandleImageChange = (image) => {
    setAllowProfileChange(true);
    setUserImage(image);
  }

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

  const HandleProfileChange = async () => {
    setLoading(true)
    setAllowProfileChange(false)
    
    let image = userObject && userObject.imageID && `${process.env.REACT_APP_IMAGE_URL}${userObject.imageID}` === userImage ? null : userImage
    let name = userObject && userObject.name === userName ? null : userName

    let profileUpdate = await RequestProfileChange({name,image});
    setLoading(false)
    if (profileUpdate) {
      window.location.reload(true);
    }    

        
  }

  const HandleDisplayReminderPopUp = () => {
    setTriggerReminderPopUp(true)
  }

  const HandleHideReminderPopUp = () => {
    setTriggerReminderPopUp(false)
  }

  const HandleSaveReminderPopUp = () => {
    HandleHideReminderPopUp();
    window.location.reload(true);
  }


  useEffect(() => {

    if (userObject && userObject.nextReminder) {
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      let date = new Date(userObject.nextReminder);
      
      setReminderDate(date.toLocaleDateString('en-US', options))
    }

    
    let image = userObject && userObject.imageID ? `${process.env.REACT_APP_IMAGE_URL}${userObject.imageID}` : null
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
                    <ProfilePicture userImage={userImage} size={120} />
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
          <ReminderPopUp userObject={userObject} triggerDisplayExt={triggerReminderPopUp} HandleDismissExt={HandleHideReminderPopUp} HandleSaveExt={HandleSaveReminderPopUp}  />                
      </div>     

    </PageContainer>
  )
}

export default UserAccount