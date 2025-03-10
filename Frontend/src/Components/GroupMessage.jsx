import React, { useContext } from 'react'
import { GroupDataContext } from '../context/GroupContext'

const GroupMessage = ({ group }) => {

  const { currentGroup, setCurrentGroup } = useContext(GroupDataContext)

  console.log('the current group is ', currentGroup)
  return (
    <div className='w-full p-3 text-black font-semibold hover:bg-gray-200 rounded-md cursor-pointer flex items-center gap-x-2' onClick={() => setCurrentGroup(group)}>
      <img className='size-[50px] rounded-full object-cover' src={group.profilePic} alt="" />
      <div>
        <div className='flex justify-between items-center'>
          <div className='text-[17px] '>
            {group.name || 'Loading...'}
          </div>
          {/* <div className='text-[11px] font-medium text-gray-500'>
            {istTime}
        </div> */}
        </div>
        <p className='text-gray-600 text-[13px] font-medium overflow-hidden whitespace-nowrap w-[200px]'>
          {/* <span>✅</span> */}
          {/* {truncateText(lastMessage, 30)} */}
        </p>
      </div>
    </div>
  )
}

export default GroupMessage