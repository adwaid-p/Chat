import React from 'react'
import Tools from './Tools'
import Messages from './Messages'

const SideBar = () => {
  return (
    <div className='h-screen w-[500px] flex border border-gray-800 bg-[#172032]'>
        <Tools/>
        <Messages/>
    </div>
  )
}

export default SideBar