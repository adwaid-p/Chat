import React, { act, useCallback, useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import { MessageDataContext } from '../context/MessageContext'
import { IncoMessageContextValue } from '../context/IncoMessageContext';
import { GroupDataContext } from '../context/GroupContext';

const MessageInput = ({ socket, setMessages, messages }) => {

  const [user, setUser] = useState('')
  const { receiver, setReceiver } = useContext(MessageDataContext);
  const { currentGroup, setCurrentGroup } = useContext(GroupDataContext)
  const { incoMessage, setIncoMessage } = useContext(IncoMessageContextValue)
  const [typingTimeout, setTypingTimeout] = useState(null);
  // console.log(incoMessage)
  // console.log('the receiver is ', receiver._id)

  const currentUser = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
      headers: {
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
        let newMessage = null
        let eventName = ''

        if (currentGroup && currentGroup._id) {
          newMessage = {
            senderId: user._id,
            groupId: currentGroup._id,
            message,
            createdAt: Date.now()
          }
          eventName = incoMessage ? 'IncoGroupMessage' : 'groupMessage';
        } else if (receiver && receiver._id) {
          newMessage = {
            senderId: user._id,
            receiverId: receiver._id,
            message,
            createdAt: Date.now()
          }
          eventName = incoMessage ? 'IncoMessage' : 'privateMessage';
        } else {
          console.warn('No Group or receiver is selected')
          return;
        }

        // newMessage = { senderId: user._id, receiverId: receiver._id, message, createdAt: Date.now() }
        incoMessage ? (!currentGroup && setMessages((prevMessages) => [...prevMessages, newMessage])) : null
        // socket.emit('privateMessage', {senderId: user._id, receiverId: receiver._id, message});
        // incoMessage ? socket.emit('IncoMessage', { senderId: user._id, receiverId: receiver._id, message, createdAt: Date.now() }) : socket.emit('privateMessage', { senderId: user._id, receiverId: receiver._id, message, createdAt: Date.now() })
        // eventName = incoMessage ? 'IncoMessage' : 'privateMessage';
        socket.emit(eventName, newMessage);
        setMessage('');
        // console.log('the message array :',messages)
      }
    }
  };

  useEffect(() => {
    currentUser()
  }, [])

  useEffect(() => {
    if (currentGroup && currentGroup._id) {
      socket.emit('joinGroup', currentGroup._id)
    }
    window.addEventListener('keydown', sendMessage)
    // currentUser()
    return () => window.removeEventListener('keydown', sendMessage)
  }, [message, receiver, currentGroup, user, incoMessage])

  // console.log(user)


  // const sendMessage = useCallback((e)=>{
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     if (message.trim() !== '' && user._id && receiver._id) {
  //       socket.emit('privateMessage', {senderId: user._id, receiverId: receiver._id, message});
  //       setMessage('');
  //     }
  //   }
  // },[message,user,receiver,socket])

  // useEffect(()=>{
  //   currentUser()
  // },[])

  // useEffect(()=>{
  //   window.addEventListener('keydown', sendMessage)
  //   return ()=> window.removeEventListener('keydown', sendMessage)
  // },[sendMessage])

  const modifyText = async () => {
    if (message.trim() === '') return
    setMessage('Modifying...')
    const resulte = await axios.get(`${import.meta.env.VITE_BASE_URL}/ai/modify-content?prompt=${message}`)
    // console.log(resulte.data)
    setMessage(resulte.data)
  }

  const translateText = async () => {
    if (message.trim() === '') return
    setMessage('Translating...')
    const targetLanguage = 'English'
    const resulte = await axios.get(`${import.meta.env.VITE_BASE_URL}/ai/translate-content?message=${encodeURIComponent(message)}&targetLanguage=${encodeURIComponent(targetLanguage)}`)
    setMessage(resulte.data.result)
    // console.log(resulte.data.result)
  }

  // const handleTyping = () => {
  //   if (typingTimeout) clearTimeout(typingTimeout);
  //   const payload = { senderId: user._id, receiverId: receiver?._id };
  //   socket.emit('typing', payload);
  //   const timeout = setTimeout(() => {}, 500); // No-op timeout to reset
  //   setTypingTimeout(timeout);
  // };

  // const handleTyping = () => {
  //   if (typingTimeout) clearTimeout(typingTimeout);
    
  //   // Only emit typing event if we have a receiver
  //   if (receiver && receiver._id && user && user._id) {
  //     const payload = { senderId: user._id, receiverId: receiver._id };
  //     socket.emit('typing', payload);
  //   } else if (currentGroup && currentGroup._id && user && user._id) {
  //     const payload = { senderId: user._id, groupId: currentGroup._id };
  //     socket.emit('typing', payload);
  //   }
    
  //   // Set timeout to stop typing indicator after some time
  //   const timeout = setTimeout(() => {
  //     // This is empty but still needed for timeout tracking
  //   }, 2000);
  //   setTypingTimeout(timeout);
  // };

  
  return (
    <div className='bg-[#e1e4e9] text-black w-full absolute bottom-0 flex items-center'>
      <input value={message} onChange={(e) => {
        setMessage(e.target.value)
        // socket.emit('typing', { senderId: user._id, receiverId: receiver._id })
        // handleTyping();
      }
      } className='w-full bg-transparent px-5 py-4 focus:outline-none border-none' type="text" placeholder='Enter your message' autoFocus />
      <div onClick={(e) => modifyText(e)} className='aspect-square w-[40px] h-[40px] hover:bg-blue-600 transition-all rounded-full flex items-center justify-center'>
        <i className="text-xl ri-ai-generate-2"></i>
        {/* <button onClick={(e)=> sendMessage(e)}>Send</button> */}
      </div>
      <div onClick={(e) => { translateText(e) }} className='aspect-square w-[40px] h-[40px] hover:bg-blue-600 transition-all rounded-full flex items-center justify-center mr-3'>
        <i className="text-xl ri-translate-2"></i>
      </div>
      <div className='aspect-square w-[40px] h-[40px] hover:bg-blue-600 transition-all rounded-full flex items-center justify-center mr-3'>
        <i className="text-xl ri-mic-line"></i>
      </div>
    </div>
  )
}

export default MessageInput