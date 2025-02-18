import React from 'react'

const MessageNav = () => {
  return (
    <div className='py-3 px-3 border-b border-gray-800 bg-[#172032] flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
            <div className='w-[40px] h-[40px] bg-white rounded-full'></div>
            <div className='font-semibold'>Adwaid P</div>
        </div>
        <div className='aspect-square w-[40px] h-[40px] hover:bg-blue-600 transition-all rounded-full flex items-center justify-center'>
        <i className="text-2xl ri-chat-private-line"></i>
      </div>
    </div>
  )
}

export default MessageNav