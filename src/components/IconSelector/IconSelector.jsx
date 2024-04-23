import React from 'react'
import { HiMiniBars3 } from "react-icons/hi2";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { HiOutlineBell } from "react-icons/hi2";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineCamera } from "react-icons/hi2";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineHome } from "react-icons/hi2";
import { CiRepeat } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi2";
import { LuBellPlus } from "react-icons/lu";
import { BiCalendarPlus } from "react-icons/bi";



const IconSelector = ({type,size,className,color}) => {

  if (!size) {
    size = 30
  }

  switch (type) {
    case "Bars":
      return (
        <HiMiniBars3 size={size} color={color} className={className} />
      )
    case "User":
      return (
        <HiOutlineUserCircle size={size} color={color} className={className} />
      )
    case "Home":
      return (
        <HiOutlineHome size={size} color={color} className={className} />
      )
    case "Notify":
      return (
        <HiOutlineBell size={size} color={color} className={className} />
      )
    case "Arrow":
      return (
        <HiOutlineArrowLeft size={size} color={color} className={className} />
      )
    case "Plus":
      return (
        <HiOutlinePlus size={size} color={color} className={className} />
      )
    case "Camera":
      return (
        <HiOutlineCamera size={size} color={color} className={className} />
      )
    case "Edit":
      return (
        <AiOutlineEdit size={size} color={color} className={className} />
      )
    case "Repeat":
      return (
        <CiRepeat size={size} color={color} className={className} />
      )
    case "Search":
      return (
        <CiSearch  size={size} color={color} className={className} />
      )
    case "Delete":
      return (
        <MdOutlineDelete  size={size} color={color} className={className} />
      )
    case "Reminder":
      return (
        <HiOutlineClock  size={size} color={color} className={className} />
      )
    case "CreateNotify":
      return (
        <LuBellPlus   size={size} color={color} className={className} />
      )
    case "CreateEvent":
      return (
        <BiCalendarPlus  size={size} color={color} className={className} />
      )
    default:
      return (
        <></>
      )
        break;
  }


}

export default IconSelector

