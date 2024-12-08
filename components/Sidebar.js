'use client';
import React, { useEffect, useState } from 'react';
import ChatSection from './ChatSection';
import StatusSection from './StatusSection';
import ChannelsSection from './ChannelsSection';
import CommunitiesSection from './CommunitiesSection';
import SettingsSection from './SettingsSection';

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('chat'); // Default section
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      // Example chat data - replace with actual API or Firebase call
      const chatData = [
        {
          id: 1,
          name: 'BVM IT GROUP(UNOFFICIAL) 2023-2024',
          lastMessage: 'Lorem ipsum dolor sit amet consectetur',
          avatar: '/group.svg',
        },
        {
          id: 2,
          name: 'Project Team Chat',
          lastMessage: 'Please review the PR before tomorrow',
          avatar: '/group.svg',
        },
        {
          id: 3,
          name: 'Family Group',
          lastMessage: 'Let’s plan a trip next weekend!',
          avatar: '/group.svg',
        },
      ];
      setChats(chatData);
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const [section, id] = hash.split('#');
      setActiveSection(section || 'chat');

      if (section === 'chat') {
        const chatId = parseInt(id, 10);
        const chat = chats.find(c => c.id === chatId);
        setSelectedChat(chat || null);
      }
    };

    // Set the active section based on the initial hash
    handleHashChange();

    // Listen for changes to the URL hash
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [chats]);

  const renderContent = () => {
    if (activeSection === 'chat') {
      return <ChatSection chat={selectedChat} />;
    }

    switch (activeSection) {
      case 'status':
        return <StatusSection />;
      case 'channels':
        return <ChannelsSection />;
      case 'communities':
        return <CommunitiesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default Sidebar;
