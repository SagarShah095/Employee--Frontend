import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { useAuth } from "../../Context/authContext";

const SummaryCard = ({ icon, text }) => {
  const [count, setCount] = useState(0); // Total employees
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    onLeave: 0,
    late: 0,
  });

  const { user } = useAuth();

  const fetchCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setCount(0);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employee/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) setCount(response.data.count);
    } catch (error) {
      console.error("Error fetching employee count:", error);
    }
  };

  const fetchAttendanceSummary = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get(
        "http://localhost:5000/api/punch/attendance-summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setAttendanceSummary({
          present: response.data.summary.present,
          onLeave: response.data.summary.onLeave,
          late: response.data.summary.late,
        });
      }
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
    }
  };

  useEffect(() => {
    fetchCount();
    fetchAttendanceSummary();
  }, []);

  // Calculate Absent dynamically
  const absent = count - attendanceSummary.present;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-center bg-teal-600 text-white text-3xl px-5">
            {icon}
          </div>
          <div className="p-4">
            <p className="text-gray-600 font-medium">{text}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
        </div>

        <div className="flex bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-center bg-yellow-600 text-white text-3xl px-5">
            <FaBuilding />
          </div>
          <div className="p-4">
            <p className="text-gray-600 font-medium">Total Departments</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </div>
      </div>

      {/* Attendance Summary for Today */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 ml-1">Today's Attendance</h2>
        <p className="text-gray-500 mb-6 ml-1">
          Number of employees who are present, absent, on leave, or late today
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <AttendanceCard
            label="Present"
            value={attendanceSummary.present}
            bgColor="bg-green-600"
            symbol="P"
          />
          <AttendanceCard
            label="Absent"
            value={absent}
            bgColor="bg-red-600"
            symbol="A"
          />
          <AttendanceCard
            label="On Leave"
            value={absent}
            bgColor="bg-yellow-500"
            symbol="L"
          />
          <AttendanceCard
            label="Late"
            value={attendanceSummary.late}
            bgColor="bg-orange-500"
            symbol="⏱"
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Attendance Card Component
const AttendanceCard = ({ label, value, bgColor, symbol }) => (
  <div className="flex bg-white rounded-lg shadow-md overflow-hidden">
    <div
      className={`flex items-center justify-center ${bgColor} text-white text-3xl px-5 font-bold`}
    >
      {symbol}
    </div>
    <div className="p-4">
      <p className="text-gray-600 font-medium">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default SummaryCard;
