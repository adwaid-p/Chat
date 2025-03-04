import React, { useEffect, useState } from 'react'
import Contact from './Contact'
import axios from 'axios'
import { useSocket } from '../context/SocketContext';

const Messages = () => {

  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [friends, setFriends] = useState([])
  const [currentUser, setCurrentUser] = useState('')

  const [latestMessage, setLatestMessage] = useState(null);
  const socket = useSocket();

useEffect(() => {
  if(!socket) return;

  socket.on('receiveMessage', (data) => {
    setLatestMessage(data);
  });
  // console.log('the latest message is ',latestMessage)
  return () => socket.off('receiveMessage');
},[socket])

  const fetchSuggestion = async () => {
    if (!search) {
      setSuggestions([])
      return
    }
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/search?query=${search}`)
      setSuggestions(response.data)
      // console.log(suggestions)
    } catch (error) {
      console.error('Error in fetching data is : ', error.message)
    } finally {
      setLoading(false)
    }
  }

  const addFriend = async (friendId) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user_id'))
      // console.log('the user id is',userId)
      // console.log('the friend id is',friendId)
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/update_friend`, { userId, friendId })
      // console.log('the resonse data is after updation',response.data)
      setFriends(response.data.friends)
    } catch (error) {
      console.error('Error in fetching data is : ', error.message)
    }
  }



  useEffect(() => {
    const findUser = async () => {

      try {
        const userId = JSON.parse(localStorage.getItem('user_id'))
        // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User`,{userId})
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User?id=${userId}`);
        // const data = response.data
        setCurrentUser(response.data)
        // console.log(data)
      } catch (error) {
        console.log('Error while fetching Data', error.message)
      }

    }
    findUser()
    // setCurrentUser(findUser())
    // console.log('the current user data: ',currentUser)
  }, [])

  useEffect(() => {
    if (currentUser?.friends) {
      setFriends(currentUser?.friends)
    }
  }, [currentUser])



  useEffect(() => {
    const timeOut = setTimeout(() => {
      fetchSuggestion(search)
    }, 300);
    return () => clearTimeout(timeOut)
  }, [search])

  return (

    <div className='h-screen w-full p-5 flex flex-col gap-5'>
      {/* <h1 className='text-3xl font-semibold'>Chats</h1> */}
      <div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} className='w-full bg-[#e1e4e9] text-black p-2 px-5 rounded-3xl focus:outline-gray-500 border-none relative placeholder:text-gray-500' type="text" placeholder='Search' />
        {search &&
          <div className='w-[250px] mt-3 bg-[#141b28] p-5 fixed flex flex-col gap-5'>
            {
              loading ? (
                <p>Searching...</p>
              ) : (
                suggestions.map((user) => (
                  // console.log(user)
                  <div key={user._id} className='flex items-center gap-2 cursor-pointer' onClick={() => {
                    // setFriends(prevFriends => [...prevFriends, user]);
                    addFriend(user._id)
                    // console.log('the friends are',friends)
                    setSearch('')
                  }}>
                    <img className='aspect-square w-8 h-8 rounded-full' src={user.profilePic} alt="" />
                    <p className='text-blue-50'>{user.userName}</p>
                  </div>
                ))
              )
            }
          </div>
        }
      </div>
      <div className='h-full flex flex-col gap-5 pr-2'>
        <div className='flex items-center gap-2'>
          <button className='bg-[#201f1f] px-4 py-1 rounded text-[14px] font-semibold'>Inbox</button>
          <button className='bg-[#201f1f] px-4 py-1 rounded text-[14px] font-semibold'>Groups</button>
        </div>
        <div className='flex flex-col gap-1 h-full overflow-y-auto overflow-x-hidden'>
          {
            friends.map((friend) => (
              // console.log(friend)
              <Contact key={friend} friend={friend} latestMessage={latestMessage} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Messages