import React, { useEffect, useState } from 'react'
import Contact from './Contact'
import axios from 'axios'

const Messages = () => {

  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [friends, setFriends] = useState([])

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

  useEffect(() => {
    const timeOut = setTimeout(() => {
      fetchSuggestion(search)
    }, 300);
    return () => clearTimeout(timeOut)
  }, [search])

  return (

    <div className='h-screen w-full p-5 flex flex-col gap-5'>
      <div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} className='w-full bg-[#141b28] p-2 px-5 rounded-3xl focus:outline-gray-500 border-none relative' type="text" placeholder='Search' />
        {search &&
          <div className='w-[250px] mt-3 bg-[#141b28] p-5 fixed flex flex-col gap-5'>
            {
              loading?(
                <p>Searching...</p>
              ):(
                suggestions.map((user)=>(
                  // console.log(user)
                  <div key={user._id} className='flex items-center gap-2' onClick={()=>{
                    setFriends(prevFriends => [...prevFriends, user]);
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
      <div className='h-full overflow-y-auto flex flex-col gap-2 pr-2'>
        {
          friends.map((friend)=>(
            // console.log(friend)
            <Contact key={friend._id} friend={friend}/>
          ))
        }
      </div>
    </div>
  )
}

export default Messages