import React from 'react';

function MessageBubble({ msg, isMe }) {
  return (
    <div className={`mb-2 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default MessageBubble;
