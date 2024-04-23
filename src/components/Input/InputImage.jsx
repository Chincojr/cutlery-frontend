import React from 'react'
import IconSelector from '../IconSelector/IconSelector'
import uploadImage from '../../assets/uploadImage.png'
import Uploader from '../Uploader/Uploader'



const InputImage = ({name,setInfo,info,error,handleInvalid}) => {


  const HandleClearImage = (name) => {
      setInfo({
          ...info,
          [name]: ""
      })
  } 

  const HandleAddImage = (value) => {
    setInfo({
      ...info,
      [name]: value
    })
    if (handleInvalid) {
      handleInvalid(name,value)
    }
  }

  return (
    <div className={` flex justify-center flex-col items-center `} >
      <div className="w-[200px] h-[200px] relative">
        <img src={info[name] ? info[name] : uploadImage} alt="" className= {`border-black border-2  w-full h-full `} />
        <button onClick={() => HandleClearImage(name)}className="accent rotate-45 flex h-[30px] w-[30px] items-center justify-center rounded-full absolute top-1 left-1 ">
            <IconSelector type={"Plus"} color={"white"} size={17}/>
        </button>
        <div className="primary h-[35px] w-[35px] rounded-full flex justify-center items-center absolute right-[5px] bottom-[10px]">
          <Uploader color={"white"} size={15} setSelectedFile={HandleAddImage}  uploadType={"image/*"} />
        </div>
      </div>
      <div className="text-[12px] accentText">{error}</div>
    </div>
  )
}

export default InputImage