'use client';
import React, { useEffect, useState } from 'react';

const Sidebar1 = () => {
  const [activeSection, setActiveSection] = useState('chat'); // Default section
  const [hoveredSection, setHoveredSection] = useState(null); // To track the hovered section

  useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(window.location.hash.replace('#', '') || 'chat');
    };

    // Set the active section based on the initial hash
    handleHashChange();

    // Listen for changes to the URL hash
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const isActive = (section) => section === activeSection;

  return (
    <div className='bg-custom-bluegray w-24 flex flex-col justify-between border-r pb-4 border-gray-700'>
      <div className='top flex flex-col items-center justify-around h-1/3'>
        <div
          onClick={() => (window.location.hash = 'chat')}
          onMouseEnter={() => setHoveredSection('chat')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`p-2 cursor-pointer rounded-full relative ${isActive('chat'||'chat#1'||'chat#2'||'chat#3') ? 'bg-gray-700' : ''}`}
        >
          <img className='invert' src='/chat.svg' alt='Chat' />
          {hoveredSection === 'chat' && (
            <div
              className='absolute left-12 top-1/4 transform -translate-y-1/2 bg-white text-black text-xs py-1 px-4 rounded-full
                         transition-transform duration-200 ease-out scale-0 origin-left'
              style={{ animation: 'grow 0.2s forwards' }}
            >
              Chat
            </div>
          )}
        </div>
        <div
          onClick={() => (window.location.hash = 'status')}
          onMouseEnter={() => setHoveredSection('status')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`p-2 cursor-pointer rounded-full relative ${isActive('status') ? 'bg-gray-700' : ''}`}
        >
          <img className='invert' src='/status.svg' alt='Status' />
          {hoveredSection === 'status' && (
            <div
              className='absolute left-12 top-1/4 transform -translate-y-1/2 bg-white text-black text-xs py-1 px-4 rounded-full
                         transition-transform duration-200 ease-out scale-0 origin-left'
              style={{ animation: 'grow 0.2s forwards' }}
            >
              Status
            </div>
          )}
        </div>
        <div
          onClick={() => (window.location.hash = 'channels')}
          onMouseEnter={() => setHoveredSection('channels')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`p-2 cursor-pointer rounded-full relative ${isActive('channels') ? 'bg-gray-700' : ''}`}
        >
          <img className='invert' src='/chanels.svg' alt='Channels' />
          {hoveredSection === 'channels' && (
            <div
              className='absolute left-12 top-1/4 transform -translate-y-1/2 bg-white text-black text-xs py-1 px-4 rounded-full
                         transition-transform duration-200 ease-out scale-0 origin-left'
              style={{ animation: 'grow 0.2s forwards' }}
            >
              Channels
            </div>
          )}
        </div>
        <div
          onClick={() => (window.location.hash = 'communities')}
          onMouseEnter={() => setHoveredSection('communities')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`p-2 cursor-pointer rounded-full relative ${isActive('communities') ? 'bg-gray-700' : ''}`}
        >
          <img className='invert' src='/comunities.svg' alt='Communities' />
          {hoveredSection === 'communities' && (
            <div
              className='absolute left-12 top-1/4 transform -translate-y-1/2 bg-white text-black text-xs py-1 px-4 rounded-full
                         transition-transform duration-200 ease-out scale-0 origin-left'
              style={{ animation: 'grow 0.2s forwards' }}
            >
              Communities
            </div>
          )}
        </div>
      </div>

      <div className='bottom flex flex-col items-center justify-around h-24'>
        <div
          onClick={() => (window.location.hash = 'settings')}
          onMouseEnter={() => setHoveredSection('settings')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`p-2 cursor-pointer rounded-full relative ${isActive('settings') ? 'bg-gray-700' : ''}`}
        >
          <img className='invert' src='/geare.svg' alt='Settings' />
          {hoveredSection === 'settings' && (
            <div
              className='absolute left-12 top-1/4 transform -translate-y-1/2 bg-white text-black text-xs py-1 px-4 rounded-full
                         transition-transform duration-200 ease-out scale-0 origin-left'
              style={{ animation: 'grow 0.2s forwards' }}
            >
              Settings
            </div>
          )}
        </div>
        <div className='dp'>
          <img className='w-10 h-10' src='/group.svg' alt='Group' />
        </div>
      </div>
    </div>
  );
};

export default Sidebar1;
