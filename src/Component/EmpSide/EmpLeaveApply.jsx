import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";
import axios from "axios";
import { useAuth } from "../../Context/authContext";

import TourManager from "../../shared/TourManager";
import Loader from "../Loader";


const LeaveAdd = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [empData, setEmpData] = useState(null);
  const [leave, setLeave] = useState({
    emp_id: user?.emp_id || "",
    emp_name: user?.emp_name || "",
    leavetype: "",
    desc: "",
    fromDate: "",
    toDate: "",
  });
  const [redAlert, setRedAlert] = useState(false);

  // ✅ Fetch user-specific data from API on mount
  useEffect(() => {
    const fetchEmpData = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `https://employee-backend-q7hn.onrender.com/api/employee/${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          const emp = res.data.emp?.find((e) => e.email === user.email);
          setEmpData(emp);
          setLeave((prev) => ({
            ...prev,
            emp_id: emp?.emp_id || "",
            emp_name: emp?.emp_name || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
      setLoading(false);
    };

    fetchEmpData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prevLeave) => ({
      ...prevLeave,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (leave.toDate < leave.fromDate) {
      setRedAlert(true);
      return;
    } else {
      setRedAlert(false);
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://employee-backend-q7hn.onrender.com/api/leave/add",
        leave,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response?.data?.success) {
        alert("Leave applied successfully!");
        setLeave({
          emp_id: empData?.emp_id,
          emp_name: empData?.emp_name,
          leavetype: "",
          fromDate: "",
          toDate: "",
        });
      } else {
        alert("Leave application error!");
      }
    } catch (error) {
      console.error("Error applying leave:", error);
      alert("Something went wrong while applying leave!");
    }
    setLoading(false);
  };
  const steps = [
    {
      id: "page4-step",
      text: "This is  Apply Leave Page, here you can Apply Your Leave . Click next to go to  Salary Page",
      attachTo: { element: ".page4-next-btn", on: "bottom" },
      nextRoute: "/employee/salary-history",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-100 to-white">
      <TourManager steps={steps} pageKey="page7" />
      {loading && <Loader />}
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <EmployeeSidebar />
        <div className="w-full bg-gray-100 min-h-screen p-8">
          <h1 className="text-3xl font-semibold text-center mb-6">
            Apply Leaves
          </h1>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mx-auto"
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Employee ID
              </label>
              <input
                type="text"
                value={user?.emp_id}
                readOnly
                className="shadow appearance-none border bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                value={user?.emp_name}
                readOnly
                className="shadow appearance-none border bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Leave Type
              </label>
              <select
                name="leavetype"
                onChange={handleChange}
                value={leave.leavetype}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="" disabled>
                  Select Leave Type
                </option>
                <option value="Sick">Sick Leave</option>
                <option value="Casual">Casual Leave</option>
                <option value="Annual">Annual Leave</option>
              </select>
            </div>

            <textarea
              value={leave.desc}
              name="desc"
              rows={3}
              onChange={handleChange}
              required
              className="w-full border focus:outline-none focus:border-green-500 rounded-lg p-2"
            />
            {redAlert && (
              <div className="text-red-500 text-sm mb-4">
                Please check the From Date and To Date.
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                From Date
              </label>
              <input
                type="date"
                name="fromDate"
                onChange={handleChange}
                value={leave.fromDate}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                To Date
              </label>
              <input
                type="date"
                name="toDate"
                onChange={handleChange}
                value={leave.toDate}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-2 mt-3 rounded-md w-full hover:bg-teal-700 transition duration-200"
            >
              Apply Leave
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveAdd;
