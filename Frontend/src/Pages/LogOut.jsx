import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const LogOut = () => {

    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, {
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

    return (
        <div>LogOut</div>
    )
}

export default LogOut