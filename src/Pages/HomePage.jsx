import React from 'react'
import Header from '../components/Header'
import visitStore from '../assets/visit-store.webp'

/**
 * The Home Page of the website, contains the hero section, about and services sections
 * @param {object} userObject - The user object
 * @param {boolean} logged - Whether the user is logged in or not
 * @returns {ReactElement} The JSX element of the home page
 */
const HomePage = ({userObject,logged}) => {
  return (
    <div className='h-screen overflow-hidden flex flex-col '>
        <Header userObject={userObject} displaySideBar={true} logged={logged} />
        <div className="grid h-full overflow-auto gap-7 pb-5 ">

          {/* Hero */}
          <div className="bg-hero bg-cover h-full relative ">

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
                <a target='_blank' href='/register' className="outline-none primary px-3 py-2 text-center">
                  Create Account
                </a>
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

        </div>
    </div>
  )
}

export default HomePage