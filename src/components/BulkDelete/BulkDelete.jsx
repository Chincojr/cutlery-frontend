import React, { useState } from 'react'
import IconSelector from '../IconSelector/IconSelector'
import Loading from '../Loading/Loading'
import { useCookies } from 'react-cookie';
import { DeleteInfoMessage, allCookies } from '../../UtilityObjs';
import { RequestDeleteInfo } from '../../RequestFunction';
import Notify from '../Notify/Notify';

const BulkDelete = ({ bulkDelete, info, type}) => {
  
  const [cookies, setCookie, removeCookie] = useCookies(allCookies);
  let selectInfo = []
  const [notify, setNotify] = useState({
    outcome: null,
    message: ""
  })
  const [overlay, setOverlay] = useState(false)
  const [loading, setLoading] = useState(false)
  if (bulkDelete && bulkDelete.length == 1 && bulkDelete[0] === "all") {
    selectInfo = info
  }

  if (bulkDelete && bulkDelete.length > 0 && !bulkDelete.includes("all")) {
    selectInfo = info.filter((val) => bulkDelete.includes(val.systemID))
  }

  const HandleConfirm = () => {
    setOverlay(true)
  }

  const HandleDelete = async() => {
    let infoSystemIds = []
    selectInfo.forEach(info => {
      infoSystemIds.push(`'${info.systemID}'`)
    });
    console.log(JSON.stringify({ids:infoSystemIds, type,adminUid:cookies.adminUid,uid:cookies.uid}));

    setLoading(true)
    let deleteInfo = await RequestDeleteInfo(type,cookies.uid,infoSystemIds,cookies.adminUid)
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

  const HandleCancel = () => {
    setOverlay(false)
  }
  

  return (
    <div className={` ${bulkDelete && bulkDelete.length > 0 ? "visisble" : "invisible"} `}>
        <button onClick={HandleConfirm} className="outline-none">
            <IconSelector type={"Delete"} color={"#e74c3c"} />
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