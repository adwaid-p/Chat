// import React from 'react'

import BackgroundLine from "../Components/BackgroundLine"
import MessageContainer from "../Components/MessageContainer"
import SideBar from "../Components/SideBar"

const MainPage = () => {
  return (
    <div className="h-[100dvh] bg-[#F5F5F5] relative text-white">
      {/* <div className="fixed top-0 left-0 w-full h-full">
        <BackgroundLine />
      </div> */}
      <div className="w-full h-full fixed flex">
        <SideBar/>
        <MessageContainer/>
      </div>
    </div>
  )
}

export default MainPage