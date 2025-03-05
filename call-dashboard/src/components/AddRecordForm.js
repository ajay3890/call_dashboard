import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRecordForm = ({ refreshRecords, editingRecord, setShowForm }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    caller_name: "",
    number: "",
    email: "",
    address: "",
    time: "",
    date: "",
    duration: "",
    status: "",
    recording: null, // For file upload
  });

  // Load editing record into the form if applicable
  useEffect(() => {
    if (editingRecord) {
      setFormData({
        customer_name: editingRecord.customer_name || "",
        caller_name: editingRecord.caller_name || "",
        number: editingRecord.number || "",
        email: editingRecord.email || "",
        address: editingRecord.address || "",
        time: editingRecord.time || "",
        date: editingRecord.date || "",
        duration: editingRecord.duration || "",
        status: editingRecord.status || "",
        recording: null,
      });
    } else {
      resetForm();
    }
  }, [editingRecord]);

  const resetForm = () => {
    setFormData({
      customer_name: "",
      caller_name: "",
      number: "",
      email: "",
      address: "",
      time: "",
      date: "",
      duration: "",
      status: "",
      recording: null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, recording: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      if (editingRecord) {
        await axios.put(
          `http://localhost:8000/api/calls/${editingRecord.id}/`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Record updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/calls/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("New record added successfully!");
      }

      refreshRecords();
      resetForm();
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to save record!");
      console.error("Submission error:", error.response?.data || error.message);
    }
  };

  const handleCancel = () => {
    console.log("Cancel button clicked."); // Debugging
    resetForm();
    if (typeof setShowForm === "function") {
      setShowForm(false); // Ensure this updates state
    } else {
      console.error("setShowForm is not a function.");
    }
  };
  
  return (
    <div className="relative">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-10" />

      {/* Form container */}
      <form
        onSubmit={handleSubmit}
        className="relative z-20 grid grid-cols-2 gap-4 bg-white p-6 rounded-md shadow-md"
        encType="multipart/form-data"
      >
        {/* Example field: Customer Name */}
        <div>
          <label className="block text-gray-700">Customer Name</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full py-2 px-3 mt-1"
            required
          />
        </div>

        {/* Other fields would follow a similar structure */}
        <div>
          <label className="block text-gray-700">Caller Name</label>
          <input
            type="text"
            name="caller_name"
            value={formData.caller_name}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full py-2 px-3 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Number</label>
          <input
            type="tel"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full py-2 px-3 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full py-2 px-3 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full py-2 px-3 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full py-2 px-3 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full py-2 px-3 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full py-2 px-3 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full py-2 px-3 mt-1"
            required
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Cancel and Submit Buttons */}
        <div className="col-span-2 flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {editingRecord ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecordForm;