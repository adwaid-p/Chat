import React, { useContext, useEffect, useRef, useState } from 'react'
import MessageNav from './MessageNav'
import MessageInput from './MessageInput'
import Message from './Message'
import { io } from 'socket.io-client'
import axios from 'axios'
import { MessageDataContext } from '../context/MessageContext'
import { CallDataContext } from '../context/CallContext'
import VideoCall from './VideoCall'
import { useSocket } from '../context/SocketContext';

// const socket = io('http://localhost:3000')

const MessageContainer = () => {

  const { receiver, setReceiver } = useContext(MessageDataContext)
  const { callState, setCallState } = useContext(CallDataContext)
  const socket = useSocket();
  // console.log('the call state is', callState)
  // console.log('the receicer is ',receiver)

  const [messages, setMessages] = useState([])
  const messageContainerRef = useRef(null);

  const userId = JSON.parse(localStorage.getItem('user_id'))

  const fetchMessages = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/fetch_message`, {
      params: { senderId: userId, receiverId: receiver._id }
    })
    // console.log('the user messages are', response.data)
    setMessages(response.data)
  }

  // console.log('the receiver is for offline test', receiver)

  useEffect(() => {
    if (receiver?._id) {
      fetchMessages();
    }
  }, [receiver?._id]);

  // socket.on('connect', () => {
  //   console.log('connected',socket.id);
  //   socket.emit('join', userId)
  //   // axios.post(`${import.meta.env.VITE_BASE_URL}/user/online`,{socketId: socket.id}).then((res)=>console.log(res)).catch(err=>console.log(err))
  // })

  useEffect(() => {
    // socket.connect()
    // socket.emit('join', userId)
    if(!socket) return;
    socket.on('receiveMessage', (data) => {
      // console.log('entered the receive message')
      // console.log('the message is from the frontend', data)
      setMessages((prevMessages) => [...prevMessages, data])
    })
    // socket.on('Status', (data) => {console.log(data)})
      
    return () => {
      socket.off("receiveMessage");
      // socket.disconnect();
    };
  }, [socket])

  // useEffect(() => {
  //   if (messageContainerRef.current) {
  //     messageContainerRef.current.scrollTo({
  //       top: messageContainerRef.current.scrollHeight,
  //       behavior: 'smooth'
  //     })
  //   }
  // })

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <div className='h-screen w-full relative'>
      <MessageNav />
      <div className='h-[82.5vh]'>
        {callState ?
          <VideoCall />
          : <div ref={messageContainerRef}  className='h-full px-3 py-5 overflow-y-auto flex flex-col gap-5'>
            {
              receiver && messages.map((msg, index) => (
                // console.log(msg)
                <div key={index} className={`flex w-full ${msg.senderId === userId && 'justify-end'}`}>
                  <Message message={msg} currentUserId={userId} />
                </div>
              ))
            }
          </div>
        }


      </div>
      <MessageInput socket={socket} setMessages={setMessages} message={messages} />
    </div>
  )
}

export default MessageContainer