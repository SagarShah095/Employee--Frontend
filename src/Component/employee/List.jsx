import React, { useEffect, useState } from "react";
import AdminSidebar from "../Dashboard/AdminSidebar";
import Navbar from "../Dashboard/Navbar";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";

const List = () => {
  const { id } = useParams();

  const url = "https://employee-backend-q7hn.onrender.com";

  const [empData, setEmpData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [toast, setToast] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setEmpData(response.data.Emp);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${url}/api/employee/${selectedEmpId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setToast("Employee deleted successfully.");
        setShowToast(true);
        setEmpData(empData.filter((emp) => emp._id !== selectedEmpId));
        setShowModal(false);

        // Auto-hide the toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000);
      } else {
        alert("Failed to delete employee.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("An error occurred while deleting the employee.");
    }
  };

  return (
    <div className="relative">
            {/* {loading && <Loader />} */}
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gray-100">
          <div className="w-full">
            <Navbar />
          </div>
          <div className="p-5">
            <div className="text-center">
              <h3 className="text-2xl font-bold">Manage Employee</h3>
            </div>
            <div className="flex justify-end items-center">
              {/* <input
                type="text"
                placeholder="Search By Dep Name/"
                className="px-4 py-0.5 border"
              /> */}
              <Link
                to="/admin-dashboard/add-employee"
                className="px-4 py-1 bg-teal-600 text-white rounded"
              >
                Add New Employee
              </Link>
            </div>
          </div>
          <div className="p-5">
            <div className="relative overflow-x-auto rounded-lg">
              <table className="w-full text-sm text-left text-gray-700 shadow-md rounded-lg overflow-hidden">
  <thead className="text-xs uppercase bg-gray-100 border-b">
    <tr>
      <th className="px-6 py-4 font-semibold">S No</th>
      <th className="px-6 py-4 font-semibold">Image</th>
      <th className="px-6 py-4 font-semibold">Name</th>
      <th className="px-6 py-4 font-semibold">DOB</th>
      <th className="px-6 py-4 font-semibold">Department</th>
      <th className="px-6 py-4 font-semibold text-center">Action</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      Array.from({ length: 6 }).map((_, index) => (
        <tr key={index} className="border-t">
          {[24, 16, 16, 20, 16].map((width, colIndex) => (
            <td key={colIndex} className="py-4 px-6">
              <div
                className={`h-4 bg-gray-300 rounded w-${width} animate-pulse`}
              ></div>
            </td>
          ))}
        </tr>
      ))
    ) : (
      empData?.map((emp, i) => (
        <tr
          key={i}
          className="bg-white border-b hover:bg-gray-50 transition-all duration-200"
        >
          <td className="px-6 py-4 font-medium">{i + 1}</td>
          <td className="px-6 py-4">
            <img
              src={`${url}/${emp.Img}`}
              alt={emp.emp_name}
              className="w-12 h-12 rounded-full object-cover border"
            />
          </td>
          <td className="px-6 py-4">{emp.emp_name}</td>
          <td className="px-6 py-4">
            {emp.dob
              ? new Date(emp.dob).toLocaleDateString("en-GB")
              : ""}
          </td>
          <td className="px-6 py-4">{emp.Dept}</td>
          <td className="px-6 py-4 flex gap-2 flex-wrap justify-center">
            <button
              onClick={() =>
                navigate(`/admin-dashboard/employee/${emp._id}`)
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
            >
              View
            </button>
            <NavLink
              to={`/admin-dashboard/employee/edit/${emp._id}`}
              className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Edit
            </NavLink>
            <NavLink
              to={`/admin-dashboard/employee/salary/${emp._id}`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Salary
            </NavLink>
            <NavLink
              to={`/admin-dashboard/employee/leave/${emp._id}`}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Leave
            </NavLink>
            <button
              onClick={() => {
                setSelectedEmpId(emp._id);
                setShowModal(true);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Delete
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

            </div>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-2">Confirm Delete</h2>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete this employee? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showToast && (
          <div className="fixed top-24 right-5 z-50 transition-transform duration-500 ease-out transform animate-slide-in">
            <div
              id="toast-success"
              className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
              role="alert"
            >
              <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
              </div>
              <div className="ms-3 text-sm font-normal">{toast}</div>
              <button
                onClick={() => setShowToast(false)}
                className="ms-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-white"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
