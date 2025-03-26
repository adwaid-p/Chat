import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { GroupDataContext } from '../context/GroupContext';
import WaveSurfer from 'wavesurfer.js';

const Message = ({ message, currentUserId, user, deleteMessage }) => {

  const [sender, setSender] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const { currentGroup } = useContext(GroupDataContext)
  const [realMessage, setRealMessage] = useState('')
  const [rawMessage, setRawMessage] = useState(message.message)
  const [showEditInput, setShowEditInput] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  // const [message, setMessage] = useState(message)

  // console.log('the message in the message box', message.senderId)
  // console.log('The current user is : ',currentUserId)
  // console.log('the user is ', user.language)
  // console.log('the raw message is ', rawMessage)

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

  useEffect(() => {
    if (message.message) {
      setRealMessage(renderMessageContent(message.message))
    }
    // if (message.audio) audioRef.current.src = message.audio;
    if (message.audio) {
      audioRef.current.src = message.audio;

      // Initialize WaveSurfer
      if (!wavesurferRef.current) {
        wavesurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: isSentByCurrentUser ? '#ffffff' : '#A9A9A9', // White for sent, gray for received
          progressColor: isSentByCurrentUser ? '#87CEEB' : '#4682B4', // Light blue for sent, darker for received
          cursorColor: 'transparent',
          barWidth: 2,
          barRadius: 3,
          height: 30,
          responsive: true,
          normalize: true,
          width: '100%',
        });

        wavesurferRef.current.load(message.audio);

        wavesurferRef.current.on('play', () => setIsPlaying(true));
        wavesurferRef.current.on('pause', () => setIsPlaying(false));
        wavesurferRef.current.on('finish', () => setIsPlaying(false));
      }
    }

    // Cleanup WaveSurfer on unmount
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [message.message, message.audio, isSentByCurrentUser]);



  // const toggleAudio = () => {
  //   if (isPlaying) {
  //     audioRef.current.pause();
  //   } else {
  //     audioRef.current.play();
  //   }
  //   setIsPlaying(!isPlaying);
  // };

  const toggleAudio = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const translateText = async () => {
    if (message.message.trim() === '') return
    setShowSettings(false)
    setRealMessage('Translating...')
    const targetLanguage = user.language
    const resulte = await axios.get(`${import.meta.env.VITE_BASE_URL}/ai/translate-content?message=${encodeURIComponent(message.message)}&targetLanguage=${encodeURIComponent(targetLanguage)}`)
    setRealMessage(resulte.data.result)
    // console.log(resulte.data.result)
  }

  const handleDelete = async () => {
    // if (message.message.trim() === '') return
    setShowSettings(false)
    setRealMessage('Deleting...')
    deleteMessage(message._id)
  }

  // const handleEdit = async (e) => {
  //   // if (message.message.trim() === '') return
  //   setShowEditInput(!showEditInput)
  //   setShowSettings(false)
  //   console.log('the real message is ',realMessage[0].props.children)

  //   // setRealMessage('Modifying...')
  //   // const resulte = await axios.get(`${import.meta.env.VITE_BASE_URL}/ai/modify-content?prompt=${message.message}`)
  //   // console.log(resulte.data)
  //   // setRealMessage(resulte.data)
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     // if (message.trim() !== '' || image) {

  //     // }
  //     console.log('pressed enter')
  //   }
  // }


  // const handleEdit = async (e) => {
  //   // if (message.message.trim() === '') return
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     // if (message.trim() !== '' || image) {

  //     // }
  //     console.log('the raw message is ',rawMessage)
  //     setRealMessage(rawMessage)
  //     setShowEditInput(false)
  //     console.log('pressed enter')
  //   }
  // };


  // useEffect(() => {

  //   window.addEventListener('keydown', handleEdit)
  //   // currentUser()
  //   return () => window.removeEventListener('keydown', handleEdit)
  // }, [])

  return (
    <div className='flex items-start gap-2 relative'>
      {
        (!isSentByCurrentUser && currentGroup) && <img className='size-[30px] rounded-full object-cover' src={sender.profilePic} alt="" />
      }
      {
        isSentByCurrentUser &&
        <div className='relative'>
          <h1 onClick={() => setShowSettings(!showSettings)} className='text-lg text-black -mr-2 opacity-0 hover:opacity-100 cursor-pointer self-end'><i className="ri-more-2-line"></i></h1>
          {
            showSettings &&
            <div className={`text-black bg-white text-[14px] flex flex-col gap-1 border border-gray-300 rounded-md absolute z-10 top-8 right-0 px-4 py-2`}>
              <h1 onClick={translateText} className='flex gap-2 items-center cursor-pointer'><i className="ri-translate-2"></i> Translate</h1>
              <h1 onClick={handleDelete} className='flex gap-2 items-center cursor-pointer'><i className="ri-delete-bin-line"></i>Delete</h1>
              {/* <h1 onClick={(e) => {
                setShowEditInput(!showEditInput)
                setShowSettings(false)
                handleEdit(e)
              }} className='flex gap-2 items-center cursor-pointer'><i className="ri-pencil-line"></i>Edit</h1> */}
            </div>
          }
        </div>
      }
      <div className={`inline-block w-fit max-w-[250px] md:max-w-[450px] px-5 py-[4px] pt-2 break-words ${isSentByCurrentUser ? 'bg-blue-600 rounded-l-xl rounded-br-xl' : 'bg-[#141b28] rounded-r-xl rounded-bl-xl'}`}>
        {
          currentGroup && <div className='text-xs font-medium'>{sender.userName}</div>
        }
        {message.image ? (
          <img className="max-w-full h-auto rounded-lg my-2" src={message.image} alt="Shared Image" />
        ) : message.audio ? (
          // <div className="flex items-center gap-2">
          //   <button onClick={toggleAudio} className="text-white">
          //     <i className={`ri-${isPlaying ? 'pause' : 'play'}-circle-line text-xl`}></i>
          //   </button>
          //   <div className="w-full h-6 bg-gray-300 rounded flex items-center">
          //     {/* Simple waveform simulation */}
          //     <div
          //       className="h-full bg-blue-500 rounded"
          //       style={{ width: isPlaying ? '100%' : '50%', transition: 'width 0.1s linear' }}
          //     ></div>
          //   </div>
          // </div>
          <div className="flex items-center gap-2 w-[200px]">
            <button onClick={toggleAudio} className="text-white">
              <i className={`ri-${isPlaying ? 'pause' : 'play'}-circle-line text-xl`}></i>
            </button>
            <div ref={waveformRef} className="flex-1 overflow-hidden" style={{ maxWidth: 'calc(100% - 40px)' }}></div>
          </div>
        ): (
          <div className='pr-10 text-[14.4px]'>
            {
              // renderMessageContent(message.message)
              showEditInput ? <input type="text" className='bg-transparent outline-none' value={rawMessage} onChange={(e) => setRawMessage(e.target.value)} /> : realMessage
            }
          </div>)
        }
        <div className={`text-[11px] ${isSentByCurrentUser ? 'text-white' : 'text-gray-400'} text-right pl-10 -mt-1`}>{istTime}</div>
      </div>
      {
        (isSentByCurrentUser && currentGroup) && <img className='size-[30px] rounded-full object-cover' src={sender.profilePic} alt="" />
      }
      {
        !isSentByCurrentUser &&
        <div className='relative'>
          <h1 onClick={() => setShowSettings(!showSettings)} className='text-lg text-black -ml-2 opacity-0 hover:opacity-100 cursor-pointer self-end'><i className="ri-more-2-line"></i></h1>
          {
            showSettings &&
            <div className={`text-black bg-white text-[14px] flex flex-col gap-1 border border-gray-300 rounded-md absolute z-10 top-8 left-0 px-4 py-2`}>
              <h1 onClick={translateText} className='flex gap-2 items-center cursor-pointer'><i className="ri-translate-2"></i> Translate</h1>
              <h1 onClick={handleDelete} className='flex gap-2 items-center cursor-pointer'><i className="ri-delete-bin-line"></i>Delete</h1>
              {/* <h1 className='flex gap-2 items-center cursor-pointer'><i className="ri-pencil-line"></i>Edit</h1> */}
            </div>
          }
        </div>
      }
    </div>
  )
}

export default Message