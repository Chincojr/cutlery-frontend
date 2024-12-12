import React, { useState } from 'react'
import IconSelector from './IconSelector'
import { SearchInfoBasedOfType } from '../UtilityFunctions';

/**
 * A component that renders a search bar with an input field and a search icon.
 * The search bar is used to filter the information based on the search text and type.
 * When the search is cancelled, the search info is reset to its original state before the search took place.
 * @param {Array<{}>} searchInfo - The original information to be searched.
 * @param {function} setSearchInfo - The function to update the searched information state.
 * @param {string} type - The type of search to be performed. Can be "Messages", "Events", "Users", or any other type as needed.
 * @param {boolean} noBorder - Whether or not to display a border around the search bar. Default is false.
 * @param {function} otherFunctions - Any other functions to be called when the search is cancelled. Optional.
 * @returns {ReactElement} The JSX element of the search bar.
 */
const SearchBar = ({searchInfo, setSearchInfo , type, noBorder,otherFunctions}) => {
  
  /**
   * State variable that stores the original search info before the search took place.
   * It is used to reset the search info to its original state when the search is cancelled.
   * @type {Array<{}>}
   */
  const [unFilteredSearchInfo, setUnFilteredSearchInfo] = useState()
  /**
   * State variable that stores the search text entered by the user.
   * It is used to display the search text in the input field.
   * @type {string}
   */
  const [searchText, setSearchText] = useState("")

  /**
   * Resets the searchInfo to its original state before the search took place,
   * resets the searchText to an empty string, and calls the otherFunctions
   * that were passed as a prop if they exist.
   */
  const HandleBack = () => {
    setSearchInfo(unFilteredSearchInfo)
    setSearchText("")
    if (otherFunctions) {
      otherFunctions()
    }

  }

  /**
   * Handles the search functionality of the SearchBar component.
   * 
   * It takes the value of the input field and if it is an empty string,
   * it calls the HandleBack function. Otherwise, it sets the search text to the value, 
   * calls the SearchInfoBasedOfType function to filter the information based on the search text and type,
   * sets the unfiltered search info to the result of the search, and sets the search info to the filtered result.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const HandleSearch = (event) => {
    let {value} = event.target
    if (value === "") {
        HandleBack()
        return
    }
    setSearchText(value)
    let info = unFilteredSearchInfo ? unFilteredSearchInfo : searchInfo;    
    
    let searchResult = SearchInfoBasedOfType(info,value,type)    
    setUnFilteredSearchInfo(searchResult.unfilteredInfo)
    setSearchInfo(searchResult.filteredInfo)
  }


  return (
    <div className="flex items-center w-full gap-1">
        <div className="flex items-center">
            <button onClick={HandleBack} className={`${searchText ? "" : "hidden"} outline-none w-fit  `}>
                <IconSelector type={"Arrow"} size={25} />
            </button>
        </div>
        <div className={`flex relative  ${noBorder ? "" : "border-black border-[2px]" } px-2 py-1  w-full  rounded-[20px] items-center`}>
            <label htmlFor='search' className="">
                <IconSelector type={"Search"} size={25} />
            </label>
            <input id='search' name='searchText' value={searchText} onChange={HandleSearch} autoComplete="off" type="text" className=" pl-1 bg-transparent w-full outline-none " placeholder='Search...' /> 
        </div>
    </div>
  )
}

export default SearchBar