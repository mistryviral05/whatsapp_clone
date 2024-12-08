'use client';
import React, { useEffect, useState } from 'react';
import { FaLock, FaComments, FaBell, FaShieldAlt, FaDatabase, FaQuestionCircle, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '@/app/firebaseConfig'; // Ensure you have Firebase configured
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SettingsSection = () => {
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState('');
  const [file, setFile] = useState(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchUserData = async () => {
    const user = auth.currentUser;
    console.log(user)
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        setName(docSnap.data().name);
        setNewName(docSnap.data().name);
        setProfilePic(docSnap.data().profilePic || ''); // Set default profile pic
      } else {
        console.log('No such document!');
      }
    }
    setLoading(false);
  };

  const handleNameChange = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, { name: newName, profilePic: profilePic }, { merge: true });
      setName(newName);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef =  ref(storage, `profilePics/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfilePic(downloadURL);

      // Update Firestore with new profile picture URL
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, { profilePic: downloadURL }, { merge: true });
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[94vh] w-[45vw] bg-custom-darkchat">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-500 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-custom-darkchat h-[94vh] w-[45vw] border-r border-gray-700 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="flex items-center py-4 px-4 hover:bg-gray-800 transition cursor-pointer border-b border-gray-700">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <img
              src={profilePic || 'https://via.placeholder.com/48'}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
          </label>
          <div className="ml-4">
            <h2 className="text-xl">{name}</h2>
            <p className="text-gray-400">Hey there! I am using WhatsApp.</p>
          </div>
        </div>

        {/* Name Update Form */}
        <form onSubmit={handleNameChange} className="px-4 py-4 border-b border-gray-700">
          <label className="text-xl">Update Name:</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mt-2 p-2 w-full rounded bg-gray-800 border border-gray-600 text-white"
            placeholder="Enter your new name"
          />
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            Save
          </button>
        </form>

        {/* Settings Sections */}
        <div className="space-y-0">
          {/* Account Section */}
          <div className="flex items-center py-3 px-4 hover:bg-gray-800 transition cursor-pointer border-b border-gray-700">
            <FaLock className="text-xl mr-4" />
            <span className="text-xl">Account</span>
          </div>

          {/* Chats Section */}
          <div className="flex items-center py-3 px-4 hover:bg-gray-800 transition cursor-pointer border-b border-gray-700">
            <FaComments className="text-xl mr-4" />
            <span className="text-xl">Chats</span>
          </div>

          {/* Notifications Section */}
          <div className="flex items-center py-3 px-4 hover:bg-gray-800 transition cursor-pointer border-b border-gray-700">
            <FaBell className="text-xl mr-4" />
            <span className="text-xl">Notifications</span>
          </div>

          {/* Privacy Section */}
          <div className="flex items-center py-3 px-4 hover:bg-gray-800 transition cursor-pointer border-b border-gray-700">
            <FaShieldAlt className="text-xl mr-4" />
            <span className="text-xl">Privacy</span>
          </div>

          {/* Data and Storage Usage Section */}
          <div className="flex items-center py-3 px-4 hover:bg-gray-800 transition cursor-pointer border-b border-gray-700">
            <FaDatabase className="text-xl mr-4" />
            <span className="text-xl">Data and Storage Usage</span>
          </div>

          {/* Help Section */}
          <div className="flex items-center py-3 px-4 hover:bg-gray-800 transition cursor-pointer border-b border-gray-700">
            <FaQuestionCircle className="text-xl mr-4" />
            <span className="text-xl">Help</span>
          </div>

          {/* Invite a Friend Section */}
          <div className="flex items-center py-3 px-4 hover:bg-gray-800 transition cursor-pointer border-b border-gray-700">
            <FaUserFriends className="text-xl mr-4" />
            <span className="text-xl">Invite a Friend</span>
          </div>

          {/* Logout Section */}
          <div
            onClick={handleLogout}
            className="flex items-center py-3 px-4 hover:bg-red-600 transition cursor-pointer"
          >
            <FaSignOutAlt className="text-xl mr-4" />
            <span className="text-xl">Logout</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-700">
        <span className="text-gray-400 text-sm">WhatsApp © 2024</span>
      </div>
    </div>
  );
};

export default SettingsSection;
