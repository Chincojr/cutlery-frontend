import React, { useState, useRef } from 'react';
import IconSelector from '../IconSelector/IconSelector';
import { ConvertImageInfoToDisplay } from '../../UtilityFunctions';

function Uploader({size,color,setSelectedFile,uploadType,multiple}) {

    const fileInputRef = useRef(null);

    const handleFileChange = async(event) => {
        if (multiple) {
            setSelectedFile(event.target.files)
            return
        }
        let image = await ConvertImageInfoToDisplay(event.target.files[0]);
        setSelectedFile(image);
        event.target.value = null; 
    };

    const handleUpload = () => {
        fileInputRef.current.click();
    };


    return (
        <div className=''>
            <input
                type="file"
                accept={uploadType}
                onChange={handleFileChange}
                className='hidden'
                multiple={multiple}
                ref={fileInputRef} // Assign the ref to the file input
            />
            <button className='w-fit' onClick={handleUpload}>
                <IconSelector type={"Camera"} size={size} color={color} />
            </button>

        </div>
    );
}

export default Uploader;
