import React, { createContext, useState } from 'react'

export const IncoMessageContextValue = createContext()

const IncoMessageContext = ({ children }) => {

    const [incoMessage, setIncoMessage] = useState(false)

    return (
        <IncoMessageContextValue.Provider value={{incoMessage,setIncoMessage}}>
            {children}
        </IncoMessageContextValue.Provider>
    )
}

export default IncoMessageContext