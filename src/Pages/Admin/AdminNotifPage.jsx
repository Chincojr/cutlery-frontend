import React from 'react'
import AdminNotifs from '../../components/AdminNotifs'
import IconSelector from '../../components/IconSelector'
import { useParams } from 'react-router-dom'
import PageContainer from '../PageContainer'



const AdminNotifPage = ({userObject,logged}) => {

  let {notifyID} = useParams() 

  return (
    <PageContainer userObject={userObject} logged={logged}>
      <div className="flex flex-col overflow-auto h-full">
        <a href='/admin/view/notify' className="w-full p-2 px-2">
            <IconSelector type={"Arrow"} />
        </a>
        <div className="font-bold text-2xl py-4 w-full text-center">
            {notifyID ? "Edit" : "Create New"} Notification
        </div>
        <AdminNotifs userObject={userObject} />
      </div>
    </PageContainer>
  )
}

export default AdminNotifPage