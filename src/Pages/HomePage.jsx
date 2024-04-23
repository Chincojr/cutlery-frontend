import React from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'


const HomePage = () => {
  return (
    <div className='h-screen overflow-hidden'>
        <Header />
        <div className="grid lg:grid-cols-[20%_80%] h-full ">
            <div className=" hidden lg:flex ">
                <Sidebar />
            </div>
            
        </div>
    </div>
  )
}

export default HomePage