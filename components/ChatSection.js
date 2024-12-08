'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { db, auth } from '@/app/firebaseConfig';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const ChatSection = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newChatName, setNewChatName] = useState('');
  const [isAddingNewChat, setIsAddingNewChat] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search input

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const parts = hash.split('#');
      if (parts.length === 2 && parts[0] === 'chat') {
        const chatId = parts[1];
        setActiveChatId(chatId);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set user state when the user is authenticated
        fetchChatsAndPhoneNumber(user.uid);
      } else {
        console.log('No user is logged in');
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const fetchChatsAndPhoneNumber = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const chatCollection = await getDocs(collection(db, 'users', user.uid, 'chats'));
        const chatData = chatCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chatData);
      } else {
        console.log('No user is logged in');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleChatClick = (chatId) => {
    const hash = `chat#${chatId}`;
    window.location.hash = hash;
    setActiveChatId(chatId);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleAddChat = async () => {
    if (phoneNumber.trim()) {
      const existingChat = chats.find((chat) => chat.phoneNumber === phoneNumber);
      if (existingChat) {
        handleChatClick(existingChat.id);
      } else {
        try {
          const user = auth.currentUser;
          if (user) {
            // Create a new chat document
            const chatDocRef = doc(collection(db, 'users', user.uid, 'chats'));
            await setDoc(chatDocRef, {
              name: newChatName || phoneNumber,
              lastMessage: 'Start a new conversation',
              avatar: '/group.svg',
              phoneNumber: phoneNumber, // Store the phone number
            }, { merge: true });
  
            const newChatId = chatDocRef.id;
            setChats([...chats, { id: newChatId, name: newChatName || phoneNumber, phoneNumber:phoneNumber }]);
            handleChatClick(newChatId);
            setPhoneNumber('');
            setNewChatName('');
            setIsAddingNewChat(false);
          }
        } catch (error) {
          console.error('Error adding new chat:', error);
        }
      }
    }
  };

  // Filter the chats based on the search input
  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.phoneNumber.includes(searchQuery)
  );

  return (
    <div className='bg-custom-darkchat h-[94vh] w-[45vw] border-r border-gray-700 text-white flex flex-col box-border'>
      {/* Top Section */}
      <div className='px-4'>
        <div className='top w-full flex items-center justify-between py-3 px-3'>
          <h1 className='font-bold text-2xl'>Chats</h1>
          <div className='flex items-center gap-7'>
            <img className='invert cursor-pointer' src='/newChat.svg' alt='New Chat Icon' onClick={() => setIsAddingNewChat(true)} />
            <img className='invert cursor-pointer' src='/menu.svg' alt='Menu Icon' />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className='px-4'>
        <div className='flex items-center bg-[#202c33] w-full rounded-md mt-4 py-1 px-4'>
          <FaSearch className='text-gray-400 mr-3' />
          <input
            type='text'
            placeholder='Search'
            value={searchQuery} // Bind search input to searchQuery state
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
            className='bg-transparent border-none outline-none text-white w-full'
          />
        </div>
      </div>

      {/* Chat Filters */}
      <div className='px-4'>
        <div className='check flex px-1 gap-2 mt-2'>
          <div className='bg-[#202c33] px-3 py-1 text-gray-400 rounded-full cursor-pointer'>
            <p>All</p>
          </div>
          <div className='bg-[#202c33] px-3 py-1 text-gray-400 rounded-full cursor-pointer'>
            <p>Unread</p>
          </div>
          <div className='bg-[#202c33] px-3 py-1 text-gray-400 rounded-full cursor-pointer'>
            <p>Groups</p>
          </div>
        </div>
      </div>

      {/* Dynamic Chats Section */}
      <div className='chats flex flex-col mt-4 overflow-auto'>
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat flex items-center gap-2 py-3 border-b-2 px-4 border-gray-800 cursor-pointer ${activeChatId === chat.id ? 'bg-gray-700' : ''} w-full`}
              onClick={() => handleChatClick(chat.id)}
            >
              <img className='w-14 h-14 rounded-full' src={chat.avatar} alt={`${chat.name} avatar`} />
              <div className='content flex flex-col w-full'>
                <h3 className='text-xl truncate'>{chat.name}</h3>
                <p className='truncate'>{chat.lastMessage}</p>
                <p className='text-gray-400 truncate'>{chat.phoneNumber}</p> {/* Display the phone number */}
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-400'>No chats available.</p>
        )}
      </div>

      {/* Add New Chat */}
      {isAddingNewChat && (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-custom-dark p-6 rounded-lg w-[80%] md:w-[40%]'>
            <h2 className='text-xl mb-4'>Start a New Chat</h2>
            <input
              type='text'
              placeholder='Enter phone number'
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className='bg-[#202c33] text-white rounded-md p-2 mb-4 w-full'
            />
            <input
              type='text'
              placeholder='Enter name (optional)'
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              className='bg-[#202c33] text-white rounded-md p-2 mb-4 w-full'
            />
            <button
              onClick={handleAddChat}
              className='bg-blue-500 text-white rounded-md p-2 w-full'
            >
              Add Chat
            </button>
            <button
              onClick={() => setIsAddingNewChat(false)}
              className='bg-red-500 text-white rounded-md p-2 w-full mt-2'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSection;
