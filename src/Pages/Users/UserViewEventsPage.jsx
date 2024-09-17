import React from 'react'
import UserViewEvents from '../../components/UserViewEvents'
import PageContainer from '../PageContainer'

const UserViewEventsPage = ({userObject,logged}) => {
  return (
    <PageContainer userObject={userObject} logged={logged} >
      <div className="flex flex-col h-full overflow-hidden  ">
        <div className="w-full flex flex-between items-center px-2">
            <div className="font-bold text-2xl py-4 w-full p-">Upcoming Events</div>
        </div>
        <UserViewEvents userObject={userObject} />
      </div>
    </PageContainer>
  )
}

export default UserViewEventsPage