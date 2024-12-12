import React from 'react'
import IconSelector from '../../components/IconSelector'
import AdminEvent from '../../components/AdminEvent'
import { useParams } from 'react-router-dom'
import PageContainer from '../PageContainer'

const AdminEventsPage = ({userObject,logged}) => {

  let {eventID} = useParams() 
  
  
  return (
    <PageContainer userObject={userObject} logged={logged} >
      <div className="flex flex-col overflow-hidden ">
        <a href='/admin/view/events' className="w-full p-2 px-2">
            <IconSelector type={"Arrow"} />
        </a>
        <div className="font-bold text-2xl py-4 w-full text-center">
          {eventID
          ? "Edit" : "Create New"} Event
        </div>
        <AdminEvent userObject={userObject}/>
      </div>
    </PageContainer>
  )
}

export default AdminEventsPage