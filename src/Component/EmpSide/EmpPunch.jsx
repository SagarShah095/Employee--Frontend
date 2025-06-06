import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";
import axios from "axios";
import { useAuth } from "../../Context/authContext";
import TourManager from "../../shared/TourManager";
import Loader from "../Loader";

const EmpPunch = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [hasPunchedOut, setHasPunchedOut] = useState(false);
  const [lockUntil, setLockUntil] = useState(null);
  const [lunchInTime, setLunchInTime] = useState(null);
  const [lunchOutTime, setLunchOutTime] = useState(null);

  const url = "https://employee-backend-q7hn.onrender.com";

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

          await fetchPunchStatus(emp.emp_id);
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

        if (punch.LunchStart) {
          setLunchInTime(punch.LunchStart);
        } else {
          setLunchInTime(null);
        }

        if (punch.LunchEnd) {
          setLunchOutTime(punch.LunchEnd);
        } else {
          setLunchOutTime(null);
        }

        // 🔒 Handle lockUntil
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
    if (!selectedEmp || !isPunchedIn || hasPunchedOut || !lunchOutTime) return;

    try {
      const res = await axios.post(`${url}/api/punch/out`, {
        emp_id: selectedEmp.emp_id,
      });

      if (res.data.success) {
        const punchData = res.data.data;
        setCheckOutTime(punchData.PunchOut);
        setHasPunchedOut(true);

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

  const handleLunchIn = async () => {
    try {
      const res = await axios.post(`${url}/api/punch/lunch-start`, {
        emp_id: selectedEmp.emp_id,
      });
      if (res.data.success) {
        const now = new Date().toISOString();
        setLunchInTime(now);
        alert("Lunch In recorded.");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Lunch In error.");
    }
  };

  const handleLunchOut = async () => {
    try {
      const res = await axios.post(`${url}/api/punch/lunch-end`, {
        emp_id: selectedEmp.emp_id,
      });
      if (res.data.success) {
        const now = new Date().toISOString();
        setLunchOutTime(now);
        alert("Lunch Out recorded.");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Lunch Out error.");
    }
  };

  const steps = [
    {
      id: "page3-step1",
      text: "This is Attendace Page, here you can add your daily Punch. Click next to go to My Project page",
      attachTo: { element: ".page3-next-btn", on: "bottom" },
      nextRoute: "/employee/my-project", // Automatically passed to TourManager
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <TourManager steps={steps} pageKey="page3" />
      {loading && <Loader />}
      <>
        <Navbar />
        <div className="flex">
          <EmployeeSidebar />
          <div className="flex-1 p-8 ">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto page3-next-btn">
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
                Lunch In: {formatDateTime(lunchInTime)} <br />
                Lunch Out: {formatDateTime(lunchOutTime)}
                <br />
                Check-out: {formatDateTime(checkOutTime)}
              </p>

              <div className="flex gap-4 flex-wrap">
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded disabled:opacity-50"
                  onClick={handlePunchIn}
                  disabled={isPunchedIn || lockUntil}
                >
                  Punch In
                </button>

                {isPunchedIn && !lunchInTime && (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    onClick={handleLunchIn}
                  >
                    Lunch In
                  </button>
                )}

                {lunchInTime && !lunchOutTime && (
                  <button
                    className="bg-yellow-800 hover:bg-yellow-900 text-white px-4 py-2 rounded"
                    onClick={handleLunchOut}
                  >
                    Lunch Out
                  </button>
                )}

                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  onClick={handlePunchOut}
                  disabled={
                    !isPunchedIn || hasPunchedOut || lockUntil || !lunchOutTime
                  }
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
    </div>
  );
};

export default EmpPunch;
