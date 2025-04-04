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
import { GroupDataContext } from '../context/GroupContext'
import { IncoMessageContextValue } from '../context/IncoMessageContext'

// const socket = io('http://localhost:3000')

const MessageContainer = () => {

  const { receiver, setReceiver } = useContext(MessageDataContext)
  const { currentGroup, setCurrentGroup } = useContext(GroupDataContext)
  const { callState, setCallState } = useContext(CallDataContext)
  const { incoMessage, setIncoMessage } = useContext(IncoMessageContextValue)
  const socket = useSocket();
  // console.log('the call state is', callState)
  // console.log('the receicer is ',receiver)

  const [messages, setMessages] = useState([])
  // const [updateMessage, setUpdateMessage] = useState(false)
  const [user, setUser] = useState('')
  const [isTyping, setIsTyping] = useState(false) // New state for typing indicator
  const [typingTimeout, setTypingTimeout] = useState(null) // For handling typing timeout
  const messageContainerRef = useRef(null);
  const [showImagePreview, setShowImagePreview] = useState(null);

  const userId = JSON.parse(localStorage.getItem('user_id'))
  const token = localStorage.getItem('token')

  const fetchPrivateMessage = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/fetch_message`, {
      params: { senderId: userId, receiverId: receiver._id }
    })
    // console.log('the user messages are', response.data)
    setMessages(response.data)
  }

  const fetchGroupMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/groupMessage/fetch_message`, {
        params: {
          groupId: currentGroup._id
        }
      })
      setMessages(response.data)
    } catch (error) {
      console.log('Error while fetching group messages ', error)
    }
  }

  // console.log('the receiver is for offline test', receiver)

  useEffect(() => {
    setMessages([])
    if (receiver?._id) {
      fetchPrivateMessage();
    } else if (currentGroup?._id) {
      fetchGroupMessages()
    }
  }, [receiver?._id, currentGroup?._id]);

  // socket.on('connect', () => {
  //   console.log('connected',socket.id);
  //   socket.emit('join', userId)
  //   // axios.post(`${import.meta.env.VITE_BASE_URL}/user/online`,{socketId: socket.id}).then((res)=>console.log(res)).catch(err=>console.log(err))
  // })

  useEffect(() => {
    // socket.connect()
    // socket.emit('join', userId)
    if (!socket) return;

    socket.off('receiveMessage');
    socket.off('groupMessage');
    // socket.off('typing')

    if (receiver && receiver._id) {
      socket.on('receiveMessage', (data) => {
        // console.log('the message is',data)
        // console.log('entered the receive message')
        // console.log('the message is from the frontend', data.inco)
        setIncoMessage(data.inco)
        // if((data.receiverId === userId && data.senderId === receiver._id) || (data.senderId === userId && data.receiverId === receiver._id)){
        // setMessages((prevMessages) => [...prevMessages, data])
        // }

        if (data.senderId === receiver._id) {
          console.log("Enterd the receive message")
          setMessages((prevMessages) => [...prevMessages, data])
        }
        setIsTyping(false)
      })

      socket.on('deleteMessage', ({ messageId }) => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
      });

      // socket.on('typing', (data) => {
      //   if (data.senderId === receiver._id) {
      //     console.log('Setting isTyping to true');
      //     setIsTyping(true);
      //     if (typingTimeout) clearTimeout(typingTimeout);
      //     const timeout = setTimeout(() => {
      //       console.log('Resetting isTyping to false');
      //       setIsTyping(false)
      //     }, 2000);
      //     setTypingTimeout(timeout);
      //   }
      // });

      // socket.on('Status', (data) => {console.log(data)})

    } else if (currentGroup && currentGroup._id) {
      socket.emit('joinGroup', currentGroup._id)
      socket.on('groupMessage', (data) => {
        // console.log('the received g[roup id is', data.groupId)
        // console.log('the current group id is', currentGroup?._id)
        if (data.groupId === currentGroup._id) {
          setMessages((prevMessages) => [...prevMessages, data])
        }
      })
      socket.on('IncoGroupMessage', (data) => {
        // setIncoMessage(data.inco)
        console.log('the inco message is from the gp frontend', data.inco)
        setMessages((prevMessages) => [...prevMessages, data])
        setIncoMessage(data.inco || false);
      })
      socket.on('deleteMessage', ({ messageId }) => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId))
      })
    }
    // socket.on('typing', (data) => {
    //   console.log('typing')
    //   // io.to(receiverId).emit('typing', senderId)
    // })
    return () => {
      socket.off("receiveMessage");
      socket.off("groupMessage");
      // socket.off('typing')
      // if (typingTimeout) clearTimeout(typingTimeout);
      // setIsTyping(false);
      // socket.disconnect();
    };
  }, [socket, receiver?._id, currentGroup?._id, userId])


  // useEffect(() => {
  //   if (!socket) return;

  //   socket.off('receiveMessage');
  //   socket.off('groupMessage');
  //   socket.off('typing');

  //   if (receiver && receiver._id) {
  //     socket.on('receiveMessage', (data) => {
  //       console.log('the message is from the frontend', data)
  //       setMessages((prevMessages) => [...prevMessages, data])
  //       setIsTyping(false); // Reset typing when message received
  //     });

  //     socket.on('typing', (data) => {
  //       if (data.senderId === receiver._id) {
  //         console.log('Setting isTyping to true');
  //         setIsTyping(true);

  //         // Clear any existing timeout
  //         if (typingTimeout) clearTimeout(typingTimeout);

  //         // Set new timeout to hide typing indicator after 3 seconds
  //         const timeout = setTimeout(() => {
  //           console.log('Resetting isTyping to false');
  //           setIsTyping(false);
  //         }, 3000);

  //         setTypingTimeout(timeout);
  //       }
  //     });
  //   } else if (currentGroup && currentGroup._id) {
  //     socket.emit('joinGroup', currentGroup._id);
  //     socket.on('groupMessage', (data) => {
  //       setMessages((prevMessages) => [...prevMessages, data]);
  //     });

  //     // Add typing indicator for groups too
  //     socket.on('typing', (data) => {
  //       if (data.senderId !== userId) {
  //         setIsTyping(true);
  //         if (typingTimeout) clearTimeout(typingTimeout);
  //         const timeout = setTimeout(() => {
  //           setIsTyping(false);
  //         }, 3000);
  //         setTypingTimeout(timeout);
  //       }
  //     });
  //   }

  //   return () => {
  //     socket.off("receiveMessage");
  //     socket.off("groupMessage");
  //     socket.off('typing');
  //     if (typingTimeout) clearTimeout(typingTimeout);
  //     setIsTyping(false);
  //   };
  // }, [socket, receiver?._id, currentGroup?._id, userId]);

  // useEffect(() => {
  //   if (messageContainerRef.current) {
  //     messageContainerRef.current.scrollTo({
  //       top: messageContainerRef.current.scrollHeight,
  //       behavior: 'smooth'
  //     })
  //   }
  // })

  useEffect(() => {
    const scrollToBottom = () => {
      if (messageContainerRef.current) {
        const container = messageContainerRef.current;
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth', // Smooth scrolling for better UX
        });
      }
    };

    // Use requestAnimationFrame to ensure DOM is updated
    const rafId = requestAnimationFrame(scrollToBottom);

    // Cleanup to avoid memory leaks
    return () => cancelAnimationFrame(rafId);
  }, [messages, receiver, currentGroup]);

  // useEffect(() => {
  //   if (messageContainerRef.current) {
  //     messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  //   }
  // }, [messages]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data);
      // console.log('The user is', user)
      // console.log('The user is', response.data)
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  const deleteMessage = async (messageId) => {
    try {
      console.log(messageId)
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/delete`, {
        params: {
          messageId
        }
      })
      console.log(response.data)
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId))
      socket.emit('deleteMessage', { messageId, receiverId: receiver._id, groupId: currentGroup?._id })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUserProfile();
  }, [userId, receiver?._id, currentGroup?._id])

  return (
    <div className='h-full w-full relative'>
      <MessageNav />
      <div className='h-[82.5svh]'>
        {callState ?
          <VideoCall />
          : <div ref={messageContainerRef} className='h-full px-3 py-5 overflow-y-auto flex flex-col gap-5'>
            {
              messages && messages.map((msg, index) => (
                // console.log(msg)
                <div key={index} className={`flex w-full ${msg.senderId === userId && 'justify-end'}`}>
                  <Message message={msg} currentUserId={userId} user={user} deleteMessage={deleteMessage} showImagePreview={showImagePreview} setShowImagePreview={setShowImagePreview} />
                </div>
              ))
            }
            {isTyping && receiver && !currentGroup && (
              <div className='text-black'>Typing...</div>
            )}
          </div>
        }


      </div>
      <MessageInput socket={socket} setMessages={setMessages} message={messages} />
      {
        showImagePreview && (
          <div
            // onClick={(e) => {
            //   if (e.target === e.currentTarget) {
            //     setShowImagePreview(null);
            //   }
            // }}
            onClick={() => setShowImagePreview(null)}
            className='fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-[#000000cd]'>
            <img className='cursor-pointer w-[85%] h-full object-contain' src={showImagePreview} alt="" />
          </div>
        )
      }
    </div>
  )
}

export default MessageContainer