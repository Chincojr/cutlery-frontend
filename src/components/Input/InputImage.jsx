import React from 'react'
import IconSelector from '../IconSelector'
import uploadImage from '../../assets/uploadImage.png'
import Uploader from '../Uploader'



/**
 * A component for displaying and managing an image input field.
 * Allows the user to upload or clear an image, and displays an error message if needed.
 *
 * @param {string} name - The name of the image input field.
 * @param {function} setInfo - The function to update the image information state.
 * @param {object} info - The current image information state.
 * @param {string} error - The error message to display, if any.
 * @param {function} handleInvalid - Optional function to handle invalid image input.
 */
const InputImage = ({
    name,
    setInfo,
    info,
    error,
    handleInvalid
  }) => {

  /**
   * Clears the image for the given input field name.
   * Updates the image information state by setting the value to an empty string.
   * @param {string} name - The name of the input field.
   */
  const HandleClearImage = (name) => {
      setInfo({
          ...info,
          [name]: ""
      })
  } 


  /**
   * Adds an image to the given input field name.
   * Updates the image information state by setting the value to the given image.
   * If a handleInvalid function is provided, calls it with the input field name and the given image.
   * @param {string} value - The image to add.
   */
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
      <div className="w-[200px] h-[200px] group/img relative">
        <img src={info[name] ? info[name] : uploadImage} alt="" className= {`border-black border-2 w-full h-full object-cover `} />
        <button onClick={() => HandleClearImage(name)}className=" accent group-hover/img:flex rotate-45 hidden h-[30px] w-[30px] items-center justify-center rounded-full absolute top-1 left-1 ">
            <IconSelector type={"Plus"} color={"white"} size={17}/>
        </button>
        <div className="primary h-[35px] w-[35px] rounded-full group-hover/img:flex hidden justify-center items-center absolute right-[5px] bottom-[10px]">
          <Uploader color={"white"} size={15} setSelectedFile={HandleAddImage}  uploadType={"image/*"} />
        </div>
      </div>
      <div className="text-[12px] accentText">{error}</div>
    </div>
  )
}

export default InputImage