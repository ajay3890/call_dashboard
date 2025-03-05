import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { FaBell } from "react-icons/fa";

const Admindashboard = () => {
  const [callRecords, setCallRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      sessionStorage.clear();
      navigate("/login");
    }
  };

  const [metrics, setMetrics] = useState({
    totalCalls: 0,
    completedCalls: 0,
    unresolvedCalls: 0,
    abandonedCalls: 0,
    pendingCalls: 0,
    csatScore: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Call Records
        const callsResponse = await fetch("http://localhost:8000/api/calls/");
        const callsData = await callsResponse.json();
        setCallRecords(callsData);
        calculateMetrics(callsData);
        prepareGraphData(callsData);
  
        // Fetch Active Users
        const usersResponse = await fetch("http://localhost:8000/api/auth/active_users/");
        const usersData = await usersResponse.json();
        setActiveUsers(usersData?.users || []);
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  // Fetch Notifications with Interval
  useEffect(() => {
    const fetchNotifications = async () => {
      console.log("Fetching notifications...");
      try {
        const response = await fetch(`http://localhost:8000/api/notifications/?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
        const data = await response.json();
        console.log("Received notifications:", data);
  
        if (Array.isArray(data)) {
          setNotifications((prevNotifications) => {
            // Only update if there's a change
            if (JSON.stringify(prevNotifications) !== JSON.stringify(data)) {
              console.log("Updating notifications...");
              return [...data]; // Ensures state update
            }
            return prevNotifications; // No change, avoid re-render
          });
        } else {
          console.error("Invalid response format. Expected an array.");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
  
    fetchNotifications(); // Fetch immediately
    const interval = setInterval(fetchNotifications, 5000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  const handleEdit = (record) => {
    alert(`Editing record for ${record.customer_name}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      try {
        await fetch(`http://localhost:8000/api/calls/${id}/`, {
          method: "DELETE",
        });
        setCallRecords(callRecords.filter((record) => record.id !== id));
        alert("Record deleted successfully!");
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const calculateMetrics = (data) => {
    const totalCalls = data.length;
    const completedCalls = data.filter((call) => call.status === "Completed").length;
    const unresolvedCalls = data.filter((call) => call.status !== "Completed").length;
    const abandonedCalls = data.filter((call) => call.status === "Abandoned").length;
    const pendingCalls = data.filter((call) => call.status === "Pending").length;

    const csatRatings = data.map((call) => call.csat_rating).filter((rating) => rating !== null);
    const csatScore = csatRatings.length ? (csatRatings.reduce((sum, rating) => sum + rating, 0) / csatRatings.length).toFixed(1) : 0;

    setMetrics({ totalCalls, completedCalls, unresolvedCalls, abandonedCalls, pendingCalls, csatScore });
  };

  const prepareGraphData = (data) => {
    const groupedData = data.reduce((acc, call) => {
      const date = call.date || "Unknown";
      if (!acc[date]) acc[date] = { date, calls: 0 };
      acc[date].calls += 1;
      return acc;
    }, {});
    setGraphData(Object.values(groupedData));
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedRecords = React.useMemo(() => {
    let sortableRecords = [...callRecords];
    if (sortConfig.key !== null) {
      sortableRecords.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRecords;
  }, [callRecords, sortConfig]);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white min-h-screen p-10 flex flex-col max-w-7xl mx-auto">
      <div className="absolute top-5 right-5 flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-md transition-all"
          >
            <FaBell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg">
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">Notifications</h3>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div key={index} className="p-2 border-b border-gray-700">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-400">{new Date(notification.timestamp).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No new notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
        >
          Logout
        </button>
      </div>

      <h1 className="text-5xl font-extrabold text-center mb-10">Admin Dashboard</h1>

      {loading ? (
        <p className="text-center text-gray-200">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Total Calls", value: metrics.totalCalls, action: () => setShowTable(!showTable) },
            { title: "Completed Calls", value: metrics.completedCalls },
            { title: "Unresolved Calls", value: metrics.unresolvedCalls },
            { title: "Abandoned Calls", value: metrics.abandonedCalls },
            { title: "Calls in Queue", value: metrics.pendingCalls },
            { title: "CSAT Score", value: `${metrics.csatScore}/100` },
            { title: "Active Users", value: activeUsers.length, action: () => setShowActiveUsers(!showActiveUsers) },
            { title: "📈 Call Trends", value: "View Graph", action: () => setShowGraph(!showGraph) },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl shadow-xl bg-gray-800 cursor-pointer transition-all"
              whileHover={{ scale: 1.05, rotate: 1 }}
              onClick={card.action || (() => {})}
            >
              <h2 className="text-lg font-bold">{card.title}</h2>
              <p className="text-4xl font-bold mt-4">{card.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {showGraph && (
        <div className="mt-10 bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white">📊 Call Trends Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="white" />
              <YAxis stroke="white" />
              <Tooltip wrapperStyle={{ backgroundColor: "#333", color: "white" }} />
              <Legend />
              <Line type="monotone" dataKey="calls" stroke="#4CAF50" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {showActiveUsers && (
        <div className="mt-10 bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white">👥 Active Users</h2>
          <ul className="text-gray-300">
            {activeUsers.length > 0 ? (
              activeUsers.map((user, index) => (
                <li key={user.id || index} className="p-4 border-b border-gray-700">
                  <span className="font-bold text-white">{user.username}</span> - {user.email}
                </li>
              ))
            ) : (
              <p className="text-gray-400">No active users found</p>
            )}
          </ul>
        </div>
      )}

      {showTable && (
        <div className="mt-10 bg-gray-900 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white">📊 Call Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-800 shadow-lg rounded-lg">
              <thead className="bg-gray-800 text-black">
                <tr className="text-lg">
                  {['customer_name', 'caller_name', 'number', 'email', 'address', 'time', 'date', 'status','Actions'].map((key) => (
                    <th
                      key={key}
                      className="p-4 border border-gray-700 cursor-pointer"
                      onClick={() => requestSort(key)}
                    >
                      {key.replace('_', ' ').toUpperCase()}
                      {sortConfig.key === key ? (sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽') : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-black">
                {sortedRecords.map((record, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-700">
                    <td className="p-4 border border-gray-700">{record.customer_name || "-"}</td>
                    <td className="p-4 border border-gray-700">{record.caller_name || "-"}</td>
                    <td className="p-4 border border-gray-700">{record.number || "-"}</td>
                    <td className="p-4 border border-gray-700">{record.email || "-"}</td>
                    <td className="p-4 border border-gray-700">{record.address || "-"}</td>
                    <td className="p-4 border border-gray-700">{record.time || "-"}</td>
                    <td className="p-4 border border-gray-700">{record.date || "-"}</td>
                    <td className="p-4 border border-gray-700">{record.status}</td>
                    <td className="p-4 border border-gray-700 flex items-center gap-3">
                      <button 
                        onClick={() => handleEdit(record)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        📝 Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admindashboard;