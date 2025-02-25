import React, { createContext, useState } from 'react'

export const CallDataContext = createContext()
const CallContext = ({children}) => {
const [callState, setCallState] = useState(false)
  return (
    <CallDataContext.Provider value={{callState, setCallState}}>
      {children}
    </CallDataContext.Provider>
  )
}

export default CallContext