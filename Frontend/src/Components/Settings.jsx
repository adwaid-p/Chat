import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
    
    const navigate = useNavigate()
    const handleLogout = async()=>{
        console.log('logout')
        const token = localStorage.getItem('token')
    
        await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response)=>{
            if(response.status === 200){
                localStorage.removeItem('token')
                localStorage.removeItem('user_id')
                navigate('/login')
            }
        })
    }

    return (
        <button onClick={()=>handleLogout()} className='absolute z-10 bottom-5 left-14 px-10 py-3 rounded bg-[#0c1121]'>
            <h1>Logout</h1>
        </button>
    )
}

export default Settings