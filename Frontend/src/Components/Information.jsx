import React, { useContext, useEffect, useState } from 'react'
import { GroupDataContext } from '../context/GroupContext'
import axios from 'axios'

const Information = () => {
    const [groupMembersId, setGroupMembersId] = useState([])
    const { currentGroup, setCurrentGroup } = useContext(GroupDataContext)
    const [memeberDetails, setMemeberDetails] = useState([])
    // currentGroup && setGroupMembersId(currentGroup.members)
    useEffect(() => {
        if (currentGroup && currentGroup.members) {
            setGroupMembersId(currentGroup.members)
        } else {
            setGroupMembersId([])
            setMemeberDetails([])
        }
    }, [currentGroup])

    // useEffect(() => {
    //     groupMembersId.map(async (groupMemberId) => {
    //         const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User?id=${groupMemberId}`)
    //         console.log('the response is ', response.data)
    //         setMemeberDetails([...memeberDetails, response.data])
    //     })
    // }, [groupMembersId])

    useEffect(() => {
        const fetchMemberDetails = async () => {
            if (!groupMembersId.length) {
                setMemeberDetails([])
                return
            }
            try {
                const memberPromises = groupMembersId.map((groupMemberId) =>
                    axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User?id=${groupMemberId}`)
                )
                const response = await Promise.all(memberPromises)
                const fetchedMembers = response.map((response) => response.data)
                setMemeberDetails(fetchedMembers)
            } catch (error) {
                console.log('Error while fetching member details ', error)
            }
        }
        fetchMemberDetails()
    })

    console.log('memeberDetails', memeberDetails)
    // setGroupMembersId(currentGroup?.members)
    // console.log('the current group memebers are ', currentGroup.members)
    // console.log('the current group is ', currentGroup.name)
    // const fetchGroupMembers = () => {
    //     groupMembersId.map(async (groupMemberId) => {
    //         // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User?id=${groupMemberId}`)
    //         // console.log('the response is ', response.data)
    //         console.log('hi')
    //     })
    // }
    // fetchGroupMembers()

    // const memeberDetails = async (friend) => {
    //     try {
    //         const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User?id=${friend}`)
    //         //   setFriendName(response.data.userName)
    //         //   setFriendData(response.data)
    //         // console.log('the friend data is ', response.data)
    //     } catch (error) {
    //         console.log('Error while fetching friend details ', error)
    //     }
    // }
    //   useEffect(() => {
    //     if (friend) {
    //       friendDetails(friend)
    //     }
    //   }, [friend])

    return (
        <div className='w-[300px] bg-white py-6 pl-6 pr-3 flex flex-col gap-3 shadow-[0px_8px_24px_rgba(149,157,165,0.2)] rounded border border-gray-300'>
            <div className='flex items-center gap-x-2 pb-1'>
                <img className='size-[60px] rounded-full aspect-square object-cover object-center' src={currentGroup.profilePic} alt="" />
                <h1 className='text-[20px] font-semibold'>{currentGroup.name}</h1>
            </div>
            <div className='flex items-center gap-2'>
                <h2 className='text-[18px] font-medium'>Members</h2>
                <button className='bg-black text-white size-5 rounded-full text-[14px] font-semibold flex justify-center items-center'><i className="ri-add-line"></i></button>
            </div>
            <div className='flex flex-col gap-y-4 max-h-[250px] overflow-y-auto '>
                {
                    memeberDetails.map((member) => (
                        <div key={member._id} className='flex items-center gap-x-2'>
                            <img className='size-[35px] rounded-full aspect-square object-cover object-center' src={member.profilePic} alt="" />
                            <div className='flex justify-between w-full pr-2'>
                                <h1 className='font-medium text-sm'>{member.userName}</h1>
                                <h1 className={`mr-[10px] text-sm ${member.isOnline && 'text-green-600 font-semibold'}`}>{member.isOnline ? 'online' : 'offline'}</h1>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Information