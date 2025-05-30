import React, { useEffect, useState } from "react";
import AdminSidebar from "../Dashboard/AdminSidebar";
import Navbar from "../Dashboard/Navbar";
import axios from "axios";
import Loader from "../Loader";

const LeaveView = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [rejectedLeaves, setRejectedLeaves] = useState([]);
  const [viewType, setViewType] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://employee-backend-q7hn.onrender.com/api/leave/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response?.data?.success) {
          const approved = response.data.data.filter(
            (leave) => leave.status === "Approved"
          );
          const rejected = response.data.data.filter(
            (leave) => leave.status === "Rejected"
          );
          const pending = response.data.data.filter(
            (leave) =>
              leave.status !== "Approved" && leave.status !== "Rejected"
          );

          setApprovedLeaves(approved);
          setRejectedLeaves(rejected);
          setLeaveData(pending);
        } else {
          alert("Failed to fetch leave data. Please try again.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
      setLoading(false);
    };
    fetchLeaveData();
  }, []);

  const handleApprove = async (id) => {
    setLoading(true);

    try {
      const res = await axios.put(
        `https://employee-backend-q7hn.onrender.com/api/leave/${id}`,
        { status: "Approved" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res?.data?.success) {
        const approvedLeave = leaveData.find((leave) => leave._id === id);
        const updatedLeave = { ...approvedLeave, status: "Approved" };

        setApprovedLeaves((prev) => [...prev, updatedLeave]);
        setLeaveData((prev) => prev.filter((leave) => leave._id !== id));
      } else {
        alert("Failed to approve leave.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error approving leave:", error);
      alert("Error approving leave.");
    }
    setLoading(false);
  };

  const handleReject = async (id) => {
    setLoading(true);
    try {
      const res = await axios.put(
        `https://employee-backend-q7hn.onrender.com/api/leave/${id}`,
        { status: "Rejected" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res?.data?.success) {
        const rejectedLeave = leaveData.find((leave) => leave._id === id);
        const updatedLeave = { ...rejectedLeave, status: "Rejected" };

        setRejectedLeaves((prev) => [...prev, updatedLeave]);
        setLeaveData((prev) => prev.filter((leave) => leave._id !== id));
      } else {
        alert("Failed to reject leave.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error rejecting leave:", error);
      alert("Error rejecting leave.");
    }
    setLoading(false);
  };

  const getDataToShow = () => {
    if (viewType === "approved") return approvedLeaves;
    if (viewType === "rejected") return rejectedLeaves;
    return leaveData;
  };

  return (
    <div>
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gray-100 min-h-screen">
          <Navbar />

          <div className="flex justify-center items-center mt-4">
            <h1 className="font-semibold text-xl">Manage Leaves</h1>
          </div>

          {loading && <Loader />}
          {/* Filter Buttons */}
          <div className="flex justify-between items-center p-4">
            <input
              type="text"
              placeholder="Search by Emp ID"
              className="p-1 border border-gray-400 rounded-md focus:outline-none"
            />
            <div className="gap-6 flex items-center">
              <button
                className={`px-6 py-1 rounded-md text-white ${
                  viewType === "pending" ? "bg-teal-700" : "bg-teal-600"
                }`}
                onClick={() => setViewType("pending")}
              >
                View Pending
              </button>
              <button
                className={`px-6 py-1 rounded-md text-white ${
                  viewType === "approved" ? "bg-teal-700" : "bg-teal-600"
                }`}
                onClick={() => setViewType("approved")}
              >
                View Approved
              </button>
              <button
                className={`px-6 py-1 rounded-md text-white ${
                  viewType === "rejected" ? "bg-teal-700" : "bg-teal-600"
                }`}
                onClick={() => setViewType("rejected")}
              >
                View Rejected
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-left text-sm">
                    <th className="px-4 py-2">Emp ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Leave Type</th>
                    <th className="px-4 py-2">From</th>
                    <th className="px-4 py-2">To</th>
                    <th className="px-4 py-2">Status</th>
                    {viewType === "pending" && (
                      <th className="px-4 py-2">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {getDataToShow().map((data, i) => (
                    <tr className="border-t" key={i}>
                      <td className="px-4 py-2">{data.empId}</td>
                      <td className="px-4 py-2">{data.emp_name}</td>
                      <td className="px-4 py-2">{data.leavetype}</td>
                      <td className="px-4 py-2">
                        {new Date(data.fromDate).toISOString().split("T")[0]}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(data.toDate).toISOString().split("T")[0]}
                      </td>
                      <td
                        className={`px-4 py-2 ${
                          data.status === "Approved"
                            ? "text-green-600"
                            : data.status === "Rejected"
                            ? "text-red-500"
                            : "text-yellow-600"
                        }`}
                      >
                        {data.status}
                      </td>
                      {viewType === "pending" && (
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleApprove(data._id)}
                            className="bg-green-500 text-white px-2 py-1 rounded mr-2 text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(data._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Reject
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {getDataToShow().length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center text-gray-500 py-4"
                      >
                        No leave records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveView;
