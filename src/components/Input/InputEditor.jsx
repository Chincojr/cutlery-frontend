import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the CSS for the Snow theme


/**
 * A rich text editor component using ReactQuill.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.value - The current content of the editor.
 * @param {function} props.onChange - The function to call when the content changes.
 * @param {string} [props.error] - An optional error message to display below the editor.
 */
const InputEditor = ({
    value, 
    onChange,
    error
  }) => {
      
    const modules = {
      toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, 
         {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']                                         
      ],
    };
  
    const formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ];
  
    return (
      <div className='flex flex-col items-center w-full px-[10%]'>
        <ReactQuill 
          theme="snow" 
          value={value} 
          onChange={onChange}
          modules={modules}
          formats={formats}
          className='w-full'
        />
        <div className="text-[12px] accentText w-full ">{error}</div>
      </div>
    );
  };
  
  

export default InputEditor 