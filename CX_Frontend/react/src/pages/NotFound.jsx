import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white w-screen px-6">
      <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-4">
        <img
          src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif" 
          alt="Not Found"
          className="w-80 h-80 object-contain"
        />
        <h1 className="text-3xl font-bold mt-6 text-gray-800">
          Page Not Found
        </h1>
        <p className="text-gray-600 mt-2 mb-6">
          The page you’re looking for doesn’t exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-black px-5 py-2 rounded-full hover:bg-black-600 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
