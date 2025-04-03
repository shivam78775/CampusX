import React from "react";
import Slideshow from "../components/Slideshow";
import Logo from "../assets/Logo.png";

const LandingPage = () => {
  return (
    <div className="flex flex-col  min-h-screen bg-gray-100 p-4 w-screen">
      {/* Logo */}

      <img src={Logo} alt="CampusX Logo" className="h-25 w-50 mb-4" />

      {/* Slideshow Component */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-5xl my-6">
          <Slideshow />
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex items-center justify-center space-x-4 mt-6">
        <button className="w-80 font-bold rounded-full text-gray-900 py-3 px-6 transition-all duration-300 bg-gradient-to-r from-[#EEFF2D] to-[#D5F84F] hover:opacity-80">
          Create Account
        </button>
        <button className="w-80 font-bold rounded-full text-white py-3 px-6 transition-all duration-300 bg-transparent border border-gray-900 hover:opacity-80">
          Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
