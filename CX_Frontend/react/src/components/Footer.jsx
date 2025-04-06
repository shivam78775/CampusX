import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  DashboardSquare01Icon,
  UserSharingIcon,
} from "@hugeicons/core-free-icons";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-[-1px] left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center z-10 h-[56px] rounded-t-3xl ">
      {/* Home */}
      <div
        onClick={() => navigate("/home")}
        className="flex flex-col items-center justify-center text-gray-400 active-link cursor-pointer"
      >
        <HugeiconsIcon
          icon={DashboardSquare01Icon}
          className="fill-current text-black"
        />
      </div>

      {/* Search */}
      <div
        onClick={() => navigate("/search/users")}
        className="flex flex-col items-center justify-center text-gray-400 cursor-pointer"
      >
        <FiSearch className="h-6 w-6" />
      </div>

      {/* Create Post */}
      <div className="relative">
        <div
          onClick={() => navigate("/create-post")}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#eafe31] to-[#d2f93c] text-white border border-white rounded-full w-14 h-14 flex items-center justify-center shadow-md cursor-pointer"
        >
          <HugeiconsIcon icon={Add01Icon} className="text-black" />
        </div>
      </div>

      {/* Notifications */}
      <div
        onClick={() => navigate("/notifications")}
        className="flex flex-col items-center justify-center text-gray-400 cursor-pointer"
      >
        <FaBell className="h-6 w-6" />
      </div>

      {/* Profile */}
      <div
        onClick={() => navigate("/profile")}
        className="flex flex-col items-center justify-center text-gray-400 cursor-pointer"
      >
        <HugeiconsIcon icon={UserSharingIcon} size={32} />
      </div>
    </div>
  );
};

export default Footer;
