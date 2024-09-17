import React from 'react'
import AdminViewNotifs from '../../components/AdminViewNotifs'
import IconSelector from '../../components/IconSelector'
import PageContainer from '../PageContainer'


const AdminViewNotifsPage = ({userObject, logged}) => {
  return (
    <PageContainer userObject={userObject} logged={logged}>
        <div className="flex flex-col overflow-hidden p-2">
            <div className="w-full h-fit flex flex-between items-center">
                <div className="font-bold text-2xl py-4 w-full p-">Notifications</div>
                <a href="/admin/new/notify" className="">
                    <IconSelector type={"Plus"} />
                </a>
            </div>
            <AdminViewNotifs userObject={userObject} />
        </div>
    </PageContainer>
  )
}

export default AdminViewNotifsPage