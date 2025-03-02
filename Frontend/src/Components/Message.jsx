import React from 'react'

const Message = ({ message, currentUserId }) => {
  // console.log('the message in the message box',message)
  // console.log('The current user is : ',currentUserId)
  const isSentByCurrentUser = message.senderId === currentUserId;
  // console.log(message.createdAt)
  const date = new Date(message.createdAt);
  const istTime = date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata', // IST time zone
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    // second: '2-digit'
  });
  // console.log(istTime)

  return (
    <div className={`inline-block w-fit max-w-[450px] px-5 py-[4px] break-words ${isSentByCurrentUser ? 'bg-blue-600 rounded-l-xl rounded-br-xl' : 'bg-[#222e43] rounded-r-xl rounded-bl-xl'}`}>
      {/* <div className='text-sm font-semibold'>Adwid</div> */}
      <div className='pr-10 tetx-sm'>
        {message.message}
      </div>
      <div className={`text-[11px] ${isSentByCurrentUser ? 'text-white' : 'text-gray-400'} text-right pl-10 -mt-1`}>{istTime}</div>
    </div>
  )
}

export default Message