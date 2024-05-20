import React from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import visitStore from '../assets/visit-store.webp'
import knifeShapen from '../assets/knife-sharpening.webp'
import scissor from '../assets/scissor.webp'
import gallery1 from '../assets/gallery1.webp'
import gallery2 from '../assets/gallery2.webp'
import gallery3 from '../assets/gallery3.webp'
import gallery4 from '../assets/gallery4.webp'
import gallery5 from '../assets/gallery5.webp'
import gallery6 from '../assets/gallery6.webp'
import gallery7 from '../assets/gallery7.webp'
import gallery8 from '../assets/gallery8.webp'



const GalleryImages = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8
]

const HomePage = () => {
  return (
    <div className='h-screen overflow-hidden grid grid-rows-[11%_89%] '>
        <Header />
        <div className="grid h-full overflow-auto gap-7 ">

          {/* Hero */}
          <div className="bg-hero bg-auto h-full relative ">

            <div className=" overlayBg inset-0 flex items-center h-full py-[10%]  ">

              <div className=" text-white flex flex-col gap-2 px-5">
                <div className="text-[20px]">Cutlery Collection</div>
                <div className="font-bold text-[28px] bg-[#105B9260] px-3 border-b-[1px] "> Keeping your knives sharp just makes sense. </div>

                <div className="font-semibold">
                  <div className="">Knife sharpening is a science, and we are the Professor!</div>
                  <div className="">Knife Sharpening is our Passion, Knives are our Game!</div>
                  <div className="">The Knife Sharpening Authority!</div>
                </div>

                <div className="">Discover the Joy of a Newly Sharpened Knife!</div>
                <button className="outline-none primary px-3 py-2">
                  Contact Us
                </button>
                <img src={visitStore} alt="" className="w-[150px] h-[150px]" />
              </div>

            </div>

          </div>

          
          {/* About */}
          <div className="px-[10%]">

            <div className=" flex flex-col sm:flex-row justify-center items-center gap-2">
              <div className=" border-[1px] grow border-black w-full "> </div>
              <div className="text-[36px] flex-none font-bold text-center w-fit">ABOUT CUTLERY COLLECTION</div>
              <div className=" border-[1px] grow border-black w-full "> </div>
              <hr />
            </div>

            <div className="text-center">
              Since 1979 Cutlery Collection has been offering the Dallas-Ft Worth area a “World of Knives” under one roof. Quality knives, cutlery, scissors, and old fashioned service has been our hallmark for decades. As a full service Cutlery shop we offer professional knife, scissor, and razor sharpening. Our experience and knowledge is a valuable resource available to collectors all over the world! For now we will be adding new items to the Gallery as they arrive.
            </div>

          </div>


          {/* Our Services */}
          <div className="px-[10%]">

            <div className=" flex flex-col sm:flex-row justify-center items-center gap-2">
              <div className=" border-[1px] grow border-black w-full "> </div>
              <div className="text-[36px] flex-none font-bold text-center w-fit">OUR SERVICES</div>
              <div className=" border-[1px] grow border-black w-full "> </div>
              <hr />
            </div>

            <div className="grid grid-flow-cols sm:grid-flow-col  text-white gap-2 ">

              <div className="h-[320px] bg-knifeShapen bg-center bg-cover relative ">
                <a href='https://cutlerycollection.net/knife-sharpening-plano-2/' className="font-bold items-center text-center text-[38.5px] flex justify-center absolute inset-0">
                  KNIFE <br /> SHARPENING
                </a>
              </div>
              <div className="h-[320px] bg-scissor bg-cover bg-center relative ">
                <a href='https://cutlerycollection.net/scissor-sharpening-plano/' className="font-bold items-center text-center text-[38.5px] flex justify-center absolute inset-0">
                SCISSOR <br />  SHARPENING
                </a>
              </div>

            </div>

          </div>



          {/* Gallery */}
          <div className="px-[10%] pb-5 ">

            <div className=" flex flex-col sm:flex-row justify-center items-center gap-2">
              <div className=" border-[1px] grow border-black w-full "> </div>
              <div className="text-[36px] flex-none font-bold text-center w-fit">OUR GALLERY</div>
              <div className=" border-[1px] grow border-black w-full "> </div>
              <hr />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 text-white gap-2 ">
                {
                  GalleryImages.map((img,index) => {
                    console.log(img);
                    return (
                      <img src={img} alt="" className="" />
                    )
                  })
                }
            </div>

          </div>


        </div>
    </div>
  )
}

export default HomePage