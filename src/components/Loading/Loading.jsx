import React from 'react'
import blocks from '../../assets/loading.mp4'


const Loading = ({loading}) => {
    return (
        <div className={`${ loading ? "flex" : "hidden"} justify-center items-center absolute inset-0 bg-white `}>
            <div className="relative">
                <video muted loop autoPlay className=''>
                    <source src={blocks} type="video/mp4" />
                </video>
                <div className="absolute transparent inset-0"></div>
            </div>
        </div>
    )
}

export default Loading

