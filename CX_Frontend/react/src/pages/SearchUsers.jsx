import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import Footer from "../components/Footer";
import axios from "axios";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (query.trim() === "") {
      setUsers([]);
      return;
    }
  
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4444/api/v1/user/search?username=${query}`, {
        withCredentials: true, 
      });
  
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white w-screen px-6 text-black">
      <div className="min-h-screen bg-white p-4 w-full max-w-md">
        <div className="flex items-center space-x-2 mb-4">
          <button onClick={() => window.history.back()} className="text-xl">
            <HugeiconsIcon icon={ArrowLeft02Icon} />
          </button>
          <input
            type="text"
            placeholder="Search username"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-4 mb-4">
          <span className="font-semibold text-black border-b-2 border-black pb-1">
            Accounts
          </span>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500">No users found</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user._id}>
                <Link
                  to={`/profile/${user.username}`}
                  className="flex items-center space-x-3"
                >
                  <img
                    src={user.profilepic || "/default.png"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border border-yellow-400"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Footer />
      </div>

    </div>

  );
};

export default SearchUsers;
