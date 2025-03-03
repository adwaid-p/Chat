import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Profile = () => {

    const [profile, setProfile] = useState('')
    const [profileUpdate, setProfileUpdate] = useState(false)
    const token = localStorage.getItem('token')

    const fetchProfile = async () => {

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [token, profileUpdate])

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profilePic', file);
        formData.append('userId', profile._id); 

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/profile_pic`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setProfileUpdate(!profileUpdate)
            } else {
                console.error('Failed to update profile picture', response.data);
            }
        } catch (error) {
            console.error("Error updating profile picture:", error);
        }
    };

    return (
        <div className='absolute bottom-16 left-14 px-5 py-5 min-w-[180px] bg-[#0c1121]'>
            <div className='flex gap-2 items-center'>
                <img className='size-[40px] object-cover rounded-full' src={profile.profilePic} alt="" />
                {profile.userName}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="upload-button"
            />
            <label htmlFor="upload-button" className='bg-blue-600 px-3 py-1 rounded cursor-pointer'>
                Edit
            </label>
        </div>
    );
}

export default Profile
