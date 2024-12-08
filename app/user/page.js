'use client';
import React, { useEffect, useState, useRef } from 'react';
import { FaSearch, FaPaperPlane } from 'react-icons/fa';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, push, onValue } from 'firebase/database';
import { auth, database ,storage} from '../firebaseConfig';
import { useRouter } from 'next/navigation';
import { db } from '@/app/firebaseConfig';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import {  uploadBytes, getDownloadURL } from 'firebase/storage';
import { SentMessage, ReceivedMessage } from '@/components/Message';
import EmojiPicker from 'emoji-picker-react';

export default function HomePage() {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [chats, setChats] = useState([]);
  const [sendedMessage, setSendedMessage] = useState([]);
  const [inputImogyVisible, setInputImogyVisible] = useState(false);

  const router = useRouter();
  const audioRef = useRef(null); // Create reference for the audio element
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null); // Create reference for the emoji picker container

  const hanleUploadFile = async (e) => {
    const file = e.target.files[0];

    if (file) {
        // const storageRef = ref(storage,`messagePics/${auth.currentUser.uid}/${file.name}`)
        //   // console.log(storageRef)
        //   await uploadBytes(storageRef,file)
        //   const downloadURL = await getDownloadURL(storageRef)
        //   set

      console.log("File successfully selected ");
    }
  };

  const hanleImogyOpen = () => {
    setInputImogyVisible(!inputImogyVisible);
  };

  // Function to play sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchChats(user.uid);
      } else {
        console.log('No user is logged in');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchChats = async () => {
    const user = auth.currentUser;
    if (user) {
      const chatCollection = await getDocs(collection(db, "users", user.uid, "chats"));
      const chatdata = chatCollection.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatData(chatdata);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const parts = hash.split('#');
      if (parts.length === 2 && parts[0] === 'chat') {
        const chatId = parts[1];
        const chat = chatData.find((c) => c.id === chatId);
        setActiveChat(chat);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [chatData]);

  useEffect(() => {
    if (activeChat && currentUser) {
      const messagesRef = ref(database, `chats/${activeChat.phoneNumber}/messages`);
      const unsubscribe1 = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSendedMessage(Object.values(data));
        } else {
          setSendedMessage([]);
        }
      });
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
          if (user.phoneNumber) {
            receiveMessage(user.phoneNumber);
          } else {
            console.log('Phone number not available for the current user.');
          }
        } else {
          console.log('No user is logged in');
        }
      });

      return () => {
        unsubscribe();
        unsubscribe1();
      };
    }
  }, [activeChat, currentUser]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    const recipientPhoneNumber = activeChat?.phoneNumber;
    const currentUserPhoneNumber = auth.currentUser.phoneNumber;
    let chatId = null;

    chatData.forEach((chat) => {
      if (chat.phoneNumber === recipientPhoneNumber) {
        chatId = chat.phoneNumber;
      }
    });

    if (message.trim() && chatId) {
      const messagesRef = ref(database, `chats/${chatId}/messages`);
      push(messagesRef, {
        text: message,
        sender: currentUserPhoneNumber,
        receiver: recipientPhoneNumber,
        timestamp: Date.now(),
      });
      setChats([...chats, { id: chatId, participants: [currentUserPhoneNumber, recipientPhoneNumber] }]);
      setMessage('');
    } else {
      console.log('No valid chat ID found or message is empty.');
    }
  };

  const receiveMessage = async (chatId) => {
    if (!chatId) {
      alert('No chat ID provided');
      return;
    }

    chatId = auth.currentUser.phoneNumber;

    const messagesRef = ref(database, `chats/${chatId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newMessages = Object.values(data);
        if (newMessages.length > messages.length) {
          playNotificationSound(); // Play sound on receiving new messages
        }
        setMessages(newMessages);
      } else {
        setMessages([]);
      }
    }, {
      onlyOnce: false
    });
  };

  const onEmojiClick = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setInputImogyVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-custom-dark w-full h-[94vh] flex flex-col">
      {activeChat ? (
        <>
          <div className="top bg-custom-bluegray p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="dp">
                <img className="w-10 h-10" src={activeChat.avatar} alt={`${activeChat.name} avatar`} />
              </div>
              <div className="content flex flex-col">
                <h3 className="text-white">{activeChat.name}</h3>
                <p className="text-sm text-gray-400">{activeChat.lastMessage}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <FaSearch className="text-gray-400" />
            </div>
          </div>

          <div className="middle flex-grow overflow-y-auto p-4">
            {messages
              .concat(sendedMessage)
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((msg, index) => (
                msg.sender === currentUser.phoneNumber ? (
                  <SentMessage key={index} text={msg.text} className="message-sent sent-bubble" />
                ) : msg.sender === activeChat.phoneNumber ? (
                  <ReceivedMessage key={index} text={msg.text} className="message-received received-bubble" />
                ) : ''
              ))
            }
          </div>

          <div className="bottom bg-custom-bluegray flex items-center gap-4 px-10 justify-evenly py-3">
            <div onClick={hanleImogyOpen} className='cursor-pointer'>
              <img className="invert" src="/smily.svg" />
              {inputImogyVisible && 
                <div
                  ref={emojiPickerRef}
                  className={`absolute top-48 emoji-picker-container ${inputImogyVisible ? 'show' : ''}`}
                >
                  <EmojiPicker onEmojiClick={(emojiObject) => onEmojiClick(emojiObject)} />
                </div>
              }
            </div>
            <div onClick={() => fileInputRef.current.click()}>
              <img className="invert" src="/pluse.svg" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={e => hanleUploadFile(e)}
                className='hidden'
              />
            </div>
            <div className="bg-[#27353e] w-full rounded-xl px-3 py-2 flex items-center">
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={handleInputChange}
                className="bg-[#27353e] border-none outline-none text-white w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <div onClick={handleSendMessage}>
              {message.trim() ? (
                <FaPaperPlane className="text-white cursor-pointer" />
              ) : (
                <img className="invert" src="/voise.svg" />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-400">No chat selected</p>
        </div>
      )}

      {/* Hidden audio element for notification sound */}
      <audio ref={audioRef} src="/level-up-191997.mp3" preload="auto" />
    </div>
  );
}
