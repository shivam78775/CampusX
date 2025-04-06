import React, { useState } from "react";
import instance from "../services/axiosInstances";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await instance.post("/user/reset-password-request", {
        email,
      });
      setMessage(res.data.message || "Verification mail sent!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white w-screen px-6">
      <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
        <div className="max-w-md w-full p-6 bg-gray-100 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Enter your registered email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border rounded-lg outline-none text-black focus:ring-2"
            />

            <button
              type="submit"
              className="w-full bg-black text-black py-2 border-black rounded-lg hover:bg-gray-900 transition"
            >
              Send Reset Email
            </button>
          </form>

          {message && (
            <p className="text-green-600 text-center mt-4">{message}</p>
          )}
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}

          <p className="text-sm text-center text-gray-500 mt-6">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Go back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
