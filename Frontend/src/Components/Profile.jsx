import React, { useEffect, useState } from 'react'

const Profile = () => {

    const [profile, setProfile] = useState('')
    const token = localStorage.getItem('token')

    const fetchProfile = async () => {

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()
        setProfile(data)
    }
    useEffect(() => {
        fetchProfile()
    }, [token])

    return (
        <div className='absolute bottom-16 left-14 px-5 py-5 min-w-[180px] bg-[#0c1121]'>
            <div className='flex gap-2 items-center'>
                <img className='size-[35px]' src={profile.profilePic} alt="" />
                {profile.userName}
            </div>
        </div>
    )
}

export default Profile