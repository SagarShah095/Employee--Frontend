import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";
import axios from "axios";
import { useAuth } from "../../Context/authContext";
import { Loader } from "lucide-react";

const EmployeeDashboard = () => {
  const { user } = useAuth();


  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [hasPunchedOut, setHasPunchedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [loading, setLoading] = useState(true); // start with loading true


  // ✅ Replace these with actual logged-in user details


  const url = "https://employee-backend-q7hn.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/employee/${user?._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setSelectedEmp(response.data.emp);

          // Check localStorage punch data
          const savedCheckInTime = localStorage.getItem("checkInTime");
          const savedCheckOutTime = localStorage.getItem("checkOutTime");

          if (savedCheckInTime) {
            const timeDiff = Date.now() - new Date(savedCheckInTime).getTime();
            const hoursPassed = timeDiff / (1000 * 60 * 60);

            if (hoursPassed < 12) {
              setCheckInTime(savedCheckInTime);
              setIsPunchedIn(true);
            } else {
              localStorage.removeItem("checkInTime");
              localStorage.removeItem("checkOutTime");
            }
          }

          if (savedCheckOutTime) {
            setCheckOutTime(savedCheckOutTime);
            setHasPunchedOut(true);
          }

        } else {
          console.error("Failed to fetch employee");
        }
      } catch (error) {
        console.error("API Error:", error.response || error);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);


  console.log(selectedEmp, "selectedEmpselectedEmpselectedEmp")

  const formatDateTime = (isoString) => {
    if (!isoString) return "--";
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  const handlePunchIn = () => {
    if (!isPunchedIn && !checkInTime) {
      const time = new Date().toISOString();
      localStorage.setItem("checkInTime", time);
      setCheckInTime(time);
      setIsPunchedIn(true);
    }
  };


  const handlePunchOut = async () => {
    if (isPunchedIn && !hasPunchedOut) {
      const time = new Date().toISOString();
      localStorage.setItem("checkOutTime", time);
      setCheckOutTime(time);
      setIsPunchedIn(false);
      setHasPunchedOut(true);

      try {
        const response = await axios.post(`${url}/api/punch/add`, {
          emp_id: selectedEmp.emp_id,
          emp_name: selectedEmp.emp_name,
          PunchIn: checkInTime,
          PunchOut: time,
        });

        if (response.data.success) {
          alert("Punch record saved successfully.");
        } else {
          alert("Failed to save punch record.");
        }
      } catch (error) {
        console.error("Punch out error:", error);
        alert("Something went wrong while saving the punch record.");
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {loading && <Loader/>}
      <Navbar />
      <div className="flex">
        <EmployeeSidebar />
        <div className="flex-1 p-8">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-teal-600 mb-4">Attendance</h2>

            <p className="text-gray-700 mb-2">
              Status:{" "}
              {checkInTime && !hasPunchedOut
                ? "Present (Punched In)"
                : checkOutTime
                  ? "Completed"
                  : "Not Punched In"}
            </p>

            <p className="text-gray-500 mb-4">
              Check-in: {formatDateTime(checkInTime)} <br />
              Check-out: {formatDateTime(checkOutTime)}
            </p>

            <div className="flex gap-4">
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={handlePunchIn}
                disabled={!!checkInTime}
              >
                Punch In
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={handlePunchOut}
                disabled={!isPunchedIn || hasPunchedOut}
              >
                Punch Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default EmployeeDashboard;
