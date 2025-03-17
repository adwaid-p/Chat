import React, { useContext, useEffect, useState } from 'react'
import Contact from './Contact'
import axios from 'axios'
import { useSocket } from '../context/SocketContext';
import GroupMessage from './GroupMessage';
import { MessageDataContext } from '../context/MessageContext';
import { GroupDataContext } from '../context/GroupContext';

const Messages = () => {

  const [search, setSearch] = useState('')
  const [memberSearch, setMemberSearch] = useState('')
  const [friendSuggestions, setFriendSuggestions] = useState([]); // Separate state for friend search
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [friends, setFriends] = useState([])
  const [currentUser, setCurrentUser] = useState('')
  const [showGroup, setShowGroup] = useState(false)
  const [showUser, setShowUser] = useState(true)
  const [showCreateGroupCard, setShowCreateGroupCard] = useState(false)
  const [groupName, setGroupName] = useState('')

  const [groups, setGroups] = useState([])


  const { receiver, setReceiver } = useContext(MessageDataContext)
  const {currentGroup, setCurrentGroup} = useContext(GroupDataContext)

  const [latestMessage, setLatestMessage] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (data) => {
      setLatestMessage(data);
    });
    // console.log('the latest message is ',latestMessage)
    return () => socket.off('receiveMessage');
  }, [socket])

  const fetchFriendSuggestions = async () => {
    if (!search) {
      setFriendSuggestions([])
      return
    }
    try {
      setLoadingFriends(true)
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/search?query=${search}`)
      setFriendSuggestions(response.data)
      // console.log(suggestions)
    } catch (error) {
      console.error('Error in fetching data is : ', error.message)
    } finally {
      setLoadingFriends(false)
    }
  }

  const fetchMemberSuggestions = async () => {
    if (!memberSearch) {
      setMemberSuggestions([]);
      return;
    }
    try {
      setLoadingMembers(true);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/search?query=${memberSearch}`);
      setMemberSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching member suggestions:', error.message);
    } finally {
      setLoadingMembers(false);
    }
  };

  const userId = JSON.parse(localStorage.getItem('user_id'))
  const addFriend = async (friendId) => {
    try {
      // console.log('the user id is',userId)
      // console.log('the friend id is',friendId)
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/update_friend`, { userId, friendId })
      // console.log('the resonse data is after updation',response.data)
      setFriends(response.data.friends)
    } catch (error) {
      console.error('Error in fetching data is : ', error.message)
    }
  }



  useEffect(() => {
    const findUser = async () => {

      try {
        const userId = JSON.parse(localStorage.getItem('user_id'))
        // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User`,{userId})
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User?id=${userId}`);
        // const data = response.data
        setCurrentUser(response.data)
        // console.log(data)
      } catch (error) {
        console.log('Error while fetching Data', error.message)
      }

    }
    findUser()
    // setCurrentUser(findUser())
    // console.log('the current user data: ',currentUser)
  }, [])

  useEffect(() => {
    if (currentUser?.friends) {
      setFriends(currentUser?.friends)
    }
  }, [currentUser])



  useEffect(() => {
    const timeOut = setTimeout(() => {
      fetchFriendSuggestions(search);
    }, 300);
    return () => clearTimeout(timeOut);
  }, [search]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      fetchMemberSuggestions(memberSearch);
    }, 300);
    return () => clearTimeout(timeOut);
  }, [memberSearch]);

  // console.log('members are', memberSearch)

  const handleAddMember = (member) => {
    if (!members.includes(member)) {
      setMembers([...members, member]);
      console.log('the members are', members)
    } else {
      console.log('Member already exists in the group');
    }
    setMemberSearch('');
    setMemberSuggestions([]);
  }

  const handleCreateGroup = async () => {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/groupMessage/createGroup`, {
      name: groupName,
      members: [...members, currentUser._id],
      createdBy: currentUser._id
    });
    console.log(response);
    setShowCreateGroupCard(false);
  }

  // const userId = localStorage.getItem('user_id')
  // console.log('userId', userId)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // if (!currentUser?._id) return;
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/groupMessage/getGroups`, {
          params: {
            userId: userId
          }
        })
        setGroups(response.data)
        // console.log('the response from the server for groups : ', response)
      } catch (error) {
        console.log('Error while fetching groups ', error)
      }
    }
    fetchGroups()
}, [currentGroup])

  // console.log('the response from the server for groups : ', groups)

  return (

    <div className='h-screen md:relative w-full p-5 flex flex-col gap-5'>
      {/* <h1 className='text-3xl font-semibold'>Chats</h1> */}
      <div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} className='w-full bg-[#e1e4e9] text-black p-2 px-5 rounded-3xl focus:outline-gray-500 border-none relative placeholder:text-gray-500' type="text" placeholder='Search' />
        {search &&
          <div className='w-[250px]  rounded-lg mt-3 border bg-[#ffffff] text-black p-5 fixed flex flex-col gap-5 shadow-[0px_8px_24px_rgba(149,157,165,0.2)]'>
            {
              loadingFriends ? (
                <p>Searching...</p>
              ) : (
                friendSuggestions.map((user) => (
                  // console.log(user)
                  <div key={user._id} className='flex items-center gap-2 cursor-pointer' onClick={() => {
                    // setFriends(prevFriends => [...prevFriends, user]);
                    addFriend(user._id)
                    // console.log('the friends are',friends)
                    setSearch('')
                  }}>
                    <img className='aspect-square w-8 h-8 rounded-full object-cover object-center' src={user.profilePic} alt="" />
                    <p className=''>{user.userName}</p>
                  </div>
                ))
              )
            }
          </div>
        }
      </div>
      <div className='h-full w-full flex flex-col gap-5 md:pr-2'>
        <div className='flex items-center gap-2'>
          <button onClick={() => {
            setShowGroup(false)
            setShowUser(true)
            setCurrentGroup('')
          }}
            className='bg-[#201f1f] px-4 py-1 rounded text-[14px] font-semibold'>Inbox</button>
          <button onClick={() => {
            setShowGroup(true)
            setShowUser(false)
            setReceiver('')
          }}
            className='bg-[#201f1f] px-4 py-1 rounded text-[14px] font-semibold'>Groups</button>
          {
            showGroup && <button
              onClick={() => setShowCreateGroupCard(!showCreateGroupCard)}
              className='bg-gray-500 size-6 rounded-full text-[14px] font-semibold flex justify-center items-center'><i className="ri-add-line"></i></button>
          }
        </div>
        <div className='flex flex-col gap-1 h-full overflow-y-auto overflow-x-hidden'>
          {
            showUser ? (friends.map((friend) => (
              // console.log(friend)
              <Contact key={friend} friend={friend} latestMessage={latestMessage} />
            ))) : showGroup ? (
            // <GroupMessage groups={groups} />
            groups.map((group) => (
              // console.log(friend)
              <GroupMessage key={group._id} group={group} />
            ))
          ) : null
          }
        </div>

        {showCreateGroupCard &&
          <div className='absolute z-10 top-0 left-0 h-[100dvh] w-[100dvw] flex items-center justify-center bg-[#ffffff69] backdrop:blur-lg'>
            <div className='absolute z-0 top-0 left-0 h-[100dvh] w-[100dvw] backdrop-blur-[3px]' ></div>
            <div className='md:w-[500px] max-h-[400px] bg-white p-14 rounded-lg flex flex-col gap-4 relative z-10 border shadow-[0px_8px_24px_rgba(149,157,165,0.2)]'>
              <div className='absolute top-0 right-0 p-3 cursor-pointer' onClick={() => setShowCreateGroupCard(false)}>
                <i className="text-2xl text-gray-500 ri-close-line"></i>
              </div>
              <div className='flex items-center gap-2'>
                <button className='size-[50px] aspect-square bg-gray-500 rounded-full'>
                  <img src="" alt="" />
                </button>
                <input onChange={(e) => setGroupName(e.target.value)} className='w-full border-[1px] border-gray-300 px-4 py-2 text-black rounded' type="text" placeholder='Group Name' />
              </div>
              <div>
                <input
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className='w-full bg-[#fafafa] text-black p-3 px-5 border-[1px] border-gray-300 rounded-2xl focus:outline-gray-800 border-none relative placeholder:text-gray-500'
                  placeholder='Search members'
                  type="text"
                />
                <div className='flex flex-wrap gap-2 mt-2'>
                  {members.map((member) => (
                    <div key={member._id} className='flex items-center gap-1 bg-gray-200 px-2 py-1 rounded'>
                      <img className='aspect-square w-6 h-6 rounded-full object-cover object-center' src={member.profilePic} alt="" />
                      <p className='text-sm text-black'>{member.userName}</p>
                      <button
                        onClick={() => setMembers(members.filter(m => m._id !== member._id))}
                        className='text-red-500'
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                  ))}
                </div>
                {memberSearch &&
                  <div className='w-[400px] rounded-lg mt-3 border bg-[#ffffff] text-black p-5 fixed flex flex-col gap-5 shadow-[0px_8px_24px_rgba(149,157,165,0.2)]'>
                    {loadingMembers ? (
                      <p>Searching...</p>
                    ) : (
                      memberSuggestions.map((user) => (
                        <div
                          key={user._id}
                          className='flex items-center gap-2 cursor-pointer'
                          onClick={() => handleAddMember(user)}
                        >
                          <img className='aspect-square w-8 h-8 rounded-full object-cover object-center' src={user.profilePic} alt="" />
                          <p className=''>{user.userName}</p>
                        </div>
                      ))
                    )}
                  </div>
                }
              </div>
              <button onClick={() => handleCreateGroup()} className='bg-[#201f1f] py-2 rounded text-base font-semibold'>Create</button>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Messages