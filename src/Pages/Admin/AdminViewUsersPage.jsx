import React from 'react'
import PageContainer from '../PageContainer'
import AdminViewUsers from '../../components/AdminViewUsers'

const AdminViewUsersPage = ({
    userObject,
    logged
}) => {  
    
  return (
    <PageContainer userObject={userObject} logged={logged} >
        <div className="flex flex-col overflow-hidden p-2">
            <div className="w-full h-fit flex flex-between items-center">
                <div className="font-bold text-2xl py-4 w-full p-">Users</div>
            </div>
            <AdminViewUsers userObject={userObject} />
        </div>
    </PageContainer>
  )
}

export default AdminViewUsersPage