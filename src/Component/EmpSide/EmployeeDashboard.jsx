import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";
import axios from "axios";
import { useAuth } from "../../Context/authContext";
import Loader from "../Loader";
import TourManager from "../../shared/TourManager";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const url = "https://employee-backend-q7hn.onrender.com";
  const [employeeData, setEmployeeData] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState({});

  useEffect(() => {
    const fetchSalaryData = async () => {
      if (!user?.emp_id) return;

      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/salary`);
        if (response.data.success) {
          const matchedSalary = response.data.data.find(
            (sal) => sal.mainEmpId === user.emp_id
          );
          console.log(matchedSalary);
          setSalary(matchedSalary || {});
          setLoading(false);
        } else {
          console.log("Salary Error in Dashboard");
          setLoading(false);
        }
      } catch (error) {
        console.log("Error fetching salary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const empRes = await axios.get(`${url}/api/employee`);
        if (empRes.data.success) {
          const empList = empRes?.data?.Emp;
          const matchedEmp = empList.find(
            (emp) => emp?.emp_id === user?.emp_id
          );
          setEmployeeData(matchedEmp || {});
          setLoading(false);
        }

        const attRes = await axios.get(`${url}/api/punch`);
        if (attRes.data.success) {
          const punchData = Array.isArray(attRes?.data?.data)
            ? attRes?.data?.data
            : [attRes?.data?.data];

          const filtered = punchData.filter(
            (item) => item.emp_id === user.emp_id
          );

          const sorted = [...filtered].sort(
            (a, b) => new Date(b.PunchIn) - new Date(a.PunchIn)
          );
          setAttendanceData(sorted);
          setLoading(false);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (user?.emp_id) {
      fetchDashboardData();
    }
  }, [user]);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const calculateTotalTime = (inTime, outTime, lunchStart, lunchEnd) => {
    if (!inTime || !outTime) return "--";

    const inDate = new Date(inTime);
    const outDate = new Date(outTime);

    if (outDate < inDate) return "--";

    let totalDiff = outDate - inDate;

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

    const hrs = Math.floor(totalDiff / 3600000);
    const mins = Math.round((totalDiff % 3600000) / 60000);

    return `${hrs}h ${mins}m`;
  };

  const steps = [
    {
      id: "page1-step",
      text: "Welcome to Dashboard, here you can check your data and attendace . Click next to go to profile page.",
      attachTo: { element: ".page1-next-btn", on: "bottom" },
      nextRoute: "/employee/profile",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-100 ">
      {!loading && <TourManager steps={steps} pageKey="page1" />}

      <Navbar />
      <div className="flex ">
        <EmployeeSidebar />
        <div className="w-full p-6 ">
          {loading && <Loader />}
          <div className=" bg-white rounded-lg shadow-md p-6 mb-6 page1-next-btn">
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
                <p>
                  <strong>Employee ID:</strong> {employeeData?.emp_id}
                </p>
                <p>
                  <strong>Department:</strong> {employeeData?.Dept}
                </p>
                <p>
                  <strong>Gender:</strong> {employeeData?.Gen}
                </p>
                <p>
                  <strong>DOB:</strong> {formatDate(employeeData?.dob)}
                </p>
                <p>
                  <strong>Salary:</strong>{" "}
                  {salary?.totalSalary ? `₹${salary.totalSalary}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Latest Attendance</h3>
            {attendanceData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr className="text-gray-700">
                      <th className="py-2 px-4 border">Date</th>
                      <th className="py-2 px-4 border">Punch In</th>
                      <th className="py-2 px-4 border">Launch Start</th>
                      <th className="py-2 px-4 border">Launch End</th>
                      <th className="py-2 px-4 border">Punch Out</th>
                      <th className="py-2 px-4 border">Total Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.slice(0, 10).map((att, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4">{formatDate(att.PunchIn)}</td>
                        <td className="py-2 px-4">{formatTime(att.PunchIn)}</td>
                        <td className="py-2 px-4">
                          {formatTime(att.LunchStart)}
                        </td>
                        <td className="py-2 px-4">
                          {formatTime(att.LunchEnd)}
                        </td>
                        <td className="py-2 px-4">
                          {formatTime(att.PunchOut)}
                        </td>
                        <td className="py-2 px-4">
                          {calculateTotalTime(
                            att.PunchIn,
                            att.PunchOut,
                            att.LunchStart,
                            att.LunchEnd
                          )}
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
