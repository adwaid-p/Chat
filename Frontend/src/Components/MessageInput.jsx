import React, { act, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import { MessageDataContext } from '../context/MessageContext'
import { IncoMessageContextValue } from '../context/IncoMessageContext';
import { GroupDataContext } from '../context/GroupContext';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = ({ socket, setMessages, messages }) => {

  const [user, setUser] = useState('')
  const { receiver, setReceiver } = useContext(MessageDataContext);
  const { currentGroup, setCurrentGroup } = useContext(GroupDataContext)
  const { incoMessage, setIncoMessage } = useContext(IncoMessageContextValue)
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null)

  const [audioBlob, setAudioBlob] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
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

  const handleImageUpload = (e) => {
    setImage(e.target.files[0])
    // console.log(image])
  }


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(audioBlob)
        stream.getTracks().forEach((track) => track.stop());
      }
      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.log("Error Starting recording :", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      isRecording(false)
    }
  }


  const sendAudioMessage = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    try {
      const uploadResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/upload-audio`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newMessage = {
        senderId: user._id,
        receiverId: receiver?._id,
        groupId: currentGroup?._id,
        audio: uploadResponse.data.audioUrl,
        createdAt: Date.now(),
      };

      const eventName = currentGroup ? 'groupMessage' : 'privateMessage';
      socket.emit(eventName, newMessage);
      setAudioBlob(null); // Clear audio after sending
      setIsRecording(false);
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (message.trim() !== '' || image) {
        let newMessage = null
        let eventName = ''
        if (image) {
          console.log(image)
          const formData = new FormData();
          formData.append('image', image);
          const uploadResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/upload-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          newMessage = {
            senderId: user._id,
            receiverId: receiver?._id,
            groupId: currentGroup?._id,
            image: uploadResponse.data.imageUrl,
            createdAt: Date.now()
          }
          eventName = currentGroup ? 'groupMessage' : 'privateMessage';
        } else if (currentGroup && currentGroup._id) {
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
        setImage(null)
        setShowEmojiPicker(false)
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
  }, [message, receiver, currentGroup, user, incoMessage, image, socket])

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

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Append emoji to message
    setShowEmojiPicker(false); // Optional: hide picker after selection
  };


  return (
    <div className='bg-[#e1e4e9] text-black w-full absolute bottom-0 flex items-center'>
      <div onClick={() => setShowEmojiPicker(!showEmojiPicker)} className='ml-3 text-xl cursor-pointer'>
        <i className="ri-emotion-line"></i>
      </div>
      <label htmlFor="upload-button" className="ml-3 text-xl cursor-pointer">
        <i className="ri-attachment-2"></i>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="upload-button"
        />
      </label>
      {/* <div className='ml-3 text-xl'>
      </div> */}
      <input value={message} onChange={(e) => {
        setMessage(e.target.value)
        // socket.emit('typing', { senderId: user._id, receiverId: receiver._id })
        // handleTyping();
      }
      } className='w-full bg-transparent px-5 py-4 focus:outline-none border-none' type="text" placeholder='Enter your message' autoFocus />
      <div onClick={(e) => modifyText(e)} className='aspect-square w-[40px] h-[40px] hover:bg-[#141b28] hover:text-white transition-all rounded-full flex items-center justify-center cursor-pointer'>
        <i className="text-xl ri-ai-generate-2"></i>
        {/* <button onClick={(e)=> sendMessage(e)}>Send</button> */}
      </div>
      <div onClick={(e) => { translateText(e) }} className='aspect-square w-[40px] h-[40px] hover:bg-[#141b28] hover:text-white transition-all rounded-full flex items-center justify-center mr-3 cursor-pointer'>
        <i className="text-xl ri-translate-2"></i>
      </div>
      <div
        onClick={isRecording ? stopRecording : startRecording}
        className="aspect-square w-[40px] h-[40px] hover:bg-[#141b28] hover:text-white transition-all rounded-full flex items-center justify-center mr-3 cursor-pointer"
      >
        <i className={`text-xl ${isRecording ? 'ri-stop-circle-line' : 'ri-mic-line'}`}></i>
      </div>
      {
        audioBlob && (
          <div
            onClick={sendAudioMessage}
            className="aspect-square w-[40px] h-[40px] text-black hover:bg-blue-600 transition-all rounded-full flex items-center justify-center mr-3 cursor-pointer"
          >
            <i className="text-2xl ri-send-plane-2-line"></i>
          </div>
        )
      }

      {showEmojiPicker && (
        <div className="absolute bottom-[3.8rem] left-1 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  )
}

export default MessageInput