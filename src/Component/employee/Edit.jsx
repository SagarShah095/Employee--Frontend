import React, { useEffect, useState } from "react";
import AdminSidebar from "../Dashboard/AdminSidebar";
import Navbar from "../Dashboard/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";

const Edit = () => {

  const url = "http://localhost:4000";

  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const [edit, setEdit] = useState({
    emp_name: "",
    Mrd: "",
    Des: "",
    Dept: "",
    Salary: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${url}/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setEdit(response.data.emp);
        }
        setLoading(false);
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error || "Error fetching employee data");
        }
      }
      setLoading(false);

    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${url}/api/employee/${id}`,
        edit,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("Employee updated successfully");
        navigate("/admin-dashboard/employees");
      } else {
        alert("Failed to update employee");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error occurred: in Edit", error);
      if (error.response) {
        alert(error.response.data.error || "Error updating employee");
      } else {
        alert("An error occurred while updating the employee");
      }
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gray-100">
          <div className="w-full">
            <Navbar />
          </div>
          <div className=" m-10 p-5 rounded-md shadow-lg bg-white">
      {loading && <Loader />}
            <form onSubmit={handleSubmit}>
              <div>
                <h1 className="text-2xl font-bold">Edit Employee</h1>
              </div>
              <div className="grid grid-cols-2 gap-5 mt-5">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Name</label>
                  <input
                    type="text"
                    name="emp_name"
                    placeholder="Name"
                    onChange={handleChange}
                    value={edit.emp_name}
                    className="border h-10 pl-2 text-lg border-gray-500 focus:outline-none rounded-[4px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Marital Status</label>
                  <select
                    name="Mrd"
                    className="border h-10 pl-2 text-lg border-gray-500 focus:outline-none rounded-[4px]"
                    onChange={handleChange}
                    value={edit.Mrd}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Designation</label>
                  <input
                    type="text"
                    name="Des"
                    placeholder="Designation"
                    className="border h-10 pl-2 text-lg border-gray-500 focus:outline-none rounded-[4px]"
                    onChange={handleChange}
                    value={edit.Des}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Salary</label>
                  <input
                    type="text"
                    name="Salary"
                    placeholder="Salary"
                    className="border h-10 pl-2 text-lg border-gray-500 focus:outline-none rounded-[4px]"
                    onChange={handleChange}
                    value={edit.Salary}
                  />
                </div>
              </div>
              <div className="flex flex-col mt-7 gap-1">
                <label className="font-semibold">Department</label>
                <select
                  name="Dept"
                  className="border h-10 pl-2 text-lg border-gray-500 focus:outline-none rounded-[4px]"
                  onChange={handleChange}
                  value={edit.Dept}
                >
                  <option value="Select Department" selected disabled>
                    Select Department
                  </option>
                  <option value="IT">IT</option>
                  <option value="Database">Database</option>
                  <option value="Meal">Meal</option>
                  <option value="Logistic">Logistic</option>
                </select>
                <div className="flex flex-col w-full mt-4">
                  <button
                    type="submit"
                    className="bg-teal-600 rounded-sm p-2 text-white font-semibold text-lg"
                    onClick={() => navigate("/admin-dashboard/employees")}
                  >
                    Edit Employee
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
