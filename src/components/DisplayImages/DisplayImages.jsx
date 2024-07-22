import React, { useRef, useState } from 'react'
import IconSelector from '../IconSelector/IconSelector'


const DisplayImages = ({images , pending}) => {

  console.log({images, pending});
  let fourImgs = images.length > 4 ?  images.slice(0, 4) : false
  const [display, setDisplay] = useState(false)
  const [imageInView, setImageInView] = useState(0)
  const imageViewContainer = useRef(null);


  const HandleMoveImage = (type) => {
    if (imageViewContainer.current) {

        imageViewContainer.current.style.transition = 'transform 0.3s ease-in-out';
        console.log("entered");
        switch (type) {
            case "forward":
                if (imageInView < images.length - 1) {
                    setImageInView(imageInView + 1);
                    imageViewContainer.current.style.transform = `translateX(-${imageInView+1}00vw)`;

                }
                break;
            case "backward":
                if (imageInView > 0) {
                    setImageInView(imageInView - 1);
                    imageViewContainer.current.style.transform = `translateX(-${imageInView-1}00vw)`;

                }
                break;
            default:
                break;
        }        

    }

    

    console.log(images.length,type,imageInView,images[imageInView]);
  }

  const HandleImageDisplay = () => {
    if (display) {
        setImageInView(0)
    }
    setDisplay(!display)

  }

  return (
    <div className="w-fit">

        {
            display  ?
                <div className="absolute bg-black inset-0 z-[999999999] h-full w-full  ">

                    <div className={` relative h-full `}>

                        <div className="flex justify-end w-full p-2 absolute top-0 inset-x-0 z-[999999] ">
                            <button onClick={HandleImageDisplay} className="rotate-45 w-fit">
                                <IconSelector type={"Plus"} color={"white"} />
                            </button>                
                        </div>

                        <div ref={imageViewContainer} className={ `grid grid-flow-col h-full    `}>
                            {
                                images.map((img, index) => {
                                    return (
                                        <div key={index} className={` w-[100vw]  h-full  flex items-center justify-center  `}>
                                            {
                                                pending ?
                                                    <img src={img.data} alt="" className="  " />    
                                                :
                                                <img src={`${process.env.REACT_APP_IMAGE_URL}${img}`} alt="" className=" h-[100px] w-[200px] " />    


                                            }
                                        </div>
                                    )
                                })
                            } 
                        </div>                     


                        <button onClick={() => HandleMoveImage("backward")} className="absolute bg-[#0d3b5e80] top-[45%] w-[50px] h-[100px] flex justify-center items-center rounded-r  ">
                            <div className="">
                                <IconSelector type={"Arrow"} color={"white"} />
                            </div>                        
                        </button>

                        <button onClick={() => HandleMoveImage("forward")} className="absolute bg-[#0d3b5e80] top-[45%] right-0 w-[50px] h-[100px] flex justify-center items-center rounded-l ">
                            <div className="rotate-180">
                                <IconSelector type={"Arrow"} color={"white"} />
                            </div>                        
                        </button>

                    </div>


                </div>
            :<></>
        }
        {
            fourImgs ? 
            <div className="grid grid-cols-2 grid-rows-1 w-[250px] gap-2">
                {
                    fourImgs.map((img,index) => {
                        return (
                            <button onClick={HandleImageDisplay} className='relative'>
                                <img src={!pending ? `${process.env.REACT_APP_IMAGE_URL}${img}` : img.data} alt="" className="w-full rounded-lg " />
                                <div className={`overlayBg absolute inset-0 ${index === 3 ? "flex" : "hidden"} rounded-lg text-[40px] text-white items-center justify-center object-cover `}>{images.length - 4 }+ </div>
                            </button>
                        )
                    })
                }
            </div>
            : (
                <div className="flex w-fit gap-2 items-center">
                    {
                        images.map((img) => {
                            return (
                                <button onClick={HandleImageDisplay} className="">
                                    <img src={!pending ? `${process.env.REACT_APP_IMAGE_URL}${img}` : img.data} alt="" className="w-full max-h-[200px] rounded-lg" />
                                </button>
                            )
                        })                        
                    }
                </div>

            )
        }
    </div>
  )
}

export default DisplayImages