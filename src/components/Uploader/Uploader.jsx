import React, { useState, useRef } from 'react';
import IconSelector from '../IconSelector/IconSelector';

function Uploader({size,color,setSelectedFile,uploadType,multiple}) {

    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        if (multiple) {
            setSelectedFile(event.target.files)
            return
        }
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = () => {
          setSelectedFile(reader.result);
        };
    
        if (file) {
          reader.readAsDataURL(file);
        }
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
