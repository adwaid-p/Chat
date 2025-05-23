import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import Loader from './Loader'
import ReactMarkdown from 'react-markdown';

const AiChatContainer = () => {

    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false);

    const messageContainerRef = useRef(null);

    // const SendMessage = async () => {
    //     console.log('loading...')
    //     const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ai/chatAi?prompt=${message}`)
    //     console.log(response)
    // }

    const SendMessage = async () => {
        // setMessages(message)
        if (!message.trim()) return;
        setLoading(true);
        try {
            console.log('loading...');
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ai/chatAi`, {
                params: { prompt: message }
            });
            console.log(response.data.result);
            // setMessages([...messages, response.data.result])
            const newMessge = { senderId: 'AI', message: response.data.result }
            setMessages((prevMessages) => [...prevMessages, newMessge])
            // setMessages((prevMessages) => [...prevMessages, response.data.result])
        } catch (error) {
            console.error('Error:', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

      useEffect(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTo({
            top: messageContainerRef.current.scrollHeight,
            behavior: 'smooth'
          })
        }
      })

    // console.log(messages)
    return (
        <div className='absolute z-10 bottom-0 left-[50px] min-w-[325px] h-[90.8vh] bg-[#fcfcfc]'>
            <div className='relative h-full w-full'>
                <div className='bg-[#172032] flex items-center justify-start gap-2  border-t border-gray-800 py-3 px-5'>
                    <img className='aspect-square w-[35px] h-[35px] rounded-full object-cover object-center' src="https://i.pinimg.com/736x/80/55/e6/8055e6cc671a7010711acadd6440e893.jpg" alt="" />
                    <div className='text-white font-normal'>Tars</div>
                </div>
                <div ref={messageContainerRef} className='h-[72.3vh] flex flex-col items-end gap-3 overflow-y-auto py-5 px-3'>
                    {
                        messages.map((msg, index) => (
                            <div className={`${msg.senderId === 'AI' ? 'bg-[#172032]' : 'bg-blue-600'} text-[14px] px-3.5 py-2 inline-block w-fit rounded-l-xl rounded-br-xl`} key={index}>
                                <div className='flex flex-col items-end gap-2'>
                                    {/* <div className='text-[12px] font-semibold'>{msg.senderId}</div> */}
                                    {/* <div className='text-[14px] font-semibold text-justify'>{msg.message}</div> */}
                                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                                </div>
                            </div>
                        ))
                    }
                    {loading && <div className='text-gray-400 px-4 py-2 bg-[#263452] rounded-l-xl rounded-br-xl'><Loader/> </div>}
                </div>
                <div className='absolute bottom-0 left-0 w-full flex gap-2 bg-[#263452]'>
                    <input value={message} onChange={(e) => setMessage(e.target.value)} className='bg-transparent w-full px-5 py-4 focus:outline-none border-none' type="text" placeholder='Ask anything Ai' autoFocus />
                    <button onClick={(e) => {
                        setMessage('')
                        const newMessge = { senderId: 'User', message }
                        setMessages((prevMessages) => [...prevMessages, newMessge])
                        SendMessage(e)
                    }
                    } className='px-5 rounded' >
                        < i className=" text-2xl ri-chat-ai-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AiChatContainer