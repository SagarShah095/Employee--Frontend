import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Dashboard/Navbar";
import AdminSidebar from "../Dashboard/AdminSidebar";
import axios from "axios";
import Loader from "../Loader";

const AddDipartment = () => {
  const url = "https://employee-backend-q7hn.onrender.com";

  const [loading, setLoading] = useState(false);

  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });


  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/department/add`,
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/departments");
        setDepartment({
          dep_name: "",
          description: "",
        });
      }
      setLoading(false);
    } catch (error) {
      if (error.response && !error.response.data.sucess) {
        console.error(error.response.data.error || "Error adding department");
      }
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="flex">
      {loading && <Loader />}

        <AdminSidebar />
        <div className="w-full bg-gray-100 ">
          <div className="w-full">
            <Navbar />
          </div>
          {/* add */}
          <div className="max-w-md mx-auto mt-36 p-6 bg-white shadow-md  rounded-lg">
            <div>
              <h3 className="text-2xl  font-semibold text-black mb-6">
                Add New Department
              </h3>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="dep_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Department Name
                  </label>
                  <input
                    type="text"
                    id="dep_name"
                    value={department.dep_name}
                    name="dep_name"
                    placeholder="Enter Dep Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={department.description}
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Add Department
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDipartment;
