import React, { useContext, useEffect, useState } from 'react'
import { MessageDataContext } from '../context/MessageContext'
import IncoMessageContext, { IncoMessageContextValue } from '../context/IncoMessageContext'
import { CallDataContext } from '../context/CallContext'
// import { io } from 'socket.io-client'
import { useSocket } from '../context/SocketContext';
import { GroupDataContext } from '../context/GroupContext';
import Information from './Information';

const MessageNav = () => {

  const { receiver } = useContext(MessageDataContext)
  const { incoMessage, setIncoMessage } = useContext(IncoMessageContextValue)
  const { callState, setCallState } = useContext(CallDataContext)
  const {currentGroup, setCurrentGroup} = useContext(GroupDataContext)
  const [isOnline, setIsOnline] = useState(false)
  const [lastSeen, setLastSeen] = useState(null)
  const [showInfo, setShowInfo] = useState(false)
  const socket = useSocket();
  // console.log('value of inco',incoMessage)
  // console.log(receiver)

  useEffect(() => {
    if (receiver) {
      setIsOnline(receiver.isOnline || false);
      setLastSeen(receiver.lastSeen || null);
    }
  }, [receiver]);


  useEffect(() => {
    // const socket = io('http://localhost:3000')
    if (!socket || !receiver?._id) return undefined;

    
    socket.on('userStatus', (data) => {
      if (data.userId === receiver._id) {
        setIsOnline(data.isOnline)
        if (!data.isOnline) {
          setLastSeen(data.lastSeen)
        }
      }
    })

    socket.on('Status', (data) => {console.log(data)})

    // console.log('The recever data from context :',receiver.isOnline)

    // socket.on('initialStatus', (users) => {
    //   const currentUser = users.find(user => user.userId === receiver._id);
    //   if (currentUser) {
    //     setIsOnline(currentUser.isOnline);
    //   }
    // });

    return () => {
      socket.off('userStatus')
      // socket.off('initialStatus')
      // socket.disconnect()
    }
  }, [socket, receiver])


  


  const formatLastSeen = (date) => {
    if (!date) return ''
    const lastSeenDate = new Date(date)
    const now = new Date()
    const diff = now - lastSeenDate

    if (diff < 60000) return 'last seen just now'
    if (diff < 3600000) return `last seen ${Math.floor(diff / 60000)} minutes ago`
    if (diff < 86400000) return `last seen ${Math.floor(diff / 3600000)} hours ago`
    return `last seen ${lastSeenDate.getDate().toString().padStart(2, '0')}/${(lastSeenDate.getMonth() + 1).toString().padStart(2, '0')}/${lastSeenDate.getFullYear()}`
  }

  return (
    <div className='py-3 px-3 border-b border-gray-300 bg-[#fcfcfc] text-black flex justify-between items-center'>
      <div className='flex gap-2 items-center'>
        <div onClick={()=>setShowInfo(!showInfo)} className='relative cursor-pointer'>
          {/* <div className='aspect-square w-[40px] h-[40px] rounded-full'> */}
            <img className='aspect-square w-[40px] h-[40px] rounded-full object-cover' src={receiver?receiver.profilePic: currentGroup.profilePic} alt="" />
          {/* </div> */}
          {isOnline && (
            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 '></div>
          )}
        </div>
          {(showInfo && currentGroup) && (
            <div className='absolute top-[4.1rem] z-50 bg-blue-50'>
              <Information/>
            </div>
          )}
        <div className='flex flex-col'>
          <div className='font-semibold'>{receiver?receiver.userName: currentGroup.name}</div>
          <div className='text-xs text-gray-700'>
            {isOnline ? 'online' : formatLastSeen(lastSeen)}
          </div>
        </div>
      </div>


      <div className='flex gap-1 items-center justify-center'>
        <div onClick={() => setCallState(!callState)} className={`aspect-square w-[40px] h-[40px] hover:bg-gray-300 transition-all rounded-full flex items-center justify-center`}>
          <i className="text-2xl ri-video-on-fill"></i>
        </div>
        {/* <div onClick={() => console.log('audio call')} className={`aspect-square w-[40px] h-[40px] hover:bg-gray-300 transition-all rounded-full flex items-center justify-center`}>
          <i className="text-2xl ri-phone-fill"></i>
        </div> */}
        <div onClick={() => setIncoMessage(!incoMessage)} className={`${incoMessage && 'bg-blue-700'} aspect-square w-[40px] h-[40px] hover:bg-gray-300 transition-all rounded-full flex items-center justify-center`}>
          <i className="text-2xl ri-chat-private-line"></i>
        </div>
      </div>
    </div>
  )
}

export default MessageNav