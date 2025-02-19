import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import { MessageDataContext } from '../context/MessageContext'

const MessageInput = ({ socket }) => {

  const [user, setUser] = useState('')
    const { receiver, setReceiver } = useContext(MessageDataContext);
  console.log('the receiver is ', receiver._id)

  const currentUser = async()=>{
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    // console.log(response.data)
    setUser(response.data)
  }

  const token = localStorage.getItem('token')
  // console.log('the token is', token)
  // const response = await 

  const [message, setMessage] = useState('')
  const sendMessage = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (message.trim() !== '') {
        socket.emit('privateMessage', {senderId: user._id, receiverId: receiver._id, message});
        setMessage('');
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', sendMessage)
    currentUser()
    return () => window.removeEventListener('keydown', sendMessage)
  }, [message])

  // console.log(user)

  return (
    <div className='bg-[#172032] w-full absolute bottom-0 flex items-center'>
      <input value={message} onChange={(e) => setMessage(e.target.value)} className='w-full bg-transparent px-5 py-4 focus:outline-none border-none' type="text" placeholder='Enter your message' autoFocus />
      <div className='aspect-square w-[40px] h-[40px] hover:bg-blue-600 transition-all rounded-full flex items-center justify-center'>
        {/* <i className="text-2xl ri-ai-generate-2"></i> */}
        {/* <button onClick={(e)=> sendMessage(e)}>Send</button> */}
      </div>
      <div className='aspect-square w-[40px] h-[40px] hover:bg-blue-600 transition-all rounded-full flex items-center justify-center mr-3'>
        <i className="text-2xl ri-mic-line"></i>
      </div>
    </div>
  )
}

export default MessageInput