import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GroupDataContext } from '../context/GroupContext';

const Information = () => {
  const [groupMembersId, setGroupMembersId] = useState([]);
  const { currentGroup, setCurrentGroup } = useContext(GroupDataContext);
  const [memberDetails, setMemberDetails] = useState([]); // Renamed for consistency
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [newMembers, setNewMembers] = useState([]); // Renamed to clarify these are new additions
  const [memberSearch, setMemberSearch] = useState('');
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Set group members when currentGroup changes
  useEffect(() => {
    if (currentGroup && currentGroup.members) {
      setGroupMembersId(currentGroup.members);
    } else {
      setGroupMembersId([]);
      setMemberDetails([]);
    }
  }, [currentGroup]);

  // Fetch existing member details
  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!groupMembersId.length) {
        setMemberDetails([]);
        return;
      }
      try {
        const memberPromises = groupMembersId.map((groupMemberId) =>
          axios.get(`${import.meta.env.VITE_BASE_URL}/user/find_User?id=${groupMemberId}`)
        );
        const response = await Promise.all(memberPromises);
        const fetchedMembers = response.map((res) => res.data);
        setMemberDetails(fetchedMembers);
      } catch (error) {
        console.log('Error while fetching member details:', error);
      }
    };
    fetchMemberDetails();
  }, [groupMembersId]);

  // Fetch member suggestions for search
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

  useEffect(() => {
    const timeOut = setTimeout(() => {
      fetchMemberSuggestions(memberSearch);
    }, 300);
    return () => clearTimeout(timeOut);
  }, [memberSearch]);

  // Add a new member to the newMembers list
  const handleAddMember = (member) => {
    if (!newMembers.some((m) => m._id === member._id) && !memberDetails.some((m) => m._id === member._id)) {
      setNewMembers([...newMembers, member]);
      console.log('Added member:', member.userName);
    } else {
      console.log('Member already exists in the group');
    }
    setMemberSearch('');
    setMemberSuggestions([]);
  };

  // Update group members on the server
  const updateGroupMembers = async () => {
    try {
      // Combine existing members (memberDetails) with new members (newMembers)
      const allMembers = [
        ...memberDetails.map((m) => m._id), // Use IDs to avoid duplicates
        ...newMembers.map((m) => m._id),
      ];
      const uniqueMembers = [...new Set(allMembers)]; // Remove duplicates if any

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/groupMessage/update_members`, {
        groupId: currentGroup._id,
        members: uniqueMembers, // Send combined unique member IDs
      });
      console.log('Server response:', response.data);

      // Update local state with the full member list after success
      const updatedMemberDetails = [...memberDetails, ...newMembers];
      setMemberDetails(updatedMemberDetails);
      setNewMembers([]); // Clear new members after adding
      setCurrentGroup((prev) => ({ ...prev, members: uniqueMembers })); // Update context
    } catch (error) {
      console.error('Error updating group members:', error.message);
    }
  };

  return (
    <div className='w-[300px] bg-white py-6 pl-6 pr-3 flex flex-col gap-3 shadow-[0px_8px_24px_rgba(149,157,165,0.2)] rounded border border-gray-300'>
      <div className='flex items-center gap-x-2 pb-1'>
        <img
          className='size-[60px] rounded-full aspect-square object-cover object-center'
          src={currentGroup.profilePic}
          alt=""
        />
        <h1 className='text-[20px] font-semibold'>{currentGroup.name}</h1>
      </div>
      <div className='flex items-center gap-2'>
        <h2 className='text-[18px] font-medium'>Members</h2>
        <button
          onClick={() => setShowSearchInput(!showSearchInput)}
          className='bg-black text-white size-5 rounded-full text-[14px] font-semibold flex justify-center items-center'
        >
          <i className="ri-add-line"></i>
        </button>
      </div>
      {showSearchInput && (
        <div className='relative'>
          <div className='flex items-center gap-2'>
            <input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className='w-full py-2 px-3 border border-gray-300 rounded'
              type="text"
              placeholder='Search'
            />
            <button
              onClick={updateGroupMembers}
              className='bg-black text-white py-2 px-5 font-semibold rounded'
            >
              Add
            </button>
          </div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {newMembers.map((member) => (
              <div key={member._id} className='flex items-center gap-1 bg-gray-200 px-2 py-1 rounded'>
                <img
                  className='aspect-square w-6 h-6 rounded-full object-cover object-center'
                  src={member.profilePic}
                  alt=""
                />
                <p className='text-sm text-black'>{member.userName}</p>
                <button
                  onClick={() => setNewMembers(newMembers.filter((m) => m._id !== member._id))}
                  className='text-red-500'
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            ))}
            {memberSearch && (
              <div className='w-full rounded-lg mt-3 border bg-[#ffffff] text-black p-5 absolute top-[100%] flex flex-col gap-5 shadow-[0px_8px_24px_rgba(149,157,165,0.2)]'>
                {loadingMembers ? (
                  <p>Searching...</p>
                ) : (
                  memberSuggestions.map((user) => (
                    <div
                      key={user._id}
                      className='flex items-center gap-2 cursor-pointer'
                      onClick={() => handleAddMember(user)}
                    >
                      <img
                        className='aspect-square w-8 h-8 rounded-full object-cover object-center'
                        src={user.profilePic}
                        alt=""
                      />
                      <p>{user.userName}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <div className='flex flex-col gap-y-4 max-h-[250px] overflow-y-auto'>
        {memberDetails.map((member) => (
          <div key={member._id} className='flex items-center gap-x-2'>
            <img
              className='size-[35px] rounded-full aspect-square object-cover object-center'
              src={member.profilePic}
              alt=""
            />
            <div className='flex justify-between w-full pr-2'>
              <h1 className='font-medium text-sm'>{member.userName}</h1>
              <h1 className={`mr-[10px] text-sm ${member.isOnline && 'text-green-600 font-semibold'}`}>
                {member.isOnline ? 'online' : 'offline'}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Information;