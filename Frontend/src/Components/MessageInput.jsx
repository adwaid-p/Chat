import React, { act, useCallback, useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import { MessageDataContext } from '../context/MessageContext'
import { IncoMessageContextValue } from '../context/IncoMessageContext';

const MessageInput = ({ socket, setMessages, messages }) => {

  const [user, setUser] = useState('')
  const { receiver, setReceiver } = useContext(MessageDataContext);
  const { incoMessage, setIncoMessage } = useContext(IncoMessageContextValue)
  console.log(incoMessage)
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
        const newMessge = { senderId: user._id, message, createdAt: Date.now() }
        setMessages((prevMessages) => [...prevMessages, newMessge])
        // socket.emit('privateMessage', {senderId: user._id, receiverId: receiver._id, message});
        incoMessage ? socket.emit('IncoMessage', { senderId: user._id, receiverId: receiver._id, message, createdAt: Date.now() }) : socket.emit('privateMessage', { senderId: user._id, receiverId: receiver._id, message, createdAt: Date.now() })
        setMessage('');
        // console.log('the message array :',messages)
      }
    }
  };

  useEffect(() => {
    currentUser()
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', sendMessage)
    // currentUser()
    return () => window.removeEventListener('keydown', sendMessage)
  }, [message])

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

  const translateText = async()=>{
    if(message.trim()==='') return
    setMessage('Translating...')
    const targetLanguage = 'English'
    const resulte = await axios.get(`${import.meta.env.VITE_BASE_URL}/ai/translate-content?message=${encodeURIComponent(message)}&targetLanguage=${encodeURIComponent(targetLanguage)}`)
    setMessage(resulte.data.result)
    // console.log(resulte.data.result)
  }

  return (
    <div className='bg-[#172032] w-full absolute bottom-0 flex items-center'>
      <input value={message} onChange={(e) => setMessage(e.target.value)} className='w-full bg-transparent px-5 py-4 focus:outline-none border-none' type="text" placeholder='Enter your message' autoFocus />
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