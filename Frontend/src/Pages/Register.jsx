import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import BackgroundLine from "../Components/BackgroundLine";

const Register = () => {

    const { user, setUser } = useContext(UserDataContext);

    const navigate = useNavigate()

    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [language, setLanguage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newUser = {
            userName: userName,
            email: email,
            password: password,
            language: language
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, newUser)
        // console.log('the response is:',response)
        if (response.status === 201) {
            const data = response.data
            setUser(data.user)
            // console.log(user)
            localStorage.setItem('token', data.token)
            localStorage.setItem('user_id', JSON.stringify(data.user._id))
            navigate('/')
        }

        setUserName('')
        setEmail('')
        setPassword('')
    }

    return (
        <div className="h-screen bg-gradient-to-b from-[#0c1121] from-50% to-[#0b1432] relative flex justify-center items-center">
            <div className="fixed top-0 left-0 w-full h-full">
                <BackgroundLine />
            </div>
            <div className="w-[90%] sm:w-[85%] md:w-[400px] border border-gray-800 bg-[#172032] rounded-lg shadow-[0px_7px_29px_0px_rgb(12 20 49)] z-10 p-6 md:p-10">
                <form onSubmit={(e) => { handleSubmit(e) }} className="flex flex-col gap-6">
                    <h1 className="text-white text-2xl md:text-3xl font-semibold text-center">Create an Account</h1>
                    <input value={userName} onChange={(e) => setUserName(e.target.value)} className="bg-[#1e293b] border rounded border-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base" type="text" required placeholder="Username" />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#1e293b] border rounded border-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base" type="email" required placeholder="Email" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#1e293b] border rounded border-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base" type="password" required placeholder="Password" />
                    <input value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-[#1e293b] border rounded border-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base" type="text" required placeholder="Enter your language" />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 p-3 text-white text-base rounded">Create Account</button>
                    <Link to="/login" className="text-[#ffffff75] hover:text-blue-500 underline">Already have an account?</Link>
                </form>
            </div>
        </div>
    )
}

export default Register