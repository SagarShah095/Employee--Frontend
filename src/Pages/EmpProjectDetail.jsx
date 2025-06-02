import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import EmployeeSidebar from "../Component/EmpSide/EmployeeSidebar";
import Navbar from "../Component/Dashboard/Navbar";

const EmployeeProjectDetail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const myProjects = data.data?.filter((p) =>
          p.assignedEmployees.includes(user?._id)
        );
        setProjects(myProjects);
      })
      .catch(console.error);
  }, [token, user]);

  if (!projects || projects.length === 0) {
    return (
      <p className="text-center mt-10 text-lg font-semibold text-gray-500">
        No projects assigned to you.
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-100 to-white">
      <Navbar />
      <div className="flex flex-1">
        <EmployeeSidebar />

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-8 bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-lg">
            {/* <button
              onClick={() => navigate("/employee-dashboard")}
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded hover:from-gray-600 hover:to-gray-800 transition"
            >
              <FaArrowLeft /> Back to Dashboard
            </button> */}

            <h2 className="text-4xl font-bold text-center text-blue-600 mb-8">
              🚀 My Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => {
                const start = new Date(project.startDate);
                const end = new Date(project.endDate);
                const today = new Date();
                const totalDuration = (end - start) / (1000 * 60 * 60 * 24);
                const elapsedDuration = (today - start) / (1000 * 60 * 60 * 24);
                const progress = Math.min(
                  (elapsedDuration / totalDuration) * 100,
                  100
                );

                return (
                  <div
                    key={project._id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300 ease-in-out"
                  >
                    <h3
                      className="text-2xl font-bold text-blue-500 cursor-pointer hover:underline mb-2"
                      onClick={() =>
                        navigate(`/employee/my-project/${project._id}`)
                      }
                    >
                      {project.title}
                    </h3>

                    <p className="text-gray-700 mb-2">
                      {project.description?.length > 110
                        ? `${project.description?.slice(0, 110)}..`
                        : project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 my-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <p className="mb-1">
                      <strong>Status:</strong>{" "}
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
                    <p>
                      <strong>📅 Duration:</strong> {start.toLocaleDateString()}{" "}
                      - {end.toLocaleDateString()}
                    </p>

                    {/* Optional: Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-3">
                      <div
                        className={`h-2.5 rounded-full ${
                          progress === 100 ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <p className="text-sm text-gray-500">
                      Created: {new Date(project.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Updated: {new Date(project.updatedAt).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProjectDetail;
