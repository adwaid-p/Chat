import React, { useState } from 'react'
import Profile from './Profile'
import AiChatContainer from './AiChatContainer'

const Tools = ({showSideWindow, setShowSideWindow}) => {
  const [showProfile, setShowProfile] = useState(false)
  const [showAiChat, setShowAiChat] = useState(false)

  return (
    <div className='h-screen md:w-[50px] flex flex-col gap-y-2 items-center justify-between md:justify-end py-5 px-1 md:px-3 border-r border-gray-300 relative'>
      <div onClick={()=> setShowSideWindow(!showSideWindow)} className='aspect-square w-[40px] h-[40px] hover:bg-gray-300 transition-all rounded-full md:hidden flex items-center justify-center'>
        < i className="text-black text-2xl ri-side-bar-line"></i>
      </div>
      <div>
        <div onClick={() => setShowAiChat(!showAiChat)} className='aspect-square w-[40px] h-[40px] hover:bg-gray-300 transition-all rounded-full flex items-center justify-center'>
          <i className="text-black text-2xl ri-sparkling-line"></i>
        </div>
        <div onClick={() => setShowProfile(!showProfile)} className='aspect-square w-[40px] h-[40px] hover:bg-gray-300 transition-all rounded-full flex items-center justify-center'>
          <i className="text-black text-2xl ri-user-line"></i>
        </div>
        <div className='aspect-square w-[40px] h-[40px] hover:bg-gray-300 transition-all rounded-full flex items-center justify-center'>
          <i className="text-black text-2xl ri-settings-5-line"></i>
        </div>
      </div>
      {showAiChat && <AiChatContainer />}
      {showProfile && <Profile />}
    </div>
  )
}

export default Tools