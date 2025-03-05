import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Papa from "papaparse";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { FaHome, FaTable, FaDownload, FaSignOutAlt, FaEdit, FaTrashAlt, FaBars, FaCog, FaBell, FaUser, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddRecordForm from "./AddRecordForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "./ConfirmationModal";
import Spinner from "./Spinner";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [callRecords, setCallRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [chartData, setChartData] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [userName, setUserName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const recordsPerPage = 10;
  

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

  useEffect(() => {
    fetchCallRecords();
  }, []);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  const fetchCallRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/calls/");
      setCallRecords(response.data);
      generateChartData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching call records:", error);
      setLoading(false);
      toast.error("Failed to fetch data. Please try again.");
    }
  };

  const generateChartData = (data) => {
    const dailyCounts = {};
    const weeklyCounts = {};
    const monthlyCounts = {};

    data.forEach((record) => {
      const date = new Date(record.date);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date found:", record.date);
        return;
      }

      const day = date.toISOString().split('T')[0];
      const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() - 1) / 7) + 1}`;
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`;

      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
      weeklyCounts[week] = (weeklyCounts[week] || 0) + 1;
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    setChartData({
      labels: Object.keys(dailyCounts),
      datasets: [
        {
          label: "Daily Calls",
          data: Object.values(dailyCounts),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Weekly Calls",
          data: Object.values(weeklyCounts),
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
        {
          label: "Monthly Calls",
          data: Object.values(monthlyCounts),
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingRecord(null);
  };

  const handleDelete = async (id) => {
    setModalVisible(false);
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/calls/${id}/`);
      fetchCallRecords();
      toast.success("Record deleted successfully.");
    } catch (error) {
      toast.error("Error deleting record.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleExportCSV = () => {
    try {
      const csv = Papa.unparse(callRecords);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "call_records.csv";
      link.click();
      toast.success("CSV exported successfully.");
    } catch (error) {
      toast.error("Failed to export CSV.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/signup");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  const filteredRecords = callRecords.filter((record) => {
    const matchesSearch = record.customer_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? record.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div
        className={`w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-xl absolute top-20.5 left-0 h-full transition-all ${
          isSidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="p-6 space-y-10">
          <div className="text-center">
            <img
              src="https://th.bing.com/th/id/OIP.k7dE2dftQijg3KbpTyIObAHaHa?w=178&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt="Profile Avatar"
              className="w-20 h-20 mx-auto rounded-full border-4 border-white shadow-lg"
            />
            <h3 className="text-2xl font-semibold mt-4">AMS Dashboard</h3>
            <p className="text-sm text-gray-200">www.aartimultiservices.com</p>
          </div>

          {/* Menu Items */}
      <div className="space-y-4">
        {[
          { label: "Home", icon: <FaHome size={18} />, action: () => { setShowGraph(false); setShowTable(false); } },
          { label: "Stats Overview", icon: <FaTable size={18} />, action: () => { setShowGraph(true); setShowTable(false); } },
          { label: "Call Records", icon: <FaTable size={18} />, action: () => { setShowTable(true); setShowGraph(false); } },
        ].map((item, index) => (
          <motion.button
            key={index}
            className="flex items-center w-full px-5 py-3 rounded-lg bg-opacity-30 backdrop-blur-lg transition-all duration-300 ease-in-out 
                      hover:bg-opacity-50 hover:scale-105 border border-transparent hover:border-indigo-500 
                      dark:hover:border-cyan-500"
            onClick={item.action}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Dark Mode Toggle */}
      <motion.button
        onClick={toggleDarkMode}
        className="flex items-center w-full px-5 py-3 rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 
                  hover:bg-gray-700 dark:hover:bg-gray-300 transition-all duration-300 ease-in-out mt-6 border border-gray-700 dark:border-gray-400"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaCog className="mr-3" size={18} />
        <span className="text-lg font-semibold">Toggle Dark Mode</span>
      </motion.button>
    </div>
  </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-x-auto `}>
        <div className="p-18 space-y-0">
          {/* Topbar */}
          <div className={`flex justify-between items-center p-4 shadow-md rounded-md mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center space-x-4">
             
              <h1 className="text-3xl font-semibold">Call Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-500">
                  <FaBell size={24} />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div key={index} className="text-sm text-gray-700">
                          {notification}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-700">No new notifications</div>
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <button onClick={() => setShowProfile(!showProfile)} className="text-gray-500">
                  <FaUser size={24} />
                </button>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4">
                    <div className="text-sm text-gray-700">Welcome, {userName}</div>
                    <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 mt-2">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Home Section */}
{showGraph === false && showTable === false && callRecords.length > 0 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Card 1 */}
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">Total Calls</h3>
      <p className="text-2xl font-bold">{callRecords.length}</p>
    </div>
    {/* Card 2 */}
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">Pending Calls</h3>
      <p className="text-2xl font-bold">{callRecords.filter(record => record.status === 'Pending').length}</p>
    </div>
    {/* Card 3 */}
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">Open Calls</h3>
      <p className="text-2xl font-bold">{callRecords.filter(record => record.status === 'Open').length}</p>
    </div>
    {/* Card 4 */}
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">Closed Calls</h3>
      <p className="text-2xl font-bold">{callRecords.filter(record => record.status === 'Closed').length}</p>
    </div>
  </div>
)}


          {/* Dashboard Sections */}
          {showGraph && chartData && (
            <div className={`p-8 rounded-xl shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-xl font-semibold mb-6">Call Stats</h3>
              <Bar data={chartData} />
            </div>
          )}

          {showTable && (
            <>
              <div className="flex justify-between items-center mb-6">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 ease-in-out" onClick={toggleForm}>
                  {showForm ? "Close Form" : "Add New Record"}
                </button>
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 ease-in-out" onClick={handleExportCSV}>
                  <FaDownload className="mr-2" /> Export CSV
                </button>
              </div>

              {showForm && <AddRecordForm refreshRecords={fetchCallRecords} editingRecord={editingRecord}  setShowForm={setShowForm}/>}

              {/* Search and Filter */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by customer name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  >
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Call Records Table */}
              <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-xl">
                <table className={`min-w-full shadow-xl rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <tr>
                      <th className="border px-6 py-3">Customer Name</th>
                      <th className="border px-6 py-3">Caller Name</th>
                      <th className="border px-6 py-3">Number</th>
                      <th className="border px-6 py-3">Email</th>
                      <th className="border px-6 py-3">Address</th>
                      <th className="border px-6 py-3">Time</th>
                      <th className="border px-6 py-3">Date</th>
                      <th className="border px-6 py-3">Status</th>
                      <th className="border px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((record) => (
                      <tr key={record.id} className={`hover:bg-blue-100 transition-all duration-300 ease-in-out ${darkMode ? "hover:bg-gray-700" : ""}`}>
                        <td className="border px-6 py-3">{record.customer_name}</td>
                        <td className="border px-6 py-3">{record.caller_name}</td>
                        <td className="border px-6 py-3">{record.number}</td>
                        <td className="border px-6 py-3">{record.email}</td>
                        <td className="border px-6 py-3">{record.address}</td>
                        <td className="border px-6 py-3">{record.time}</td>
                        <td className="border px-6 py-3">{record.date}</td>
                        <td className="border px-6 py-3">{record.status}</td>
                        <td className="px-6 py-3 text-gray-800">
                          <button onClick={() => handleEdit(record)} className="text-blue-500 hover:text-blue-700 mr-2">
                            <FaEdit />
                          </button>
                          <button onClick={() => { setModalVisible(true); setRecordToDelete(record); }} className="text-red-500 hover:text-red-700">
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-6 space-x-4">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={`px-4 py-2 rounded-lg transition duration-200 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-300"}`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal visible={modalVisible} onClose={() => setModalVisible(false)} onConfirm={() => handleDelete(recordToDelete?.id)} />
      <ToastContainer />
      {loading && <Spinner />}
    </div>
  );
};

export default Dashboard;