import React, { useEffect, useState } from 'react'
import MessageNav from './MessageNav'
import MessageInput from './MessageInput'
import Message from './Message'
import { io } from 'socket.io-client'
import axios from 'axios'

const socket = io('http://localhost:3000')

const MessageContainer = () => {

  const [messages, setMessages] = useState([])

  socket.on('connect', () => {
    // console.log('connected',socket.id);
    // axios.post(`${import.meta.env.VITE_BASE_URL}/user/online`,{socketId: socket.id}).then((res)=>console.log(res)).catch(err=>console.log(err))
  })

useEffect(() => {
  socket.on('receiveMessage',(message)=>{
    setMessages((prevMessages) => [...prevMessages, message])
  })
  return () => {
    socket.off("receiveMessage");
  };
}, [])


  return (
    <div className='h-screen w-full relative'>
      <MessageNav />
      <div className='h-[80vh] px-3 py-5 overflow-y-auto flex flex-col gap-5'>
        {
          messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))
        }

      </div>
      <MessageInput socket={socket} />
    </div>
  )
}

export default MessageContainer