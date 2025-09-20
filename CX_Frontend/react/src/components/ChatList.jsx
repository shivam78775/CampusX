import React from 'react';

function ChatList({ users, onSelectUser }) {
  return (
    <div>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id} className="p-2 hover:bg-gray-200 cursor-pointer rounded" onClick={() => onSelectUser(user)}>
              <div className="flex items-center space-x-3">
                <img
                  src={user.profilepic || "/default.png"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border border-yellow-400"
                />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="p-2 text-gray-500">No users found</li>
        )}
      </ul>
    </div>
  );
}

export default ChatList;
