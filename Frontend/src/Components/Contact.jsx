import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { MessageDataContext } from '../context/MessageContext'

const Contact = ({ friend }) => {
  const [friendData, setFriendData] = useState('')
  const [friendName, setFriendName] = useState('')
  // console.log(friend)

  const { receiver, setReceiver } = useContext(MessageDataContext);

  const friendDetails = async (friend) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User?id=${friend}`)
      setFriendName(response.data.userName)
      setFriendData(response.data)
    } catch (error) {
      console.log('Error while fetching friend details ', error)
    }
  }
  useEffect(() => {
    if (friend) {
      friendDetails(friend)
    }
  }, [friend])

  // console.log('the receiver is ', receiver)
  return (
    <div className='w-full px-5 py-5 bg-[#222e43] rounded-md cursor-pointer flex items-center gap-x-2' onClick={() => friendData && setReceiver(friendData)}>
      <img className='size-[35px] rounded-full' src={friendData.profilePic} alt="" />
      <div>
        {friendName || 'Loading...'}
      </div>
    </div>
  )
}

export default Contact