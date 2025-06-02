import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import EmployeeSidebar from "../Component/EmpSide/EmployeeSidebar";
import Navbar from "../Component/Dashboard/Navbar";

const EmployeeSingleProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`https://employee-backend-q7hn.onrender.com/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setProject(data))
      .catch(console.error);
  }, [id, token]);

  useEffect(() => {
    axios
      .get("https://employee-backend-q7hn.onrender.com/api/employee", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployees(res.data?.Emp))
      .catch(console.error);
  }, [token]);

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading project details...
        </p>
      </div>
    );
  }

  const selectedUsers = employees?.filter((e) =>
    project?.assignedEmployees?.includes(e._id)
  );

  const start = new Date(project.startDate);
  const end = new Date(project.endDate);
  const totalDuration = (end - start) / (1000 * 60 * 60 * 24);
  const elapsedDuration = (new Date() - start) / (1000 * 60 * 60 * 24);
  const progress = Math.min((elapsedDuration / totalDuration) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-100 to-white">
      <Navbar />
      <div className="flex flex-1">
        <EmployeeSidebar />

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto mt-10 p-4 sm:p-8 bg-white rounded-xl shadow-lg">
            {/* Back Button */}
            <button
              onClick={() => navigate("/employee/my-project")}
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <FaArrowLeft /> Back to Projects
            </button>

            {/* Project Title */}
            <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-4">
              {project.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 text-center mb-6">
              {project.description || "No description provided."}
            </p>

            {/* Project Details & Assigned Employees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project Details */}
              <div className="space-y-4">
                <p className="text-lg">
                  <span className="font-semibold">📈 Status:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded text-white ${
                      project.status === "Completed"
                        ? "bg-green-600"
                        : project.status === "In Progress"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {project.status}
                  </span>
                </p>
                <p className="text-lg">
                  <span className="font-semibold">📅 Start Date:</span>{" "}
                  {start.toLocaleDateString()}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">📅 End Date:</span>{" "}
                  {end.toLocaleDateString()}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">🕒 Duration:</span>{" "}
                  {totalDuration > 0 ? `${totalDuration} days` : "N/A"}
                </p>

                {/* Progress Bar */}
                <div className="my-3">
                  <p className="text-sm text-gray-600 mb-1">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        progress === 100 ? "bg-green-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right text-gray-500 mt-1">{`${Math.round(
                    progress
                  )}%`}</p>
                </div>

                <p className="text-lg">
                  <span className="font-semibold">📚 Technologies:</span>{" "}
                  {project.technologies.length > 0
                    ? project.technologies.join(", ")
                    : "None specified"}
                </p>
              </div>

              {/* Assigned Employees */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  👥 Assigned Employees
                </h3>
                {selectedUsers?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedUsers.map((emp) => (
                      <div
                        key={emp._id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg shadow hover:shadow-md transition"
                      >
                        <img
                          src={`https://employee-backend-q7hn.onrender.com/${emp.Img}`}
                          alt={emp.emp_name}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div>
                          <p className="font-medium text-blue-800">
                            {emp.emp_name}
                          </p>
                          <p className="text-sm text-gray-600">{emp.Role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No employees assigned</p>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Created: {new Date(project.createdAt).toLocaleString()}</p>
              <p>
                Last Updated: {new Date(project.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSingleProjectDetail;
