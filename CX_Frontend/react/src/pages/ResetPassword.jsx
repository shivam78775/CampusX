import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { resetPassword, loading } = useContext(AuthContext);

  useEffect(() => {
    console.log("Token from URL:", token); // Debug log
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const result = await resetPassword(newPassword, token);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white w-screen px-6">
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Set a New Password
          </h1>

          {success ? (
            <div className="text-center space-y-4">
              <p className="text-green-600 font-medium">
                Password reset successful!
              </p>
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-semibold"
              >
                Go back to the main page for login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-black py-2 rounded-xl hover:bg-blue-700 transition duration-200"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
