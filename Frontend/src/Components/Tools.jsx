import React, { useEffect, useState } from 'react'
import Profile from './Profile'
import AiChatContainer from './AiChatContainer'
import axios from 'axios'
import Settings from './Settings'

const Tools = ({showSideWindow, setShowSideWindow}) => {
  const [showProfile, setShowProfile] = useState(false)
  const [showAiChat, setShowAiChat] = useState(false)
  const [showSettings, setshowSettings] = useState(false)
  const [profile, setProfile] = useState('')

  const token = localStorage.getItem('token')
  const fetchProfile = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setProfile(response.data);
        // console.log('the profile is ', response.data)
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}
    useEffect(() => {
        fetchProfile()
    }, [token])

  return (
    <div className='h-screen md:w-[50px] flex flex-col gap-y-2 items-center justify-between md:justify-end py-5 px-1 md:px-3 border-r border-gray-300 relative'>
      <div onClick={()=> setShowSideWindow(!showSideWindow)} className='aspect-square w-[40px] h-[40px] hover:bg-gray-300 transition-all rounded-full md:hidden flex items-center justify-center'>
        < i className="text-black text-2xl ri-side-bar-line"></i>
      </div>
      <div>
        <div onClick={() => setShowAiChat(!showAiChat)} className='aspect-square w-[40px] h-[40px] hover:bg-gray-300 transition-all rounded-full flex items-center justify-center'>
          <i className="text-black text-2xl ri-sparkling-line"></i>
        </div>
        <div onClick={() => setShowProfile(!showProfile)} className='aspect-square w-[40px] h-[40px] hover:bg-gray-300 transition-all rounded-full flex items-center justify-center'>
          {profile? <img className='size-[35px] rounded-full object-cover object-center' src={profile.profilePic} alt="" /> : <i className="text-black text-2xl ri-user-line"></i>}
        </div>
        <div onClick={() => setshowSettings(!showSettings)} className='aspect-square w-[40px] h-[40px] hover:bg-gray-300 transition-all rounded-full flex items-center justify-center'>
          <i className="text-black text-2xl ri-settings-5-line"></i>
        </div>
      </div>
      {showAiChat && <AiChatContainer />}
      {showProfile && <Profile />}
      {showSettings && <Settings/>}
    </div>
  )
}

export default Tools