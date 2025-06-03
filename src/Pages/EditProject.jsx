import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../Component/Dashboard/AdminSidebar";
import Navbar from "../Component/Dashboard/Navbar";
import Select from "react-select";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "In Progress",
    startDate: "",
    endDate: "",
    technologies: [],
    assignedEmployees: [],
  });
  const url = "https://employee-backend-q7hn.onrender.com/api/projects";

  useEffect(() => {
    axios
      .get(`${url}/${id}`)
      .then(({ data }) => {
        setProject(data);
        setForm({
          title: data.title,
          description: data.description,
          status: data.status,
          startDate: data.startDate.slice(0, 10),
          endDate: data.endDate.slice(0, 10),
          technologies: data.technologies,
          assignedEmployees: data.assignedEmployees,
        });
      })
      .catch((err) => console.error("Error fetching project:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "technologies") {
      setForm({ ...form, [name]: value.split(",").map((tech) => tech.trim()) });
    } else if (name === "assignedEmployees") {
      setForm({ ...form, [name]: value.split(",").map((id) => id.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${url}/${id}`, form)
      .then(() => {
        alert("Project updated successfully!");
        navigate(`/admin-dashboard/project/${id}`);
      })
      .catch((err) => {
        console.error("Error updating project:", err);
        alert("Failed to update project");
      });
  };

  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    axios
      .get("https://employee-backend-q7hn.onrender.com/api/employee", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployees(res.data?.Emp))
      .catch(console.error);
  }, [token]);
  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: emp.emp_name,
  }));
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium animate-pulse">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Page Content */}
        <div className="flex justify-center p-8">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-md  p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
               Edit Project
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border px-3 py-2 rounded"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  name="technologies"
                  value={form.technologies.join(", ")}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* <div>
                <label className="block font-semibold">
                  Assigned Employees (IDs, comma separated)
                </label>
                <input
                  type="text"
                  name="assignedEmployees"
                  value={form.assignedEmployees.join(", ")}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div> */}
              <Select
                name="assignedEmployees"
                closeMenuOnSelect={false}
                options={employeeOptions}
                value={employeeOptions.filter((option) =>
                  form.assignedEmployees.includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  setForm((prev) => ({
                    ...prev,
                    assignedEmployees: selectedOptions.map(
                      (option) => option.value
                    ),
                  }))
                }
                isMulti
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded hover:from-blue-700 hover:to-blue-800 transition"
              >
                💾 Save Changes
              </button>
            </form>

            <button
              onClick={() => navigate(`/admin-dashboard/project/${id}`)}
              className="mt-4 w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
            >
              🔙 Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
