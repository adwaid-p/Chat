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

            if (response.status === 201) {
                setProfileUpdate(!profileUpdate)
            } else {
                console.error('Failed to update profile picture', response.data);
            }
        } catch (error) {
            console.error("Error updating profile picture:", error);
        }
    };

    return (
        <div className='absolute z-10 bottom-16 left-14 p-3 min-w-[180px] bg-[#0c1121]'>
            <label htmlFor="upload-button" className='cursor-pointer'>
                <div className='flex gap-2 items-center'>
                    <img className='size-[40px] object-cover rounded-full' src={profile.profilePic} alt="" />
                    <div className='flex flex-col'>
                        <span>{profile.userName}</span>
                        <span className='text-[14px]'>{profile.language}</span>
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="upload-button"
                />
            </label>
        </div>
    );
}

export default Profile
