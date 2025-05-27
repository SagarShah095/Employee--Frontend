import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";
import axios from "axios";
import { useAuth } from "../../Context/authContext";
import Loader from "../Loader";

const EmployeeDashboard = () => {
  const { user } = useAuth(); // user should contain emp_id
  const url = "http://localhost:5000";

  const [employeeData, setEmployeeData] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salary, setSalary] = useState({})

  useEffect(() => {
    const FetchSalaryData = async () => {
      if (!user?.emp_id) return; // prevent running without user

      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/salary`);
        if (response.data.success) {
          const matchedSalary = response.data.data.find(
            (sal) => sal.mainEmpId === user.emp_id
          );
          setSalary(matchedSalary || {});
        } else {
          console.log("Salary Error in Dashboard");
        }
      } catch (error) {
        console.log("Error fetching salary:", error);
      } finally {
        setLoading(false);
      }
    };

    FetchSalaryData();
  }, []); // <- important dependency


  console.log(salary, "salarysalarysalary")

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Fetch all employees
        const empRes = await axios.get(`${url}/api/employee/`);
        if (empRes.data.success) {
          const empList = empRes.data.Emp;
          const matchedEmp = empList.find((emp) => emp.emp_id === user.emp_id);
          setEmployeeData(matchedEmp || {}); // set individual employee
        }

        // Fetch attendance records
        const attRes = await axios.get(`${url}/api/punch`);
        if (attRes.data.success) {
          const punchData = Array.isArray(attRes.data.data)
            ? attRes.data.data
            : [attRes.data.data];

          const filtered = punchData.filter(
            (item) => item.emp_id === user.emp_id
          );

          const sorted = [...filtered].sort(
            (a, b) => new Date(b.PunchIn) - new Date(a.PunchIn)
          );

          setAttendanceData(sorted);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.emp_id) {
      fetchDashboardData();
    }
  }, [user]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB");

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const calculateTotalTime = (inTime, outTime) => {
    if (!inTime || !outTime) return "--";
    const inDate = new Date(inTime);
    const outDate = new Date(outTime);
    const diff = outDate - inDate;
    if (diff < 0) return "--";

    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);

    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {loading && <Loader />}
      <Navbar />
      <div className="flex">
        <EmployeeSidebar />
        <div className="w-full p-6">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Welcome, {employeeData?.emp_name || "Employee"}
            </h2>
            <div className="flex flex-wrap items-center gap-8">
              <img
                src={
                  employeeData?.Img
                    ? `${url}/${employeeData.Img}`
                    : "https://via.placeholder.com/150"
                }
                alt="profile"
                className="w-28 h-28 object-cover rounded-full"
              />
              <div className="space-y-2">
                <p><strong>Employee ID:</strong> {employeeData?.emp_id}</p>
                <p><strong>Department:</strong> {employeeData?.Dept}</p>
                <p><strong>Gender:</strong> {employeeData?.Gen}</p>
                <p><strong>DOB:</strong> {formatDate(employeeData?.dob)}</p>
              </div>
            </div>
          </div>

          {/* Attendance Records */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Latest Attendance</h3>
            {attendanceData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr className="text-gray-700">
                      <th className="py-2 px-4 border">Date</th>
                      <th className="py-2 px-4 border">Punch In</th>
                      <th className="py-2 px-4 border">Punch Out</th>
                      <th className="py-2 px-4 border">Total Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.slice(0, 10).map((att, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4">{formatDate(att.PunchIn)}</td>
                        <td className="py-2 px-4">{formatTime(att.PunchIn)}</td>
                        <td className="py-2 px-4">{formatTime(att.PunchOut)}</td>
                        <td className="py-2 px-4">
                          {calculateTotalTime(att.PunchIn, att.PunchOut)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No attendance records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
