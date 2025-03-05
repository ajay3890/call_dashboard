import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaEnvelopeOpenText } from "react-icons/fa";
import Dashboard from "./components/Dashboard";
import AddRecordForm from "./components/AddRecordForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/Admindashboard";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    const handleBackButton = () => {
      if (window.location.pathname === "/dashboard") {
        logoutUser();
      }
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, []);

  const loginUser = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {/* Header Section */}
        <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 shadow-lg rounded-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-extrabold tracking-wider">CRM Dashboard</h1>
            
          </div>
        </header>

        {/* Main Content Section */}
        <main className="flex-grow container mx-auto py-6 text-black">
          <Routes>
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login loginUser={loginUser} />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/add-record"
              element={isAuthenticated ? <AddRecordForm /> : <Navigate to="/login" />}
            />
                    <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

          </Routes>
        </main>

        {/* Footer Section */}
        <footer className="bg-gray-800 text-white text-center py-4">
          <p>&copy; AMS - Aarti Multi Services Call CRM. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
