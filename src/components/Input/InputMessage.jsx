import React, { useRef, useState } from 'react'
import Uploader from '../Uploader/Uploader';
import IconSelector from '../IconSelector/IconSelector';
import testDisplay from '../../assets/download.png'
import { ConvertImageInfoToDisplay, generateRandomString, getBase64Size } from '../../UtilityFunctions';
import { WSSend } from '../../Webocket';




const InputMessage = ({selectReply, handleClearSelectReply, userID, to, type,isAdmin, setPendingMessages}) => {

    // console.log("Select Reply", selectReply, userID);
    const [message, setMessage] = useState("")
    const [selectImages, setSelectImages] = useState([])
    const [disable, setDisable] = useState(false)
    let textAreaRef = useRef()


    const HandleMessage = (event) => {
        setMessage(event.target.value)
    }

    const HandleImages = async(pickedImg) => {

        let prevSelectImgsName = []
        let newImages = []
        let newSelectImgs = [...pickedImg]
        let currentSize = 0
        let maxSize =  4 * 1024 * 1024;
        // get a list of all the prev selected images name
        selectImages.forEach(img => {
            prevSelectImgsName.push(img.name)
        });


        // check in comparison if the new images has already been selected if itas already been selected remove and convert all newImages to raw img data
        for (let i = 0; i < newSelectImgs.length; i++) {
            const newImg = newSelectImgs[i];
            let checkExist = prevSelectImgsName.includes(newImg.name)
            if (!checkExist) {
                let imageData = await ConvertImageInfoToDisplay(newImg)
                newImages.push({name:newImg.name,data:imageData})
            }
        }

        [...selectImages, ...newImages].forEach(img => {
            currentSize += getBase64Size(img.data)
        });

        if (currentSize > maxSize) {
            await alert('Files size exceeds 4 MB');
        } else {
            setSelectImages([...selectImages,...newImages])
        }

    }

    const HandleClearImage = (index) => {
        let newImages = selectImages
        newImages.splice(index, 1)
        setSelectImages([...newImages])
    }

    const HandleReSize = () => {
        const textarea = textAreaRef.current;

        textarea.style.height = "10px"
        if (textarea.scrollHeight > textarea.clientHeight ) {
            textarea.style.height = `${textarea.scrollHeight > 250 && message ? 250 : textarea.scrollHeight}px`; 
        }   
        
    };

    const HandleSend = () => {
        if (message || selectImages.length > 0) {
            /*
                Disable textaraea
                Give the message object an ID
                Retrieve the pending messages from the local storage
                Merge it with new messages
                Update the localStorage
                Update the pending Messages state
                Send the Message to backend Via WebSocket
                Enable textarea
            */


            // disable message input
            setDisable(true);
            
            //create message object
            const messageID = generateRandomString();
            const messageObject = {
                    type,
                    message: {
                        recipient: to,
                        from: userID,
                        images: selectImages,
                        text: message,
                        replyTo: selectReply.messageID,
                        seen: null,
                        messageID,
                    },
                    messageID,
                    isAdmin,
                    link: isAdmin ? "/contact" : "/admin/view/msg/" + to 
            }

            // merge message object with existence message in the localstorage
            let newPendingMessages = {};

            var localStoragePendingMessages = JSON.parse(localStorage.getItem('pendingMsg')) || {};
            const currentTypeMessages = localStoragePendingMessages[type] || {};

            newPendingMessages = {
                ...currentTypeMessages,
                [messageID]: messageObject
            };

            const updatedPendingMessages = {
                ...localStoragePendingMessages,
                [type]: newPendingMessages
            };

            localStorage.setItem('pendingMsg', JSON.stringify(updatedPendingMessages));

            console.log("updated local storage messages",updatedPendingMessages);

            // replace the pending messages with that of localstorage
            setPendingMessages(newPendingMessages);

            // send message tp backend
            WSSend(messageObject);

            // clear messages , images and reply
            setMessage("");
            setSelectImages([]);
            handleClearSelectReply()

            // enable message input
            setDisable(false);

            console.log("Sending value: ", messageObject);
        }
    }



  return (
    <div className="flex flex-col w-full gap-2 p-2  neutral rounded-[20px] h-fit  ">


        {/* Display Select Reply */}
        {
            selectReply ?   
            <div className="flex flex-col text-[14px] p-1 bg-white w-full border-l-[3px] border-[#3498db] rounded-l-lg ">
                <div className="flex justify-between items-center">
                    <div className="text-[12px] font-bold">
                        {selectReply.from === userID ? "You" : selectReply.from}
                    </div>
                    <button onClick={handleClearSelectReply} className="rotate-45 w-fit outline-none p-1 ">
                        <IconSelector type={"Plus"} size={25} />
                    </button>
                </div>

                <div className="flex grid-cols-2  w-full ">
                    <div className="flex flex-col w-full">
                        <div className="textOverflow  ">{selectReply.text}</div>      
                    </div>
                    <div className={` ${selectReply.images[0] ? "" : "hidden"} w-[70px]  flex justify-end  `}>
                        <img src={testDisplay} alt="" className=" object-cover rounded-lg" />
                    </div>
                </div>
            </div>
            : <></>
        }


        {/* Display Selected Images */}
        <div className={` border-black border-b-[1px] h-[150px] py-2 px-1 overflow-auto ${selectImages && selectImages.length > 0 ?"grid" : "hidden"} gap-2 grid100  `}>
            {
                selectImages.map((image,index) => {
                    return (
                        <div key={index} className="relative group/image h-[130px]">
                            <img src={image.data} alt="" className="h-full rounded w-full object-cover " />
                            <button onClick={() => HandleClearImage(index)}className="accent rotate-45 p-1 rounded-full absolute top-1 right-1 invisible group-hover/image:visible">
                                <IconSelector type={"Action"} color={"white"} size={15}/>
                            </button>
                        </div>
                    )
                })
            }
        </div>

        <div className=" flex gap-2 items-center w-full ">


            <textarea onInput={HandleReSize} ref={textAreaRef} value={message} onChange={HandleMessage}  className='pl-1 bg-transparent text-wrap break-all focus: outline-none w-full overflow-auto resize-none ' placeholder={"Type message here ......"} rows={"1"} id={"message"} name={"message"} maxLength={1000} disabled={disable}  > </textarea>


            <div className="flex items-center h-full pt-1 ">
                <Uploader size={25} setSelectedFile={HandleImages} uploadType={"image/*"} multiple={true} />
            </div>
            <button onClick={HandleSend} className="outline-none" disabled={!(message || selectImages.length > 0)}>
                    <IconSelector type={"Send"} size={25} color={`${message || selectImages.length > 0 ? "#135994" : "#00000099"}`} />
            </button>

        </div>

    </div>
  )
}

export default InputMessage