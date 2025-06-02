import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { useAuth } from "../../Context/authContext";
import Skeleton from "react-loading-skeleton";

const SummaryCard = ({ icon, text }) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [punchData, setPunchData] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    onLeave: 0,
    late: 0,
  });

  const fetchCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setCount(0);
    try {
      const response = await axios.get(
        "https://employee-backend-q7hn.onrender.com/api/employee/count",
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
        "https://employee-backend-q7hn.onrender.com/api/punch/attendance-summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log(response?.data, "fa");
        setAttendanceSummary({
          present: response.data.summary.present,
          onLeave: response.data.summary.onLeave || 0,
          late: response.data.summary.late || 0,
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

  useEffect(() => {
    const fetchPunches = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`https://employee-backend-q7hn.onrender.com/api/punch/`);
        setPunchData(data.data);
      } catch (err) {
        console.error("Failed to fetch punch data:", err);
      }
      setLoading(false);
    };
    fetchPunches();
  }, []);
  const absent = count - attendanceSummary.present;

  const [todayData, setTodayData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const today = new Date().toISOString().split("T")[0];
      const filteredData = punchData.filter((item) => {
        const punchInDate = new Date(item.PunchIn).toISOString().split("T")[0];
        return punchInDate === today;
      });
      setTodayData(filteredData);
      setLoading(false);
    }, 1500);
  }, [punchData]);

  const calculateTotalTime = (inTime, outTime, lunchStart, lunchEnd) => {
    if (!inTime || !outTime) return "--";

    const inDate = new Date(inTime);
    const outDate = new Date(outTime);

    // Handle cross-midnight scenarios (optional)
    if (outDate < inDate) return "--";

    let totalDiff = outDate - inDate;

    // Subtract lunch time if both start and end exist and are valid
    if (lunchStart && lunchEnd) {
      const lunchStartDate = new Date(lunchStart);
      const lunchEndDate = new Date(lunchEnd);

      if (
        lunchEndDate > lunchStartDate &&
        lunchStartDate > inDate &&
        lunchEndDate < outDate
      ) {
        totalDiff -= lunchEndDate - lunchStartDate;
      }
    }

    // Convert milliseconds to hours and minutes
    const hrs = Math.floor(totalDiff / 3600000);
    const mins = Math.round((totalDiff % 3600000) / 60000); // Round to nearest minute

    return `${hrs}h ${mins}m`;
  };
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 ml-1">
          Today's Attendance
        </h2>
        <p className="text-gray-500 mb-6 ml-1">
          Number of employees who are present, absent, on leave, or late today
        </p>
        <div className="grid grid-cols-3 gap-10">
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
          {/* <AttendanceCard
            label="Late"
            value={attendanceSummary.late}
            bgColor="bg-orange-500"
            symbol="⏱"
          /> */}
        </div>
      </div>
      <div className="mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          📅 Today's Attendance
        </h2>

        {loading ? (
          <table className="w-full border">
            <thead>
              <tr>
                {[
                  "Employee",
                  "Status",
                  "Punch In",
                  "Punch Out",
                  "Lunch Start",
                  "Lunch End",
                  "Total",
                ].map((header, i) => (
                  <th key={i} className="border px-4 py-2">
                    <Skeleton width={100} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((__, j) => (
                    <td key={j} className="border px-4 py-2">
                      <Skeleton width="80%" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : !loading && todayData.length > 0 ? (
          // Show actual data table
          <table className="w-full border">
            <thead>
              <tr className="bg-blue-100">
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Punch In</th>
                <th className="border px-4 py-2">Punch Out</th>
                <th className="border px-4 py-2">Lunch Start</th>
                <th className="border px-4 py-2">Lunch End</th>
                <th className="border px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {todayData.map((item) => (
                <tr key={item._id} className="hover:bg-blue-50 transition">
                  <td className="border px-4 py-2">
                    {item.emp_name} ({item.emp_id})
                  </td>
                  <td className="border px-4 py-2">{item.status}</td>
                  <td className="border px-4 py-2">
                    {item.PunchIn
                      ? new Date(item.PunchIn).toLocaleTimeString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {item.PunchOut
                      ? new Date(item.PunchOut).toLocaleTimeString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {item.LunchStart
                      ? new Date(item.LunchStart).toLocaleTimeString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {item.LunchEnd
                      ? new Date(item.LunchEnd).toLocaleTimeString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {calculateTotalTime(
                      item.PunchIn,
                      item.PunchOut,
                      item.LunchStart,
                      item.LunchEnd
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && (
            // Show no data message
            <p className="text-center text-gray-500 italic">
              No records found for today.
            </p>
          )
        )}
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
