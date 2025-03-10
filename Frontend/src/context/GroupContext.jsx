import React, { createContext, useState } from 'react'

export const GroupDataContext = createContext() 

const GroupContext = ({children}) => {
    const [currentGroup, setCurrentGroup] = useState('')
  return (
    <GroupDataContext.Provider value={{currentGroup, setCurrentGroup}}>
        {children}
    </GroupDataContext.Provider>
  )
}

export default GroupContext