import React from 'react';

function ChatHistory({ chatHistory, selectedUser, onSelectUser }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const truncateMessage = (content, maxLength = 30) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Recent Chats</h3>
      <ul className="space-y-1">
        {chatHistory.length > 0 ? (
          chatHistory.map((chat) => (
            <li
              key={chat._id}
              className={`p-3 cursor-pointer rounded-lg transition-colors ${
                selectedUser && selectedUser._id === chat._id
                  ? 'bg-yellow-100 border-l-4 border-yellow-400'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectUser(chat)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={chat.profilepic || "/default.png"}
                    alt={chat.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                                     {chat.unreadCount && chat.unreadCount > 0 && (
                     <span className="absolute -top-1 -right-1 bg-lime-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                       {chat.unreadCount}
                     </span>
                   )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 truncate">
                        {chat.name || chat.username}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage ? truncateMessage(chat.lastMessage.content) : 'No messages yet'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ''}
                      </p>
                                             {chat.unreadCount && chat.unreadCount > 0 && (
                         <div className="w-2 h-2 bg-lime-400 rounded-full mt-1 ml-auto"></div>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">
            <p>No chat history yet</p>
            <p className="text-sm">Start a conversation by searching for users</p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default ChatHistory;
