import React from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Loading from '../components/Loading'

const PageContainer = ({children,userObject,displaySideBar,logged,loading}) => {
  return (
    <div className='h-screen overflow-hidden flex flex-col '>
      <Header userObject={userObject} displaySideBar={displaySideBar}  logged={logged} />
      <div className="grid lg:grid-cols-[20%_80%] h-full overflow-hidden">
        <div className=" hidden lg:flex ">
          <Sidebar />
        </div>
        {children}
      </div>
      <Loading loading={loading} />
  </div>
  )
}

export default PageContainer