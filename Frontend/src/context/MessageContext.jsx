import React, { createContext, useState } from 'react'

export const MessageDataContext = createContext()

const MessageContext = ({children}) => {

    const [ receiver, setReceiver] = useState('')
    // console.log('the receiver is ', receiver)
    return (
        <MessageDataContext.Provider value={{ receiver, setReceiver }}>
            {children}
        </MessageDataContext.Provider>
    )
}

export default MessageContext