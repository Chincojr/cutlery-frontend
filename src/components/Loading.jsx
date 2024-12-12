import React from 'react'
import blocks from '../assets/loading.mp4'


/**
 * Loading component that displays a loading animation.
 * The component is absolutely positioned and overlays everything else on the page.
 * It is hidden by default and can be shown by setting the loading prop to true.
 * @param {boolean} loading - Whether or not the loading animation should be shown.
 * @returns {JSX.Element} The JSX element of the Loading component.
 */
const Loading = ({loading}) => {
    return (
        <div className={`${ loading ? "flex" : "hidden"} justify-center items-center absolute inset-0 bg-white z-[999999999] `}>
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

