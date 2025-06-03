import React, { useEffect, useState } from "react";
import AdminSidebar from "../Dashboard/AdminSidebar";
import Navbar from "../Dashboard/Navbar";
import axios from "axios";
import Loader from "../Loader";
import * as XLSX from "xlsx";
import ConfirmationModal from "../../shared/DeleteConfirmation";

const LeaveView = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [rejectedLeaves, setRejectedLeaves] = useState([]);
  const [viewType, setViewType] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [modalAction, setModalAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [deleteId, setDeleteId] = useState(null);

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
    let data =
      viewType === "approved"
        ? approvedLeaves
        : viewType === "rejected"
        ? rejectedLeaves
        : leaveData;

    if (filterStartDate) {
      data = data.filter(
        (leave) => new Date(leave.fromDate) >= new Date(filterStartDate)
      );
    }
    if (filterEndDate) {
      data = data.filter(
        (leave) => new Date(leave.toDate) <= new Date(filterEndDate)
      );
    }
    return data;
  };

  const prepareExportData = () => {
    const data = getDataToShow().map((row) => ({
      "Emp ID": row.empId || "-",
      Name: row.emp_name || "-",
      "Leave Type": row.leavetype || "-",
      "From Date": new Date(row.fromDate).toISOString().split("T")[0],
      "To Date": new Date(row.fromDate).toISOString().split("T")[0],
      Description: row?.desc || "-",
      Status: row.status || "-",
    }));
    return data;
  };

  const handleExcelExport = () => {
    const exportData = prepareExportData();

    if (exportData.length === 0) {
      alert("No data to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leaves");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `Leave_Report_${viewType}.xlsx`);
  };

  const handleModalConfirm = () => {
    if (modalAction === "approve") {
      handleApprove(deleteId);
    } else if (modalAction === "reject") {
      handleReject(deleteId);
    }
    setShowModal(false);
  };

  const confirmDelete = (id, action) => {
    setDeleteId(id);
    setModalAction(action); // Set "approve" or "reject"
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
          <Navbar />

          <div className="flex justify-center items-center mt-4">
            <h1 className="font-bold text-2xl text-teal-700 shadow-sm">
              Manage Leaves
            </h1>
          </div>

          {loading && <Loader />}
          <ConfirmationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleModalConfirm}
            title={`Confirm ${
              modalAction === "approve" ? "Approval" : "Rejection"
            }`}
            message={`Are you sure you want to ${modalAction} this leave?`}
            confirmLabel={modalAction === "approve" ? "Approve" : "Reject"}
          />
          {/* 🔥 Date filter inputs */}
          <div className="flex justify-between items-center p-4">
            <div className="flex gap-4 items-center">
              <label className="text-sm">From:</label>
              <input
                type="date"
                value={filterStartDate}
                // max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md shadow-sm hover:border-teal-500 transition"
              />
              <label className="text-sm">To:</label>
              <input
                type="date"
                value={filterEndDate}
                // max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md shadow-sm hover:border-teal-500 transition"
              />
              <button
                onClick={() => {
                  setFilterStartDate("");
                  setFilterEndDate("");
                }}
                className="px-3 py-2 border bg-gray-400 hover:bg-gray-500 text-white rounded-md transition"
              >
                Reset Dates
              </button>
            </div>

            {/* 🔥 ViewType Buttons */}
            <div className="gap-4 flex items-center">
              <button
                className={`px-6 py-2 rounded-full text-white font-medium ${
                  viewType === "pending"
                    ? "bg-teal-700 shadow-md"
                    : "bg-teal-600 hover:bg-teal-700"
                } transition`}
                onClick={() => setViewType("pending")}
              >
                Pending
              </button>
              <button
                className={`px-6 py-2 rounded-full text-white font-medium ${
                  viewType === "approved"
                    ? "bg-teal-700 shadow-md"
                    : "bg-teal-600 hover:bg-teal-700"
                } transition`}
                onClick={() => setViewType("approved")}
              >
                Approved
              </button>
              <button
                className={`px-6 py-2 rounded-full text-white font-medium ${
                  viewType === "rejected"
                    ? "bg-teal-700 shadow-md"
                    : "bg-teal-600 hover:bg-teal-700"
                } transition`}
                onClick={() => setViewType("rejected")}
              >
                Rejected
              </button>

              <button
                onClick={handleExcelExport}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition shadow-md"
              >
                📤 Export to Excel
              </button>
            </div>
          </div>

          {/* 🔥 Table */}
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                <thead>
                  <tr className="bg-teal-600 text-white text-left text-sm">
                    <th className="px-4 py-2">Emp ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Leave Type</th>
                    <th className="px-4 py-2">From</th>
                    <th className="px-4 py-2">To</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Status</th>
                    {viewType === "pending" && (
                      <th className="px-4 py-2">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {getDataToShow().map((data, i) => (
                    <tr
                      key={i}
                      className="border-t hover:bg-teal-50 transition"
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        {data.empId}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {data.emp_name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {data.leavetype}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {new Date(data.fromDate).toISOString().split("T")[0]}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {new Date(data.toDate).toISOString().split("T")[0]}
                      </td>
                      <td className="px-4 py-2 ">{data.desc}</td>
                      <td
                        className={`px-4 py-2 whitespace-nowrap ${
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
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button
                            onClick={() => confirmDelete(data._id, "approve")}
                            className="bg-green-500 text-white px-2 py-1 rounded-full mr-2 text-xs hover:bg-green-600 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => confirmDelete(data._id, "reject")}
                            className="bg-red-500 text-white px-2 py-1 rounded-full text-xs hover:bg-red-600 transition"
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
