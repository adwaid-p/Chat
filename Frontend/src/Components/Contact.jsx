import React from 'react'

const Contact = ({friend}) => {
  console.log(friend)
  return (
    <div className='w-full px-5 py-5 bg-[#222e43] rounded-md'>{friend.userName}</div>
  )
}

export default Contact