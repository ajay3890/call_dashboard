import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";

function Login({ loginUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    setError(null);

    // Simulating API call delay
    setTimeout(() => {
      const isSuperuser = username === "admin"; // Mock condition, replace with real API logic

      localStorage.setItem("is_superuser", isSuperuser);
      loginUser();
      setLoading(false);
      
      // Redirect based on user role
      navigate(isSuperuser ? "/admin-dashboard" : "/dashboard");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 w-96"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-3 bg-red-900/30 p-2 rounded">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            <input
              type="text"
              placeholder="Username"
              className="pl-10 p-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full placeholder-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="relative mb-4">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            <input
              type="password"
              placeholder="Password"
              className="pl-10 p-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full placeholder-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 text-white ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Additional Options */}
        <div className="text-center mt-4 text-white/80 text-sm">
          <p className="mt-2">
            Don't have an account?{" "}
            <span
              className="text-blue-300 hover:text-blue-400 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
