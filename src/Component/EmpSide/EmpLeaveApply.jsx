import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";
import axios from "axios";
import { useAuth } from "../../Context/authContext";
import { Loader } from "lucide-react";

const LeaveAdd = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false)
  const [leave, setLeave] = useState({
    emp_id: user?.emp_id || "",
    emp_name: user?.emp_name || "",
    leavetype: "",
    fromDate: "",
    toDate: "",
  });

  const [redAlert, setRedAlert] = useState(false);

  // Ensure leave state updates when user data becomes available
  useEffect(() => {
    if (user?.emp_id && user?.emp_name) {
      setLeave((prev) => ({
        ...prev,
        emp_id: user.emp_id,
        emp_name: user.emp_name,
      }));
    }
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
    setLoading(true)
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
          emp_id: user.emp_id,
          emp_name: user.emp_name,
          leavetype: "",
          fromDate: "",
          toDate: "",
        });
      } else {
        alert("Leave applied Error!");
      }
      setLoading(false)
    } catch (error) {
      console.error("Error applying leave:", error);
      alert("Something went wrong while applying leave!");
    }
    setLoading(false)
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-100 to-white">
      {loading && <Loader />}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <EmployeeSidebar />

        <div className="w-full bg-gray-100 min-h-screen p-8">
          <h1 className="text-xl font-semibold text-center mb-6">Apply Leaves</h1>

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
                value={user.emp_id}
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
                value={user.emp_name}
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
