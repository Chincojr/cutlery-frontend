import React from 'react'
import PageContainer from './PageContainer'
import Unavailable from '../components/Unavailable'

const OfflinePage = ({
    userObject,
    logged,    
}) => {
  return (
    <PageContainer userObject={userObject} logged={logged}>
      <div className="flex items-center">
        <Unavailable type={"Offline"}  />
      </div>        
    </PageContainer>
  )
}

export default OfflinePage