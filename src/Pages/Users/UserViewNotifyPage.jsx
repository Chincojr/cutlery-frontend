import React from 'react'
import UserViewNotify from '../../components/UserViewNotify'
import PageContainer from '../PageContainer'

const UserViewNotifyPage = ({userID,userObject,logged}) => {
  return (
    <PageContainer userObject={userObject} logged={logged} >
      <div className="flex flex-col px-2 h-full overflow-hidden  ">
        <div className="w-full flex flex-between items-center ">
            <div className="font-bold text-2xl py-4 w-full sm:text-3xl ">Notifications</div>
        </div>
        <UserViewNotify userID={userID} userObject={userObject} />
      </div>
    </PageContainer>
  )
}

export default UserViewNotifyPage