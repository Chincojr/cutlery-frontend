import React from 'react'
import IconSelector from '../../components/IconSelector'
import AdminViewEvents from '../../components/AdminViewEvents'
import PageContainer from '../PageContainer'

const AdminViewEventsPage = ({userObject,logged}) => {
  return (
    <PageContainer userObject={userObject} logged={logged}>
        <div className="flex flex-col overflow-hidden p-2">
            <div className="w-full h-fit flex flex-between items-center">
                <div className="font-bold text-2xl py-4 w-full p-">Events</div>
                <a href="/admin/new/event" className="">
                    <IconSelector type={"Plus"} />
                </a>
            </div>
            <AdminViewEvents userObject={userObject} />
        </div>
    </PageContainer>
  )
}

export default AdminViewEventsPage