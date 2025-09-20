import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  AnonymousIcon,
  DashboardSquare01Icon,
  UserSharingIcon,
} from "@hugeicons/core-free-icons";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center z-10 h-[56px] rounded-t-3xl">
      {/* Home */}
      <div
        onClick={() => navigate("/home")}
        className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
          location.pathname === "/home" || location.pathname === "/"
            ? "text-blue-600"
            : "text-gray-400"
        }`}
      >
        <HugeiconsIcon
          icon={DashboardSquare01Icon}
          className="h-6 w-6"
        />
        <span className="text-xs mt-1">Home</span>
      </div>

      {/* Search */}
      <div
        onClick={() => navigate("/search/users")}
        className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
          location.pathname === "/search/users" || location.pathname.startsWith("/search")
            ? "text-blue-600"
            : "text-gray-400"
        }`}
      >
        <FiSearch className="h-6 w-6" />
        <span className="text-xs mt-1">Search</span>
      </div>

      {/* Create Post - Centered */}
      <div className="relative">
        <div
          onClick={() => navigate("/create-post")}
          className={`absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#eafe31] to-[#d2f93c] text-black border border-white rounded-full w-14 h-14 flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-105 ${
            location.pathname === "/create-post" ? "ring-2 ring-blue-300" : ""
          }`}
        >
          <HugeiconsIcon icon={Add01Icon} className="text-black h-6 w-6" />
        </div>
      </div>

      {/* Anonymous Posts */}
      <div
        onClick={() => navigate("/anonymous-posts")}
        className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
          location.pathname === "/anonymous-posts"
            ? "text-blue-600"
            : "text-gray-400"
        }`}
      >
        <HugeiconsIcon icon={AnonymousIcon} className="h-6 w-6" />
        <span className="text-xs mt-1">Anonymous</span>
      </div>

      {/* Profile */}
      <div
        onClick={() => navigate("/profile")}
        className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
          location.pathname === "/profile" || location.pathname.startsWith("/profile/")
            ? "text-blue-600"
            : "text-gray-400"
        }`}
      >
        <HugeiconsIcon icon={UserSharingIcon} className="h-6 w-6" />
        <span className="text-xs mt-1">Profile</span>
      </div>
    </div>
  );
};

export default Footer;
