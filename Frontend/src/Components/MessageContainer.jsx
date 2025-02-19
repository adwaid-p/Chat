import React, { useEffect, useState } from 'react'
import MessageNav from './MessageNav'
import MessageInput from './MessageInput'
import Message from './Message'
import { io } from 'socket.io-client'
import axios from 'axios'

const socket = io('http://localhost:3000')

const MessageContainer = () => {

  const [messages, setMessages] = useState([])

  const userId = JSON.parse(localStorage.getItem('user_id'))

  // socket.on('connect', () => {
  //   console.log('connected',socket.id);
  //   socket.emit('join', userId)
  //   // axios.post(`${import.meta.env.VITE_BASE_URL}/user/online`,{socketId: socket.id}).then((res)=>console.log(res)).catch(err=>console.log(err))
  // })

useEffect(() => {
  socket.connect()
  socket.emit('join', userId)
  socket.on('receiveMessage',(data)=>{
    console.log('the message is from the frontend',data)
    setMessages((prevMessages) => [...prevMessages, data])
  })
  return () => {
    socket.off("receiveMessage");
    socket.disconnect();
  };
}, [userId])


  return (
    <div className='h-screen w-full relative'>
      <MessageNav />
      <div className='h-[80vh] px-3 py-5 overflow-y-auto flex flex-col gap-5'>
        {
          messages.map((msg, index) => (
            // console.log(msg)
            <Message key={index} message={msg} />
          ))
        }

      </div>
      <MessageInput socket={socket} />
    </div>
  )
}

export default MessageContainer