import React, { useState } from 'react'
import Tools from './Tools'
import Messages from './Messages'

const SideBar = () => {
  const [showSideWindow, setShowSideWindow] = useState(true)
  return (
    // <div className='h-screen w-[500px] flex border border-gray-800 bg-[#172032]'>
    <div className='h-screen md:w-[500px] flex border border-gray-300 bg-[#fcfcfc] '>
        <Tools setShowSideWindow={setShowSideWindow} showSideWindow={showSideWindow}/>
        { showSideWindow && <Messages setShowSideWindow={setShowSideWindow} showSideWindow={showSideWindow}/>}
    </div>
  )
}

export default SideBar