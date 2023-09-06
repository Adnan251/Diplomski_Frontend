import React from 'react'

const Modal = ({isOpen, children, title, onClose}) => {
  return (
    <div className={`modal ${isOpen ? 'flex' : 'hidden'} `}>
      <div className='flex flex-col gap-[20px] bg-white p-[40px] rounded-[20px] w-[500px]'>
        <div className='flex items-center justify-between w-full'>
          <h2 className='text-[28px] text-black font-bold'>{title}</h2>
          <svg className='cursor-pointer' onClick={onClose} xmlns="http://www.w3.org/2000/svg" width="33.941" height="33.941" viewBox="0 0 33.941 33.941">
            <g id="add-1--expand-cross-buttons-button-more-remove-plus-add-_-mathematics-math" data-name="add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math" transform="translate(16.971 -0.043) rotate(45)">
              <path id="Union" d="M13.688,1.689a1.715,1.715,0,0,0-3.428,0V10.26H1.689a1.715,1.715,0,0,0,0,3.428H10.26v8.571a1.715,1.715,0,1,0,3.428,0V13.688h8.571a1.715,1.715,0,1,0,0-3.428H13.688Z" transform="translate(0 0)" fill="#202020" fill-rule="evenodd"/>
            </g>
          </svg>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal