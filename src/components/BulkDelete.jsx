import React, { useState } from 'react'
import IconSelector from './IconSelector'
import Loading from './Loading'
import { DeleteInfoMessage } from '../UtilityObjs';
import { RequestDeleteInfo } from '../RequestFunction';
import Notify from './Notify';

/**
 * Component to handle bulk deletion of information.
 * 
 * @param {Array} bulkDelete - Array of system IDs of information to be deleted.
 * @param {Array} info - Array of information objects from which to select the information to be deleted.
 * @param {string} type - Type of information to be deleted (e.g. "Events", "Notifications", etc.).
 * 
 * This component renders a button with a trash can icon. When clicked, it displays a confirmation dialog with a list of the selected information.
 * If the user confirms, it sends a request to the backend to delete the selected information, and updates the notification state to reflect the outcome of the request.
 * If the request is successful, it will reload the page.
 * If the request fails, it will display a failure notification.
 * It also sets a timeout to clear the notification after 2 seconds.
 */
const BulkDelete = ({ bulkDelete, info, type}) => {
  
  /**
   * Array to store selected information for bulk deletion.
   * @type {Array}
   */
  let selectInfo = []

  /**
   * State to manage notification outcome and message.
   * @type {{outcome: null|string, message: string}}
   */
  const [notify, setNotify] = useState({
    outcome: null,
    message: ""
  })

  /**
   * State to control overlay visibility.
   * @type {boolean}
   */
  const [overlay, setOverlay] = useState(false)

  /**
   * State to control loading spinner visibility.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false)


  /**
   * Selects the information for bulk deletion based on the bulkDelete prop.
   * If bulkDelete is an array with a single element of "all", it sets the
   * selectInfo to the entire info array. Otherwise, it filters the info array
   * to only include the items with the corresponding system IDs from the bulkDelete array.
   * @type {Array}
   */
  if (bulkDelete && bulkDelete.length == 1 && bulkDelete[0] === "all") {
    selectInfo = info
  }

  /**
   * Selects the information for bulk deletion based on the bulkDelete prop.
   * If bulkDelete is an array with multiple elements, it filters the info array
   * to only include the items with the corresponding system IDs from the bulkDelete array.
   * @type {Array}
   */
  if (bulkDelete && bulkDelete.length > 0 && !bulkDelete.includes("all")) {
    selectInfo = info.filter((val) => bulkDelete.includes(val.systemID))
  }

  /**
   * Sets the overlay state to true, displaying the confirmation dialog.
   */
  const HandleConfirm = () => {
    setOverlay(true)
  }

  /**
   * Handles the deletion of the selected information.
   * 
   * Sends a request to the backend to delete the selected information, and
   * updates the notification state to reflect the outcome of the request.
   * If the request is successful, it will reload the page.
   * If the request fails, it will display a failure notification.
   * It also sets a timeout to clear the notification after 2 seconds.
   */
  const HandleDelete = async() => {
    let infoSystemIds = []
    selectInfo.forEach(info => {
      infoSystemIds.push(`${info.systemID}`)
    });
    console.log("Delete: ",{ type,infoSystemIds});

    setLoading(true)
    let deleteInfo = await RequestDeleteInfo(type,infoSystemIds)    
    setLoading(false)
    setOverlay(false)


    if (deleteInfo) {
      setNotify({
        outcome: true,
        message: DeleteInfoMessage["success"]
      })
      window.location.reload()
    } else {
      setNotify({
        outcome: false,
        message: DeleteInfoMessage["failure"]
      })
    }

    setTimeout(() => {
      setNotify({
          outcome: null,
          message: ""
        })
    }, 2000);

    
  }

  /**
   * Handles canceling the bulk deletion process.
   * When called, it will set the overlay state to false, effectively closing the confirmation overlay.
   */
  const HandleCancel = () => {
    setOverlay(false)
  }
  

  return (
    <div className={` ${bulkDelete && bulkDelete.length > 0 ? "visisble" : "invisible"} `}>
        <button onClick={HandleConfirm} className=" text-white outline-none w-[100px] flex items-center accent rounded-lg justify-center py-1 gap-1">
            <div className="">Delete</div>
            <IconSelector type={"Delete"} color={"white"} />
        </button>
        <div className={`absolute overlayBg ${overlay ? "" : "hidden"} inset-0 z-10 flex items-center justify-center`}>
          <div className="bg-white max-h-[300px] rounded p-5 overflow-hidden flex flex-col gap-2">

            <div className="font-bold">
              Do you want to delete the following :
            </div>
            <div className="overflow-auto">
              {
                selectInfo && selectInfo.length >0
                ?
                selectInfo.map((obj,index) => {
                  return(
                    <div key={index} className="">{obj.title}</div>
                  )
                })
                : <></>
              }
            </div>

            <div className="text-white w-full py-2 flex items-center justify-center gap-10">
                    <button onClick={HandleCancel} className="rounded-[20px] outline-none uppercase primary p-2 px-4 text-[14px]">Cancel</button>
                    <button onClick={HandleDelete} className="rounded-[20px] outline-none uppercase accent p-2 px-4 text-[14px]">Delete</button>
            </div>

          </div>
        </div>
        <div className={ ` ${loading ? "" : "hidden"} absolute inset-0 z-50 `}>
          <Loading loading={loading} />
        </div>
        <Notify outcome={notify.outcome} message={notify.message} />
    </div>
  )
}

export default BulkDelete