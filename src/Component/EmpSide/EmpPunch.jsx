import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";
import axios from "axios";
import { useAuth } from "../../Context/authContext";
import { Loader } from "lucide-react";

const EmpPunch = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [hasPunchedOut, setHasPunchedOut] = useState(false);
  const [lockUntil, setLockUntil] = useState(null);

  const url = "https://employee-backend-q7hn.onrender.com";

  // 🔄 Fetch employee and punch status
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      setLoading(true);

      try {
        const res = await axios.get(`${url}/api/employee/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.data.success) {
          const emp = res.data.emp;
          setSelectedEmp(emp);

          // 👉 Fetch punch status using latest endpoint
          await fetchPunchStatus(emp.emp_id);

          // 🕒 Restore lock state from localStorage
          const storedLockUntil = localStorage.getItem("lockUntil");
          if (storedLockUntil) {
            const lockTime = new Date(storedLockUntil);
            if (Date.now() < lockTime.getTime()) {
              setLockUntil(lockTime);
            } else {
              localStorage.removeItem("lockUntil");
            }
          }
        } else {
          console.error("Employee fetch failed.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const fetchPunchStatus = async (emp_id) => {
    try {
      const res = await axios.get(`${url}/api/punch/latest/${emp_id}`);
      if (res.data.success) {
        const punch = res.data.punch;
        const status = res.data.alreadyPunchedToday;

        if (status === "in") {
          setCheckInTime(punch.PunchIn);
          setIsPunchedIn(true);
        } else if (status === "out") {
          setCheckInTime(punch.PunchIn);
          setCheckOutTime(punch.PunchOut);
          setHasPunchedOut(true);
        } else {
          setIsPunchedIn(false);
          setHasPunchedOut(false);
        }

        // 🔒 Set lockUntil from backend
        if (punch?.lockUntil) {
          const lockTime = new Date(punch.lockUntil);
          if (Date.now() < lockTime.getTime()) {
            setLockUntil(lockTime);
          } else {
            setLockUntil(null);
          }
        } else {
          setLockUntil(null);
        }
      }
    } catch (error) {
      console.error("Error fetching punch status", error);
    }
  };

  const formatDateTime = (iso) => {
    if (!iso) return "--";
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ✅ Handle Punch In
  const handlePunchIn = async () => {
    if (!selectedEmp || isPunchedIn || lockUntil) return;

    const now = new Date().toISOString();
    try {
      const res = await axios.post(`${url}/api/punch/add`, {
        emp_id: selectedEmp.emp_id,
        emp_name: selectedEmp.emp_name,
        PunchIn: now,
      });

      if (res.data.success) {
        setCheckInTime(now);
        setIsPunchedIn(true);
        localStorage.setItem("checkInTime", now);
        alert("Punch In successful.");
      } else {
        alert(res.data.message || "Punch In failed.");
      }
    } catch (err) {
      console.error("Punch In Error:", err);
      alert("Error during Punch In.");
    }
  };

  const handlePunchOut = async () => {
    if (!selectedEmp || !isPunchedIn || hasPunchedOut) return;

    try {
      const res = await axios.post(`${url}/api/punch/out`, {
        emp_id: selectedEmp.emp_id,
      });

      if (res.data.success) {
        const punchData = res.data.data;
        setCheckOutTime(punchData.PunchOut);
        setHasPunchedOut(true);

        // 🔒 Set lockUntil from backend response
        if (punchData.lockUntil) {
          setLockUntil(new Date(punchData.lockUntil));
        }

        alert("Punch Out successful. Locked for 12 hours.");
      } else {
        alert(res.data.message || "Punch Out failed.");
      }
    } catch (err) {
      console.error("Punch Out Error:", err);
      alert("Error during Punch Out.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <Loader className="animate-spin w-12 h-12 text-teal-600" />
        </div>
      )}

      {!loading && (
        <>
          <Navbar />
          <div className="flex">
            <EmployeeSidebar />
            <div className="flex-1 p-8">
              <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-teal-600 mb-4">
                  Attendance
                </h2>

                <p className="text-gray-700 mb-2">
                  Status:{" "}
                  {isPunchedIn && !hasPunchedOut
                    ? "Present (Punched In)"
                    : hasPunchedOut
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
                    disabled={isPunchedIn || lockUntil}
                  >
                    Punch In
                  </button>

                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={handlePunchOut}
                    disabled={!isPunchedIn || hasPunchedOut || lockUntil}
                  >
                    Punch Out
                  </button>
                </div>

                {lockUntil && (
                  <p className="text-sm text-red-500 mt-4">
                    Punching disabled until: {formatDateTime(lockUntil)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmpPunch;
