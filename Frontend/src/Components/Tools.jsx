import React from 'react'

const Tools = () => {
  return (
    <div className='h-screen w-[50px] flex flex-col gap-y-2 items-center justify-end py-5 px-3 border-r border-gray-700'>
      <div className='aspect-square w-[40px] h-[40px] hover:bg-blue-600 transition-all rounded-full flex items-center justify-center'>
        <i className="text-2xl ri-sparkling-line"></i>
      </div>
      <div className='aspect-square w-[40px] h-[40px] hover:bg-blue-600 transition-all rounded-full flex items-center justify-center'>
        <i className="text-2xl ri-user-line"></i>
      </div>
      <div className='aspect-square w-[40px] h-[40px] hover:bg-blue-600 transition-all rounded-full flex items-center justify-center'>
        <i className="text-2xl ri-settings-5-line"></i>
      </div>
    </div>
  )
}

export default Tools