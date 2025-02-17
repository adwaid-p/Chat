import React from 'react'
import Contact from './Contact'

const Messages = () => {
  return (
    <div className='h-screen w-full p-5 flex flex-col gap-5'>
        <div>
            <input className='w-full bg-[#141b28] p-2 px-5 rounded-3xl focus:outline-gray-500 border-none' type="text" placeholder='Search' />
        </div>
        <div className='h-full overflow-y-auto flex flex-col gap-2 pr-2'>
            <Contact/>
            <Contact/>
            <Contact/>
            <Contact/>
            <Contact/>
            <Contact/>
            <Contact/>
            <Contact/>
        </div>
    </div>
  )
}

export default Messages