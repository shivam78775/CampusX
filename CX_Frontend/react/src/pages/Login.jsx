import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/alogo1.gif";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,
        formData,
        {
          withCredentials: true, // If your backend uses cookies
        }
      );

      alert(response.data.message);
      navigate("/home"); // Or to dashboard/home page
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Login failed. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white w-screen px-6">
      {/* Icons */}
      <div className="flex gap-60">
        <HugeiconsIcon icon={ArrowLeft02Icon} color="black" />
        <HugeiconsIcon icon={InformationCircleIcon} color="black" />
      </div>

      {/* Logo */}
      <img src={Logo} alt="CampusX Logo" className="h-40 mb-4" />

      {/* Headings */}
      <h6 className="text-2xl font-bold mb-2 text-gray-900">Welcome Back!</h6>
      <h6 className="text-gray-800 mb-6 text-center flex items-center justify-center">
        Connect, Share, and Grow with Your Campus Community.
      </h6>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email:"
          onChange={handleChange}
          value={formData.email}
          className="w-full p-3 border bg rounded-md text-black focus:ring-2 focus:ring-yellow-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password:"
          onChange={handleChange}
          value={formData.password}
          className="w-full p-3 border rounded-md text-black focus:ring-2 focus:ring-yellow-500"
          required
        />
        <span
          onClick={() => navigate("/forgot-password")}
          className="text-black mb-3 pb-5 cursor-pointer hover:underline"
        >
          Forgot Password?
        </span>

        <button
          type="submit"
          className="w-full py-3 mt-5 text-black bg-gradient-to-r from-[#EEFF2D] to-[#D5F84F] rounded-md"
        >
          Login
        </button>
      </form>

      {/* Redirect to Sign Up */}
      <p className="mt-4 text-gray-600">
        Don't have an account?{" "}
        <span
          className="cursor-pointer text-black font-semibold underline"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;
