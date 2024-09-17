import React from 'react'
import UserViewSpecificEvent from '../../components/UserViewSpecificEvent'
import PageContainer from '../PageContainer'


const UserViewSpecificEventPage = ({userObject, userID, logged}) => {
  return (
    <PageContainer userObject={userObject} logged={logged} >
      <UserViewSpecificEvent userID={userID} userObject={userObject} />
    </PageContainer>
  )
}

export default UserViewSpecificEventPage