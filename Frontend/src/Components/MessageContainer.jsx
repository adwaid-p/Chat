import React, { useContext, useEffect, useState } from 'react'
import MessageNav from './MessageNav'
import MessageInput from './MessageInput'
import Message from './Message'
import { io } from 'socket.io-client'
import axios from 'axios'
import { MessageDataContext } from '../context/MessageContext'

const socket = io('http://localhost:3000')

const MessageContainer = () => {

  const {receiver, setReceiver} = useContext(MessageDataContext)
  // console.log('the receicer is ',receiver)

  const [messages, setMessages] = useState([])
  const messageContainerRef = React.useRef(null);

  const userId = JSON.parse(localStorage.getItem('user_id'))

const fetchMessages = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/fetch_message`,{
    params:{senderId:userId,receiverId:receiver._id}
})
  console.log('the user messages are',response.data)
  setMessages(response.data)
}

  useEffect(()=>{
    fetchMessages()
  },[receiver])

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

useEffect(()=>{
  if(messageContainerRef.current){
    messageContainerRef.current.scrollTo({
      top: messageContainerRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }
})


  return (
    <div className='h-screen w-full relative'>
      <MessageNav />
      <div ref={messageContainerRef} className='h-[80vh] px-3 py-5 overflow-y-auto flex flex-col gap-5'>
        {
          messages.map((msg, index) => (
            // console.log(msg)
            <div key={index} className={`flex w-full ${msg.senderId === userId && 'justify-end'}`}>
              <Message message={msg} currentUserId={userId} />
            </div>
          ))
        }

      </div>
      <MessageInput socket={socket} setMessages={setMessages} message={messages}/>
    </div>
  )
}

export default MessageContainer