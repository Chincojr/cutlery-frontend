import React from 'react'
import AdminViewNotifs from '../../components/AdminViewNotifs'
import IconSelector from '../../components/IconSelector'
import PageContainer from '../PageContainer'


const AdminViewNotifsPage = ({userObject, logged}) => {
  return (
    <PageContainer userObject={userObject} logged={logged}>
        <div className="flex flex-col overflow-hidden p-2">
            <div className="w-full h-fit flex flex-between items-center">
                <div className="font-bold text-2xl py-4 w-full ">Notifications</div>
                <a href="/admin/new/notify" className="secondary py-1 px-2 justify-center items-center text-white w-[100px] flex rounded-lg gap-1">
                    <div className="">Create</div>
                    <IconSelector type={"Plus"} size={27} />
                </a>
            </div>
            <AdminViewNotifs userObject={userObject} />
        </div>
    </PageContainer>
  )
}

export default AdminViewNotifsPage