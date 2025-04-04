import React from "react";
import { FaBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  DashboardSquare01Icon,
  UserSharingIcon,
} from "@hugeicons/core-free-icons";

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center z-10 h-[56px]">
      <div className="flex flex-col items-center justify-center text-gray-400 active-link">
        <HugeiconsIcon
          icon={DashboardSquare01Icon}
          className="fill-current text-black"
        />

        {/* No text label in the active state */}
      </div>
      <div className="flex flex-col items-center justify-center text-gray-400">
        <FiSearch className="h-6 w-6" />
        {/* No text label */}
      </div>
      <div className="relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#eafe31] to-[#d2f93c] text-white border border-white rounded-full w-14 h-14 flex items-center justify-center shadow-md">
          <HugeiconsIcon icon={Add01Icon} className="text-black" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-gray-400">
        <FaBell className="h-6 w-6" />
        {/* No text label */}
      </div>
      <div className="flex flex-col items-center justify-center text-gray-400">
        <HugeiconsIcon icon={UserSharingIcon} size={32} /> {/* No text label */}
      </div>
    </div>
  );
};

export default Footer;
