import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import instance from '../services/axiosInstances';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("loading"); // loading, success, error

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await instance.post("/auth/verify-token", { token });
        setMessage(res.data.message || "Email verified successfully!");
        setStatus("success");
        console.log("verifyEmailRes:", res);
      } catch (error) {
        setMessage("Verification failed!");
        setStatus("error");
        console.error("verifyEmailError:", error);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setStatus("error");
      setMessage("Missing verification token.");
    }
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white w-screen px-6">
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        {status === "loading" ? (
          <h1 className="text-xl font-semibold text-gray-700">Verifying your email...</h1>
        ) : (
          <>
            <h1 className={`text-2xl font-bold ${status === "success" ? "text-green-600" : "text-red-500"}`}>
              {message}
            </h1>
            <Link to="/" className="mt-6 inline-block text-blue-600 hover:underline text-lg">
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default VerifyEmail;
