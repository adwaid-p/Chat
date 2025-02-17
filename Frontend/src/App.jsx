import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login'
import Register from './Pages/Register'
import MainPage from './Pages/MainPage'
import UserProtectWrapper from './Pages/UserProtectWrapper'
import LogOut from './Pages/LogOut'

function App() {

  return (
    <div>
      {/* <h1>This is the chating website</h1> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/messages" element={
          <UserProtectWrapper>
            <MainPage />
          </UserProtectWrapper>
        } />
        <Route path='/logout' element={
          <UserProtectWrapper>
            <LogOut/>
          </UserProtectWrapper>
        }/>
      </Routes>
    </div>
  )
}

export default App
