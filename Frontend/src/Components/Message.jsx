import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { GroupDataContext } from '../context/GroupContext';

const Message = ({ message, currentUserId }) => {

  const [sender, setSender] = useState('')
  const { currentGroup } = useContext(GroupDataContext)

  console.log('the message in the message box', message.senderId)
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

  const fetch_sender = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User?id=${message.senderId}`)
    setSender(response.data)
  }

  useEffect(() => {
    if (message.senderId) {
      fetch_sender();
    }
  }, [message.senderId]);

  return (
    <div className={`inline-block w-fit max-w-[250px] md:max-w-[450px] px-5 py-[4px] pt-2 break-words ${isSentByCurrentUser ? 'bg-blue-600 rounded-l-xl rounded-br-xl' : 'bg-[#141b28] rounded-r-xl rounded-bl-xl'}`}>
      {
      currentGroup && <div className='text-xs font-medium'>{sender.userName}</div>
      }
      <div className='pr-10 tetx-sm'>
        {message.message}
      </div>
      <div className={`text-[11px] ${isSentByCurrentUser ? 'text-white' : 'text-gray-400'} text-right pl-10 -mt-1`}>{istTime}</div>
    </div>
  )
}

export default Message