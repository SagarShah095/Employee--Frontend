import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../Component/Dashboard/AdminSidebar";
import Navbar from "../Component/Dashboard/Navbar";
import Loader from "../Component/Loader";
import DeleteConfirmationModal from "../shared/DeleteConfirmation";
import "react-toastify/dist/ReactToastify.css";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const url = "http://https://employee-backend-q7hn.onrender.com";

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(`${url}/api/projects`);
      setProjects(data.data);
      console.log(data?.data, "Fetched Projects");
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Delete Confirmation
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${url}/api/projects/${deleteId}`);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setShowModal(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex">
      <ToastContainer position="top-right" autoClose={2500} />
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <DeleteConfirmationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirmDelete}
            title="Are you sure Want to delete this ?"
          />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">📋 Project List</h2>
            <Link
              to="/admin-dashboard/project/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              ➕ New Project
            </Link>
          </div>

          {/* Project Table */}
          {projects.length === 0 ? (
            <p className="text-lg">No projects available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-blue-100 text-left">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Start Date</th>
                    <th className="py-3 px-4">End Date</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-medium">{project.title}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            project.status === "Completed"
                              ? "bg-green-600"
                              : project.status === "In Progress"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {new Date(project.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">
                        {new Date(project.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 space-x-2">
                        <Link
                          to={`/admin-dashboard/project/${project._id}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin-dashboard/project/edit/${project._id}`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => confirmDelete(project._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Project;
