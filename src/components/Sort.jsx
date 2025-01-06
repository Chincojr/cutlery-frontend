import React, { useState } from 'react'
import InputSelect from './Input/InputSelect'
import { SortInfoBasedOfKey } from '../UtilityFunctions';

/**
 * A component that renders a dropdown menu for sorting and an input field for setting the order of the sort.
 * It also contains a button that triggers the sorting of the given info based on the current sorting options.
 * @param {Object} info - The info that needs to be sorted.
 * @param {Function} setInfo - The function that sets the sorted info.
 * @param {Array<string>} sortFunctions - An array of functions used to sort the info.
 * @returns {React.ReactElement} A React element that contains a dropdown menu and an input field for sorting, and a button that triggers the sorting.
 */
const Sort = ({info,setInfo, sortFunctions}) => {

  /**
   * State that holds the sort information.
   * @type {{order: string, sortBy: string}}
   * @property {string} order - The order of the sort. Can be either "Ascending" or "Descending".
   * @property {string} sortBy - The key to sort by. Can be any key that is available in the objects in the info array.
   */
  const [sortInfo, setSortInfo ] = useState({
      order: "Ascending",
      sortBy: sortFunctions[0] || "",
  });

  /**
   * Handles a change in the sort options by updating the sortInfo state.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event.
   */
  const HandleChange = (event) => {
    const { name, value } = event.target; 
    setSortInfo({
        ...sortInfo,
        [name]: value,
    });  
  };

  /**
   * Sorts the given info based on the current sorting options and saves the sorted info in the state.
   * @function
   */
  const  HandleSort =async () => {
    let sortedInfo = await SortInfoBasedOfKey(sortInfo.order,sortInfo.sortBy,info)    
    setInfo([])
    setTimeout(() => {
        setInfo(sortedInfo)
    }, 1);
  }

  return (
    <>

      {
        sortFunctions && sortFunctions.length > 0 
        ?
        <div className="w-full px-2 flex justify-center sm:justify-end items-center gap-2 bg-white py-2">
            <div className="grid grid-cols-3 sm:flex gap-2 items-center justify-center w-full sm:w-fit">
                <div className="w-fit ">Sort By :</div>
                <InputSelect handleChange={HandleChange} inputName={"order"} values={["Ascending","Descending"]} />
                <InputSelect handleChange={HandleChange} inputName={"sortBy"} values={sortFunctions} />
                <button onClick={HandleSort} className="rounded outline-none uppercase primary p-2 px-4 text-[14px] text-white col-span-3  ">Sort</button>
            </div>
        </div>
        : <></>
      }
    </>

  )
}

export default Sort