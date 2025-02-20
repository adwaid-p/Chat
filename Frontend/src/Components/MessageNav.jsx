import React, { useContext } from 'react'
import { MessageDataContext } from '../context/MessageContext'
import IncoMessageContext, { IncoMessageContextValue } from '../context/IncoMessageContext'

const MessageNav = () => {

  const { receiver } = useContext(MessageDataContext)
  const {incoMessage,setIncoMessage} = useContext(IncoMessageContextValue)
  // console.log('value of inco',incoMessage)
  // console.log(receiver)

  return (
    <div className='py-3 px-3 border-b border-gray-800 bg-[#172032] flex justify-between items-center'>
      <div className='flex gap-2 items-center'>
        <div className='aspect-square w-[40px] h-[40px] rounded-full'>
          <img src={receiver.profilePic} alt="" />
        </div>
        <div className='font-semibold'>{receiver.userName}</div>
      </div>
      <div onClick={()=> setIncoMessage(!incoMessage)} className={`${incoMessage && 'bg-blue-700'} aspect-square w-[40px] h-[40px] hover:bg-blue-600 transition-all rounded-full flex items-center justify-center`}>
        <i className="text-2xl ri-chat-private-line"></i>
      </div>
    </div>
  )
}

export default MessageNav