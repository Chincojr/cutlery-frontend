import React, { useState } from 'react'
import IconSelector from '../IconSelector/IconSelector'

const SearchBar = ({searchInfo, setSearchInfo}) => {
  
  const [completeSearchInfo, setCompleteSearchInfo] = useState(searchInfo)
  const [searchText, setSearchText] = useState("")

  const HandleBack = () => {
    setSearchInfo(completeSearchInfo)
    setSearchText("")

  }

  const HandleSearch = (event) => {
    if (event.target.value === "") {
        HandleBack()
        return
    }
    setSearchText(event.target.value)
    setSearchInfo([completeSearchInfo[0]])
  }


  return (
    <div className="flex items-center w-full gap-1">
        <div className="flex items-center">
            <button onClick={HandleBack} className={`${searchText ? "" : "hidden"} outline-none w-fit  `}>
                <IconSelector type={"Arrow"} size={25} />
            </button>
        </div>
        <div className="flex relative border-[2px] border-black px-2 py-1  w-full  rounded-[20px] items-center">
            <label htmlFor='search' className="">
                <IconSelector type={"Search"} size={25} />
            </label>
            <input id='search' name='searchText' value={searchText} onChange={HandleSearch} autoComplete="off" type="text" className=" pl-1 bg-transparent w-full outline-none " placeholder='Search...' /> 
        </div>
    </div>
  )
}

export default SearchBar