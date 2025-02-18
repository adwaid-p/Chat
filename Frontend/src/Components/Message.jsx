import React from 'react'

const Message = ({message}) => {
  return (
    <div className='bg-[#222e43] inline-block w-fit max-w-[450px] px-4 py-2 rounded-r-2xl rounded-bl-2xl'>
      {/* <div className='text-sm font-semibold'>Adwid</div> */}
      {message}
      {/* <div className='text-[10px] text-right'>4:29PM</div> */}
    </div>
  )
}

export default Message