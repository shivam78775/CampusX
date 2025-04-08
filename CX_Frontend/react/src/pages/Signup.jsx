import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/alogo1.gif";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "username" ? value.toLowerCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("Backend URL:", backendUrl); 
  
    try {
      const response = await axios.post(`${backendUrl}/api/v1/user/register`, formData);
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
      console.error("Signup error:", error);
    }
  };
  

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white w-screen px-6">
      {/* Back & Info Icons */}
      <div className="flex gap-60">
        <HugeiconsIcon icon={ArrowLeft02Icon} color="black" />
        <HugeiconsIcon icon={InformationCircleIcon} color="black" />
      </div>

      {/* Logo */}
      <img src={Logo} alt="CampusX Logo" className="h-40 mb-4" />

      {/* Headings */}
      <h6 className="text-2xl font-bold mb-2 text-gray-900">Create Account</h6>
      <h6 className="text-gray-800 mb-6 text-center flex items-center justify-center">
        Create your profile and Join your campus community today!
      </h6>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name:"
          onChange={handleChange}
          value={formData.name}
          className="w-full p-3 border text-black rounded-md focus:ring-2 focus:ring-yellow-500"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username:"
          onChange={handleChange}
          value={formData.username}
          className="w-full p-3 border text-black rounded-md focus:ring-2 focus:ring-yellow-500"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email:"
          onChange={handleChange}
          value={formData.email}
          className="w-full p-3 border text-black rounded-md focus:ring-2 focus:ring-yellow-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password:"
          onChange={handleChange}
          value={formData.password}
          className="w-full p-3 border text-black rounded-md focus:ring-2 focus:ring-yellow-500"
          required
        />

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full py-3 text-black bg-gradient-to-r from-[#EEFF2D] to-[#D5F84F] rounded-md"
        >
          Sign Up
        </button>
      </form>

      {/* Redirect to Login */}
      <p className="mt-4 text-gray-600">
        Already have an account?{" "}
        <span
          className="cursor-pointer text-black font-semibold underline"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;
