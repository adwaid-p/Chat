import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { GroupDataContext } from '../context/GroupContext';

const Message = ({ message, currentUserId }) => {

  const [sender, setSender] = useState('')
  const { currentGroup } = useContext(GroupDataContext)

  // console.log('the message in the message box', message.senderId)
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


  const urlRegex = /(https?:\/\/[^\s]+)/g;
  // const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.(com|org|net|edu|gov|io|co\.[a-z]{2}))/g;

  const renderMessageContent = (text) => {
    if (!text) return null;

    const parts = text.split(urlRegex)
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target='_blank'
            rel="noopener noreferrer"
            className='text-blue-100 underline hover:text-blue-200'
          >
            {part}
          </a>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className='flex items-start gap-2'>
      {
        (!isSentByCurrentUser && currentGroup) ? <img className='size-[30px] rounded-full object-cover' src={sender.profilePic} alt="" />
          : <h1 className='text-lg text-black -mr-2 opacity-0 hover:opacity-100 cursor-pointer self-end'><i className="ri-more-2-line"></i></h1>
      }
      <div className={`inline-block w-fit max-w-[250px] md:max-w-[450px] px-5 py-[4px] pt-2 break-words ${isSentByCurrentUser ? 'bg-blue-600 rounded-l-xl rounded-br-xl' : 'bg-[#141b28] rounded-r-xl rounded-bl-xl'}`}>
        {
          currentGroup && <div className='text-xs font-medium'>{sender.userName}</div>
        }
        {message.image ? (
          <img className="max-w-full h-auto rounded-lg my-2" src={message.image} alt="Shared Image" />
        ) : (
          <div className='pr-10 text-[14.4px]'>
            {renderMessageContent(message.message)}
          </div>)
        }
        <div className={`text-[11px] ${isSentByCurrentUser ? 'text-white' : 'text-gray-400'} text-right pl-10 -mt-1`}>{istTime}</div>
      </div>
      {
        (isSentByCurrentUser && currentGroup) ? <img className='size-[30px] rounded-full object-cover' src={sender.profilePic} alt="" />
          :
          <div className='relative'>
            <h1 className='text-lg text-black -ml-2 opacity-0 hover:opacity-100 cursor-pointer self-end'><i className="ri-more-2-line"></i></h1>
            <div className='text-black bg-white text-[14px] flex flex-col gap-1 border border-gray-300 rounded-md absolute top-8 left-0 p-2'>
              <h1 className='flex gap-1 items-center'><i className="ri-translate-2"></i> Translate</h1>
              <h1 className='flex gap-1 items-center'><i className="ri-delete-bin-line"></i>Delete</h1>
              <h1 className='flex gap-1 items-center'><i className="ri-pencil-line"></i>Edit</h1>
            </div>
          </div>
      }
    </div>
  )
}

export default Message