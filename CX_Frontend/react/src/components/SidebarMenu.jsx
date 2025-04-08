import {
    CancelSquareIcon,
    Logout02Icon,
    SidebarLeftIcon,
  } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/react";
  import React from "react";
  import { useNavigate } from "react-router-dom";
  
  export default function SidebarMenu({ visible, onClose, onLogout }) {
    const navigate = useNavigate();
  
  
    return (
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-100 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            <HugeiconsIcon icon={SidebarLeftIcon} />
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold cursor-pointer hover:opacity-70 transition"
          >
            <HugeiconsIcon icon={CancelSquareIcon} />
          </button>
        </div>
        <ul className="p-4 space-y-4">
          <li className="bg-gray-300 p-3 rounded-2xl cursor-pointer">
            <span
              onClick={() => navigate("/settings")}
              className="text-black hover:underline"
            >
              Settings
            </span>
          </li>
          <li className="cursor-pointer bg-gray-300 p-3 rounded-2xl">
            <span
              onClick={() => navigate("/about")}
              className="text-black hover:underline"
            >
              About
            </span>
          </li>
          <li className="cursor-pointer bg-gray-300 p-3 rounded-2xl">
            <span
              onClick={() => navigate("/contact")}
              className="text-black hover:underline"
            >
              Contact Us
            </span>
          </li>
          <li className="cursor-pointer bg-gray-300 p-3 rounded-2xl text-red-500 hover:underline flex gap-2 items-center">
            <span onClick={onLogout} className="flex items-center gap-2">
              Logout
              <HugeiconsIcon icon={Logout02Icon} />
            </span>
          </li>
        </ul>
      </div>
    );
  }
  