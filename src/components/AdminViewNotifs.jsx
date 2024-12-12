import React, { useEffect, useState } from 'react'
import Unavailable from './Unavailable';
import SearchBar from './SearchBar';
import Sort from './Sort';
import BulkDelete from './BulkDelete';

/**
 * Array of functions used to sort admin notifications.
 * 
 * This array contains the keys by which admin notifications can be sorted.
 * The available sort options include sorting by title, date created, and date modified.
 * 
 * @type {Array<string>}
 */
const adminNotifySortFunctions = ["Title", "Date created", "Date modified"];


/**
 * AdminViewNotifs component for viewing and managing notifications.
 * 
 * This component renders a table for viewing notifications, a search bar for
 * filtering notifications, and a sorting component for sorting notifications.
 * It also renders a bulk select and delete component for deleting multiple
 * notifications at once.
 * 
 * The component takes in a userObject prop, which should contain the user's
 * notification data. It uses this data to populate the table and other UI
 * components.
 * 
 * @param {object} userObject - The object containing the user's notification data.
 * @returns {JSX.Element} The rendered component displaying the notifications table and controls.
 */
const AdminViewNotifs = ({userObject}) => {
    
  /**
   * State hook for notifications list.
   * @type {Array}
   */
  const [notifs, setNotifs] = useState([])

  /**
   * State hook for tracking selected notifications for bulk delete.
   * @type {Array}
   */
  const [bulkDelete, setBulkDelete] = useState([])

  useEffect(() => {

    /**
     * Fetches and sets the user's notifications if available.
     * 
     * This asynchronous function checks if the userObject is defined
     * and contains a Notify property. If these conditions are met,
     * it updates the notifs state with the user's notification data.
     */
      const GetNotifs = async() => {
        if (userObject && userObject.Notify) {            
            setNotifs(userObject.Notify)
        }
      }
      GetNotifs()
  }, [userObject]) 

  /**
   * Handles the bulk select/deselect checkboxes for notifications.
   * 
   * When a checkbox is checked, it adds the event ID to the bulkDelete
   * state array. If the checkbox is unchecked, it removes the event ID
   * from the bulkDelete state array. If the "all" checkbox is
   * checked/unchecked, it sets the bulkDelete state to either ["all"] or
   * an empty array.
   * @param {object} event - The event object from the checkbox element.
   */
  const HandleBulk = (event) => {
    let { name} = event.target;

    if (name === "all") {
        setBulkDelete(["all"])
        return
    }

    if (bulkDelete.includes(name)) {
        let newBulkEdit = bulkDelete.filter((val) => val !== name )
        setBulkDelete(newBulkEdit)
    }else {
        if (bulkDelete.includes("all")) {
            setBulkDelete([name])
        } else {
            setBulkDelete([...bulkDelete,name])
        }
        
    }
  }


  return (
    <div className='overflow-auto w-full flex flex-col gap-2 h-fit'>
        <div className="flex px-2 w-full justify-between">
            <BulkDelete bulkDelete={bulkDelete} info={notifs} type={"Notify"} />
            <div className="sm:w-[350px] w-full">
                <SearchBar searchInfo={notifs} setSearchInfo={setNotifs} type={"Notify"} />
            </div>
        </div>

        <Sort setInfo={setNotifs} info={notifs} sortFunctions={adminNotifySortFunctions} />


        {
            notifs && notifs.length > 0
            ?
            <div className='w-full min-w-[600px] border-[1px] border-black overflow-hidden flex flex-col  '>
                <div className=' grid col-span-full grid-cols-4 border-b-[1px] border-black w-full' >
                    <div className="px-2">
                        <input type="checkbox" name={"all"}  checked={ bulkDelete && bulkDelete.includes("all") ? true : false } onChange={HandleBulk} />
                    </div>
                    <div className=''>Title</div>
                    <div className=''>Content</div>
                    <div className=''>Publish Date</div>

                </div>
                <div className="w-full h-full flex flex-col overflow-y-auto">
                {
                    notifs.map((obj,index) => {
                        
                        let created = obj.created_at.split(" ")
                        let createdDate = created[0];
                        let createdTime = created[1];
                        return (
                            <div key={index} className='even:bg-[#ecf0f1] grid col-span-full grid-cols-4 py-2 group/item '>
                                <div className="px-2 ">
                                    <input type="checkbox" name={obj.systemID} id="" checked={
                                        bulkDelete && bulkDelete.includes(obj.systemID) ? 
                                        true 
                                        : bulkDelete && bulkDelete.includes("all") ? 
                                        true 
                                        : false
                                    } onChange={HandleBulk} />
                                </div>
                                <div className="primaryText grid grid-rows-2">
                                    <div className='font-bold textOverflow  ' >{obj.title}</div>
                                    <div className="group-hover/item:visible invisible flex gap-2 text-[12px] font-normal items-center">
                                        <a href={`/admin/edit/notify/${obj.systemID}`}className="">Edit</a>
                                        <a href={`/admin/view/notify/${obj.systemID}`} className="">View</a>
                                    </div>
                                </div>
                                <div className=' textOverflow font-light ' >{obj.caption}</div>
                                <div className="font-light text-[12px]">
                                    {createdDate} at {createdTime}
                                </div>
                            </div>
                        )
                    })
                }
                </div>

            </div> 
            : <Unavailable type={"Notify"} />
        }

    </div>
  )
}

export default AdminViewNotifs