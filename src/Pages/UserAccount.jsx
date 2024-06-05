import React, { useState } from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import ProfilePicture from '../components/ProfilePicture/ProfilePicture'
import Uploader from '../components/Uploader/Uploader'
import Input from '../components/Input/Input'
import { HandleLogOut } from '../UtilityFunctions'



const UserAccount = () => {

  const [userImage, setUserImage] = useState(false)
  const [userName, setUserName] = useState("")


  const HandleNameChange = (event) => {
    setUserName(event.target.value)
  }


  return (
    <div className='h-screen overflow-hidden'>
        <Header />
        <div className="grid lg:grid-cols-[20%_80%] h-full ">
          <div className=" hidden lg:flex ">
            <Sidebar />
          </div>
          <div className="h-full grid grid-rows-[80%_20%] justify-center py-4  ">
            <div className="flex flex-col items-center px-2 gap-2 h-full">
                
                <div className="w-fit h-fit relative">
                  <ProfilePicture size={100} />
                  <div className="primary h-[35px] w-[35px] rounded-full flex justify-center items-center absolute right-[5px] bottom-[10px]">
                    <Uploader color={"white"} size={20} setSelectedFile={setUserImage}  uploadType={"image/*"} />
                  </div>
                </div>

                <div className="">
                  <Input inputName={"changeName"} labelText={"Change Name"} value={userName} handleChange={HandleNameChange} placeholder={"Enter new name"} type={"text"} iconType={"Edit"} /> 
                </div>

            </div>
            <div className=" text-white w-full flex flex-col items-center  ">
                  <button onClick={HandleLogOut} className="rounded-md outline-none uppercase accent p-2 px-4 text-[14px]">LOG OUT</button>
            </div>
          </div>

        </div>
    </div>
  )
}

export default UserAccount