import React from 'react'
import IconSelector from './IconSelector'
import defaultUser from '../assets/defaultUser.png'

const UserInformation = ({
    chatInfo,
    setChatInfo
}) => {

  const userDetails = [
    "name",
    "email",
    "phoneNumber",
    // "systemID"
  ]

  console.log("UserInformation: ", chatInfo);
  


  return (
    <div className="w-[350px] sm:w-[400px] bg-white rounded-lg px-1 pt-1   pb-4 ">
        <div className="w-full flex justify-end ">
            <button onClick={() => setChatInfo(false)} className="rotate-45">
                <IconSelector type="Plus" size={30} />
            </button>
        </div>
        <div className="w-full flex flex-col gap-3 items-center">
          {
              chatInfo.imageID ? 
                <img src={`${process.env.REACT_APP_IMAGE_URL}${chatInfo.imageID}`} alt="" className="h-[100px] w-[100px] rounded-full" />
              :   
              <div className="border-black border-[1px] rounded-full">
                  <img src={defaultUser} alt="" className="h-[100px] w-[100px] rounded-full" />          
              </div>                                                                                                                                                               
          }

          <div className="w-full md:px-2 flex flex-col items-center ">
            {
              userDetails.map(detail => {
                return(
                  <div className="grid grid-cols-[35%_65%] w-full gap-1 ">
                    <div className=" w-full font-bold capitalize">{detail}:</div>
                    <div className="w-full italic font-light ">{chatInfo[detail]}</div>
                  </div>
                )
              })
            }            
          </div>

        </div>
    </div>
  )
}

export default UserInformation