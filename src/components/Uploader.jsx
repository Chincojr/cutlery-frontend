import React, { useRef } from 'react';
import IconSelector from './IconSelector';
import { ConvertImageInfoToDisplay } from '../UtilityFunctions';


/**
 * A component for uploading files with customizable options.
 * 
 * @param {number} size - The size of the icon used for the upload button.
 * @param {string} color - The color of the icon used for the upload button.
 * @param {function} setSelectedFile - The function to update the state with the selected file(s).
 * @param {string} uploadType - The accepted file types for the upload input.
 * @param {boolean} multiple - Whether multiple files can be selected at once.
 * 
 * This component provides a custom file upload button that allows users to select
 * files from their device. It supports selecting single or multiple files, and updates
 * the state with the selected file(s). The icon for the button is customizable by size
 * and color. The component also handles converting a single selected file to a display
 * image if required.
 */
function Uploader({
        size,
        color,
        setSelectedFile,
        uploadType,
        multiple
    }) {

    /**
     * A reference to the file input element.
     * @type {React.MutableRefObject<null>}
     */
    const fileInputRef = useRef(null);

    /**
     * Handles a change in the file input element.
     * If multiple files can be selected, sets the selectedFile state to the array of selected files.
     * If only one file can be selected, converts the selected file to a display image and sets the selectedFile state to it.
     * @param {event} event - The onchange event from the file input element.
     */
    const handleFileChange = async(event) => {
        
        if (multiple) {
            setSelectedFile(event.target.files)
            return
        }
        let image = await ConvertImageInfoToDisplay(event.target.files[0]);
        setSelectedFile(image);
        event.target.value = null; 
    };

    /**
     * Simulates a click on the file input element to trigger the file open dialog.
     * This is used to open the file dialog when the user clicks on the custom upload button.
     */
    
    const handleUpload = () => {
        fileInputRef.current.click();
    };


    return (
        <div className='w-fit flex items-center h-fit'>
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
