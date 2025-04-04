import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { MessageDataContext } from '../context/MessageContext'

const Contact = ({ friend, latestMessage }) => {
  const [friendData, setFriendData] = useState('')
  const [friendName, setFriendName] = useState('')
  const [lastMessage, setLastMessage] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState('');
  // console.log('the friend is ', friend)

  const userId = JSON.parse(localStorage.getItem('user_id'))

  // console.log('the latest message is ', latestMessage)

  // useEffect(() => {
  //   if (latestMessage &&
  //     (latestMessage.senderId === friend || latestMessage.receiverId === friend)) {
  //     setLastMessage(latestMessage.message);
  //     setLastMessageTime(latestMessage.createdAt)
  //     // console.log('the latest message time is ', lastMessageTime)
  //   }
  // }, [latestMessage, friend]);

  useEffect(() => {
    if (latestMessage &&
        (latestMessage.senderId === friend || latestMessage.receiverId === friend)) {
      setLastMessage(latestMessage.message || latestMessage.audio || latestMessage.image || 'Media');
      setLastMessageTime(latestMessage.createdAt);
    }
  }, [latestMessage, friend]);

  const fetchLastMessage = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/fetch_last_message`, {
      params: {
        senderId: userId,
        receiverId: friend
      }
    });
    setLastMessage(response.data.message || 'No message yet')
    setLastMessageTime(response.data.createdAt)
    // console.log('the lastseen message response is ', response.data)
    // console.log('the lastseen time message is ', lastMessageTime)
  }

  useEffect(() => {
    if (userId && friend) {
      fetchLastMessage()
    }
  }, [userId, friend])

  const { receiver, setReceiver } = useContext(MessageDataContext);

  // console.log('created at is ',latestMessage?.createdAt)

  const friendDetails = async (friend) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User?id=${friend}`)
      setFriendName(response.data.userName)
      setFriendData(response.data)
      // console.log('the friend data is ', response.data)
    } catch (error) {
      console.log('Error while fetching friend details ', error)
    }
  }
  useEffect(() => {
    if (friend) {
      friendDetails(friend)
    }
  }, [friend])

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return ''; // Or a default message like "No time available"
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Time';
    }
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata', // IST time zone
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  const istTime = formatDate(lastMessageTime);

  // console.log('the receiver is ', receiver)
  return (
    <div className='w-full p-3 text-black font-semibold hover:bg-gray-200 rounded-md cursor-pointer flex items-center gap-x-2' onClick={() => friendData && setReceiver(friendData)}>
      <img className='size-[50px] rounded-full object-cover' src={friendData.profilePic} alt="" />
      <div>
        <div className='flex justify-between items-center'>
          <div className='text-[17px] '>
            {friendName || 'Loading...'}
          </div>
          <div className='text-[11px] font-medium text-gray-500'>
              {istTime}
          </div>
        </div>
        <p className='text-gray-600 text-[13px] font-medium overflow-hidden whitespace-nowrap w-[200px]'>
          {/* <span>✅</span> */}
          {truncateText(lastMessage, 30)}
        </p>
      </div>
    </div>
  )
}

export default Contact