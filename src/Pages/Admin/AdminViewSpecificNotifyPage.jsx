import React from 'react'
import AdminViewSpecificNotify from '../../components/AdminViewSpecificNotify'
import PageContainer from '../PageContainer'



const AdminViewSpecificNotifyPage = ({userID,userObject,logged}) => {
  return (
    <PageContainer userObject={userObject} logged={logged}  >
        <div className="flex flex-col overflow-hidden p-2">
            <div className="w-full h-fit flex flex-between items-center">
                <div className="font-bold text-2xl py-4 w-full p-">Notifications</div>
            </div>
            <AdminViewSpecificNotify userID={userID} userObject={userObject} />
        </div>
    </PageContainer>

  )
}

export default AdminViewSpecificNotifyPage