import { useState } from 'react'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit=(e)=>{
        e.preventDefault()
        console.log(email,password)
        setEmail('')
        setPassword('')
    }

  return (
    <div className="h-screen bg-gradient-to-b from-[#0c1121] from-50% to-[#0b1432] relative flex justify-center items-center">
    <div className="fixed top-0 left-0 w-full h-full">
        <div className="fixed w-full h-screen flex flex-col justify-evenly">
            <div className="bg-[#141b28] h-[1px]"></div>
            <div className="bg-[#141b28] h-[1px]"></div>
            <div className="bg-[#141b28] h-[1px]"></div>
            <div className="bg-[#141b28] h-[1px]"></div>
            <div className="bg-[#141b28] h-[1px]"></div>
            <div className="bg-[#141b28] h-[1px]"></div>
            <div className="bg-[#141b28] h-[1px]"></div>
            <div className="bg-[#141b28] h-[1px]"></div>
            <div className="bg-[#141b28] h-[1px]"></div>
            <div className="bg-[#141b28] h-[1px]"></div>
        </div>
        <div className="w-full h-full flex flex-row justify-evenly">
            <div className="bg-[#141b28] w-[1px]"></div>
            <div className="bg-[#141b28] w-[1px]"></div>
            <div className="bg-[#141b28] w-[1px]"></div>
            <div className="bg-[#141b28] w-[1px]"></div>
            <div className="bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
            <div className="md:inline-block hidden bg-[#141b28] w-[1px]"></div>
        </div>
    </div>
    <div className="w-[90%] sm:w-[85%] md:w-[400px] border border-gray-800 bg-[#172032] rounded-lg shadow-[0px_7px_29px_0px_rgb(12 20 49)] z-10 p-6 md:p-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h1 className="text-white text-2xl md:text-3xl font-semibold text-center">Login</h1>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#1e293b] border rounded border-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base" type="email" placeholder="Email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#1e293b] border rounded border-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base" type="password" placeholder="Password" />
            <button type='submit' className="bg-blue-500 hover:bg-blue-700 p-3 text-white text-base rounded">Login</button>
            <a href="/login" className="text-[#ffffff75] hover:text-blue-500 underline">Already have an account?</a>
        </form>
    </div>
</div>
  )
}

export default Login