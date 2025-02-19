import React, { useContext } from 'react'
import { MessageDataContext } from '../context/MessageContext'

const MessageNav = () => {

  const {receiver} = useContext(MessageDataContext)
  // console.log(receiver)

  return (
    <div className='py-3 px-3 border-b border-gray-800 bg-[#172032] flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
            <div className='aspect-square w-[40px] h-[40px] rounded-full'>
              <img src={receiver.profilePic} alt="" />
            </div>
            <div className='font-semibold'>{receiver.userName}</div>
        </div>
        <div className='aspect-square w-[40px] h-[40px] hover:bg-blue-600 transition-all rounded-full flex items-center justify-center'>
        <i className="text-2xl ri-chat-private-line"></i>
      </div>
    </div>
  )
}

export default MessageNav