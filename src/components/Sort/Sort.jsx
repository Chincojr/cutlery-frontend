import React, { useState } from 'react'
import InputSelect from '../Input/InputSelect'
import { SortInfoBasedOfKey } from '../../UtilityFunctions';

const Sort = ({info,setInfo, sortFunctions}) => {

  const [sortInfo, setSortInfo ] = useState({
      order: "Ascending",
      sortBy: "Title",
  })

  const HandleChange = (event) => {
    const { name, value } = event.target; 
    setSortInfo({
        ...sortInfo,
        [name]: value,
    });  
  };

  const  HandleSort =async () => {
    let sortedInfo = await SortInfoBasedOfKey(sortInfo.order,sortInfo.sortBy,info)
    console.log("This is the sorted info: ",sortInfo, sortedInfo);
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