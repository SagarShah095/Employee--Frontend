import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Component/Dashboard/Navbar";
import AdminSidebar from "../Component/Dashboard/AdminSidebar";
import Select from "react-select";

const AddProject = () => {
  const url = "http://localhost:4000/api/projects";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Planned",
    startDate: "",
    endDate: "",
    technologies: "",
    assignedEmployees: [],
  });

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/employee", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployees(res.data?.Emp))
      .catch(console.error);
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        url,
        {
          ...form,
          technologies: form.technologies.split(",").map((t) => t.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/admin-dashboard/project");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: emp.emp_name,
  }));
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Page Content */}
        <div className="flex justify-center p-8">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-md  p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Create New Project
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  name="title"
                  placeholder="Enter project title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter project description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies
                </label>
                <input
                  name="technologies"
                  placeholder="Technologies (comma-separated, e.g. React, Node, MongoDB)"
                  value={form.technologies}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Employees
                </label>
                <Select
                  name="assignedEmployees"
                  closeMenuOnSelect={false}
                  options={employeeOptions}
                  noOptionsMessage={() => "No employees available"}
                  value={employeeOptions.filter((option) =>
                    form.assignedEmployees.includes(option.value)
                  )}
                  onChange={(selectedOptions) =>
                    setForm((prev) => ({
                      ...prev,
                      assignedEmployees: selectedOptions
                        ? selectedOptions.map((option) => option.value)
                        : [],
                    }))
                  }
                  defaultValue={""}
                  isMulti
                  placeholder="Select employees to assign..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-md hover:bg-blue-700 transition duration-200 mt-2"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
