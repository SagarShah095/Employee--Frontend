import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const handleEmployeesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setForm({ ...form, assignedEmployees: selected });
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

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-8 mt-10">
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
          <option>Planned</option>
          <option>In Progress</option>
          <option>Completed</option>
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
        <select
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
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;
