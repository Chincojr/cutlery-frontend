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
import { CiLogin } from "react-icons/ci";
import { LuAlarmClockOff } from "react-icons/lu";
import { MdEventNote } from "react-icons/md";
import { IoNotificationsOffOutline } from "react-icons/io5";
import { TbMessages } from "react-icons/tb";
import { TbMessagesOff } from "react-icons/tb";
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import { RiSendPlane2Fill } from "react-icons/ri";
import { PiArrowClockwiseFill } from "react-icons/pi";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoIosCheckmark } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { MdMobiledataOff } from "react-icons/md";
import { PiUsersFour } from "react-icons/pi";
import { MdDelete } from "react-icons/md";





/**
 * A component that renders an icon based on the type parameter.
 * The rendered icon has its size set to the size parameter, its class name set to the className parameter, and its color set to the color parameter.
 * The available icon types are: Bars, User, Home, Notify, Arrow, Plus, Camera, Edit, Repeat, Search, Delete, Reminder, CreateNotify, CreateEvent, Login, NoReminders, Event, NoNotify, Msgs, NoMsg, Reply, Send, Pending, Copy, Check, and DropArrow.
 * If the type parameter is not recognized, an empty fragment is returned.
 * @param {string} type - The type of the icon to render.
 * @param {number} [size=30] - The size of the icon.
 * @param {string} [className=""] - The class name of the icon.
 * @param {string} [color=""] - The color of the icon.
 * @returns A JSX element representing the icon.
 */
const IconSelector = ({type,size = 30,className,color}) => {

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
    case "Login":
      return (
        <CiLogin   size={size} color={color} className={className} />
      )
    case "NoReminders":
      return (
        <LuAlarmClockOff size={size} color={color} className={className} />
      )
    case "Event":
      return (
        <MdEventNote size={size} color={color} className={className} />
      )
    case "NoNotify":
      return (
        <IoNotificationsOffOutline  size={size} color={color} className={className} />
      )
    case "Msgs":
      return (
        <TbMessages   size={size} color={color} className={className} />
      )
    case "NoMsg":
      return (
        <TbMessagesOff   size={size} color={color} className={className} />
      )
    case "Reply":
      return (
        <MdSubdirectoryArrowLeft  size={size} color={color} className={className} />
      )
    case "Send":
      return (
        <RiSendPlane2Fill  size={size} color={color} className={className} />
      )
    case "Pending":
      return (
        <PiArrowClockwiseFill  size={size} color={color} className={className} />
      )
    case "Copy":
      return (
        <MdOutlineContentCopy  size={size} color={color} className={className} />
      )
    case "Check":
      return (
        <IoIosCheckmark  size={size} color={color} className={className} />
      )
    case "DropArrow":
      return (
        <IoIosArrowForward  size={size} color={color} className={className} />
      )
    case "Offline":
      return (
        <MdMobiledataOff  size={size} color={color} className={className} />
      )      
    case "Users":
      return (
        <PiUsersFour  size={size} color={color} className={className} />
      )            
    default:
      return (
        <></>
      )
        break;
  }


}

export default IconSelector


