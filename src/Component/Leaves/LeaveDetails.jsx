import React, { useEffect } from "react";
import Navbar from "../Dashboard/Navbar";
import AdminSidebar from "../Dashboard/AdminSidebar";
import axios from "axios";
import { useParams } from "react-router-dom";

const LeaveDetails = () => {
  const [leaveData, setLeaveData] = React.useState([]);

  const { id } = useParams();

  console.log("Leave Data:", leaveData);

  const fetchdata = async () => {
    try {
      const response = await axios.get(
        `https://employee-backend-q7hn.onrender.com/api/leave/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response?.data?.success) {
        setLeaveData(response.data.data);
      } else {
        alert("Failed to fetch leave data. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div>
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gray-100 min-h-screen">
          <div className="w-full">
            <Navbar />
          </div>
          <div className="max-w-xl mx-auto mt-8 px-4">
            <div>
              <h3 className="text-3xl font-bold text-center text-teal-700 mb-6">
                Leave Details
              </h3>
              <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
                <div className="space-y-4 text-gray-800 text-base">
                  <div className="flex justify-between">
                    <span className="font-semibold">Employee ID:</span>
                    <span>{leaveData.empId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Employee Name:</span>
                    <span>{leaveData.emp_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Leave Type:</span>
                    <span>{leaveData.leavetype}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">From Date:</span>
                    <span>
                      {leaveData.toDate
                        ? new Date(leaveData.fromDate).toISOString().split("T")[0]
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">To Date:</span>
                    <span>
                      {leaveData.toDate
                        ? new Date(leaveData.toDate).toISOString().split("T")[0]
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        leaveData.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : leaveData.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {leaveData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;
