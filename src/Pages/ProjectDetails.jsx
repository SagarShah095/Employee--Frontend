import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaClock,
  FaCalendarAlt,
  FaCode,
  FaEdit,
  FaArrowLeft,
} from "react-icons/fa";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const url = "http://localhost:4000/api/projects";
  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios
      .get(`${url}/${id}`)
      .then(({ data }) => setProject(data))
      .catch((err) => console.error("Error fetching project:", err));
  }, [id]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/employee", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployees(res.data?.Emp))
      .catch(console.error);
  }, [token]);

  const selectedUsers = employees?.filter((e) =>
    project?.assignedEmployees?.includes(e._id)
  );

  const handleUpdate = () => navigate(`/admin-dashboard/project/edit/${id}`);
  const handleBack = () => navigate("/admin-dashboard/project");

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium animate-pulse">
          Loading project details...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded hover:from-gray-500 hover:to-gray-600 transition"
      >
        <FaArrowLeft /> Back to Projects
      </button>

      <h2 className="text-4xl font-bold text-center text-blue-600 mb-6">
        {project.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-lg mb-2">
            <FaClock className="inline mr-2 text-blue-500" />
            <span className="font-semibold">Description:</span>{" "}
            {project.description}
          </p>
          <p className="text-lg mb-2">
            <FaUserTie className="inline mr-2 text-green-500" />
            <span className="font-semibold">Status:</span>{" "}
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
          <p className="text-lg mb-2">
            <FaCalendarAlt className="inline mr-2 text-purple-500" />
            <span className="font-semibold">Start Date:</span>{" "}
            {new Date(project.startDate).toLocaleDateString()}
          </p>
          <p className="text-lg mb-2">
            <FaCalendarAlt className="inline mr-2 text-purple-500" />
            <span className="font-semibold">End Date:</span>{" "}
            {new Date(project.endDate).toLocaleDateString()}
          </p>
          <p className="text-lg mb-2">
            <FaCode className="inline mr-2 text-pink-500" />
            <span className="font-semibold">Technologies:</span>{" "}
            <span className="italic">{project.technologies.join(", ")}</span>
          </p>
          <p className="text-lg mb-2">
            <FaClock className="inline mr-2 text-yellow-600" />
            <span className="font-semibold">Duration:</span>{" "}
            {(() => {
              const start = new Date(project.startDate);
              const end = new Date(project.endDate);
              const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
              return duration > 0 ? `${duration} days` : "N/A";
            })()}
          </p>
        </div>

        <div>
          <p className="text-lg font-semibold mb-2">👥 Assigned Employees:</p>
          {selectedUsers?.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {selectedUsers.map((emp) => (
                <div
                  key={emp._id}
                  className="flex items-center gap-4 bg-gray-100 p-2 rounded shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={`http://localhost:4000/${emp.Img}`}
                    alt={emp.emp_name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-medium">{emp.emp_name}</p>
                    <p className="text-sm text-gray-500">{emp.Role}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No employees assigned</p>
          )}

          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold">🕑 Created At:</span>{" "}
            {new Date(project.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">📝 Updated At:</span>{" "}
            {new Date(project.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <button
        onClick={handleUpdate}
        className="mt-8 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded shadow-lg hover:from-blue-700 hover:to-blue-800 transition"
      >
        <FaEdit /> Edit Project
      </button>
    </div>
  );
};

export default ProjectDetail;
