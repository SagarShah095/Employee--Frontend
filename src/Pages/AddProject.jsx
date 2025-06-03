import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Component/Dashboard/Navbar";
import AdminSidebar from "../Component/Dashboard/AdminSidebar";
import Select from "react-select";

const AddProject = () => {
  const url = "https://employee-backend-q7hn.onrender.com/api/projects";
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
      .get("https://employee-backend-q7hn.onrender.com/api/employee", {
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
              <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="flex gap-4">
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
                <input
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <input
                name="technologies"
                placeholder="Technologies (comma-separated)"
                value={form.technologies}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
              {/* <select
                multiple
                name="assignedEmployees"
                value={form.assignedEmployees}
                onChange={handleEmployeesChange}
                className="w-full border rounded p-2"
              >
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.emp_name}
                  </option>
                ))}
              </select> */}
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
                defaultValue={""}
                isMulti
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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
