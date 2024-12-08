// components/Message.
'use client'
import React from 'react';

export function SentMessage({ text }) {
  return (
    <div className="message message-sent">
      <p className="message-bubble sent-bubble">
        {text}
      </p>
    </div>
  );
}

export function ReceivedMessage({ text }) {
  return (
    <div className="message message-received">
      <p className="message-bubble received-bubble">
        {text}
      </p>
      
    </div>
  );
}
