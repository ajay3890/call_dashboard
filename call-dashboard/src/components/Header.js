import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaEnvelopeOpenText } from "react-icons/fa";

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);
  const toggleNotifications = () => setShowNotifications((prev) => !prev);

  const handleLogout = () => {
    // Remove any auth tokens and navigate to login (or signup) page
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg relative">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left side: Logo & Title */}
        <div className="flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/40" // Replace with your logo URL
            alt="AMS Logo"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <h1 className="text-3xl font-bold">AMS Call Dashboard</h1>
            <p className="text-sm opacity-75">Manage your call records with ease</p>
          </div>
        </div>

        {/* Right side: Icons */}
        <div className="flex items-center space-x-4 relative">
          {/* Notifications Icon */}
          <button onClick={toggleNotifications} className="relative focus:outline-none">
            <FaBell size={24} />
            {/* Notification Badge */}
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-600 bg-white rounded-full">
              3
            </span>
          </button>

          {/* User Profile Icon */}
          <button onClick={toggleUserMenu} className="focus:outline-none">
            <FaUserCircle size={28} />
          </button>

          {/* Dropdown Menu for User Options */}
          {showUserMenu && (
            <div className="absolute right-0 mt-12 w-48 bg-white text-black rounded shadow-lg z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center space-x-2">
                <FaUserCircle />
                <span>Profile</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center space-x-2">
                <FaEnvelopeOpenText />
                <span>Messages</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center space-x-2">
                <FaCog />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-12 mt-12 w-64 bg-white text-black rounded shadow-lg z-10">
              <div className="p-4">
                <p className="text-sm">You have 3 new notifications.</p>
                <ul className="mt-2">
                  <li className="border-b border-gray-300 py-1 text-sm">New call record added.</li>
                  <li className="border-b border-gray-300 py-1 text-sm">Record updated successfully.</li>
                  <li className="py-1 text-sm">Reminder: Check pending calls.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
