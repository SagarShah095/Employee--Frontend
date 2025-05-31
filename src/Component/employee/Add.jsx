import React, { useState } from "react";
import AdminSidebar from "../Dashboard/AdminSidebar";
import Navbar from "../Dashboard/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = ({ addEmp, setAddEmp }) => {
  const [loading, setLoading] = useState(false);
  const url = "http://localhost:4000";
  const navigate = useNavigate();

  const fieldLabels = {
    emp_name: "Name",
    email: "Email",
    emp_id: "Employee ID",
    dob: "Date of Birth",
    Gen: "Gender",
    Mrd: "Marital Status",
    Des: "Designation",
    Dept: "Department",
    Salary: "Salary",
    Pass: "Password",
    Role: "Role",
    Img: "Image",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "emp_name",
      "email",
      "emp_id",
      "dob",
      "Gen",
      "Mrd",
      "Des",
      "Dept",
      "Salary",
      "Pass",
      "Role",
      "Img",
    ];

    for (const field of requiredFields) {
      if (
        !addEmp[field] ||
        (typeof addEmp[field] === "string" && addEmp[field].trim() === "")
      ) {
        toast.error(`Please fill in the ${fieldLabels[field] || field} field.`);
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in addEmp) {
        formData.append(key, addEmp[key]);
      }

      const response = await axios.post(`${url}/api/employee/add`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Employee added successfully!");
        navigate("/admin-dashboard/employees");
        setAddEmp({
          emp_name: "",
          email: "",
          emp_id: "",
          dob: "",
          Gen: "",
          Mrd: "",
          Des: "",
          Dept: "",
          Salary: "",
          Pass: "",
          Role: "",
          Img: "",
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "Img") {
      setAddEmp({ ...addEmp, [name]: files[0] });
    } else {
      setAddEmp({ ...addEmp, [name]: value });
    }
  };

  return (
    <div>
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gray-100">
          <div className="w-full">
            <Navbar />
          </div>
          <div className="p-10">
      {loading && <Loader />}
            <div className="w-full p-6 bg-white shadow-md  rounded-lg">
              <h1 className="text-2xl font-bold">Add New Employee</h1>
              <form onSubmit={handleSubmit}>
                <div className="mt-8 ">
                  <div className="grid grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="flex w-full flex-col">
                      <label className="font-medium text-lg">Name</label>
                      <input
                        type="text"
                        value={addEmp.emp_name}
                        name="emp_name"
                        placeholder="Insert Name"
                        onChange={handleChange}
                        className="pl-3 focus:outline-none py-2 text-lg mt-1 rounded-md border-2 border-gray-300"
                      />
                    </div>
                    {/* Email */}
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-lg">Email</label>
                      <input
                        type="email"
                        value={addEmp.email}
                        name="email"
                        onChange={handleChange}
                        placeholder="Insert Email"
                        className="pl-3 focus:outline-none py-2 mt-1 text-lg rounded-md border-2 border-gray-300"
                      />
                    </div>
                    {/* Employee ID */}
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-lg">Employee ID</label>
                      <input
                        type="text"
                        value={addEmp.emp_id}
                        name="emp_id"
                        onChange={handleChange}
                        placeholder="Employee ID"
                        className="pl-3 focus:outline-none py-2 mt-1 text-lg rounded-md border-2 border-gray-300"
                      />
                    </div>
                    {/* DOB */}
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-lg">Date Of Birth</label>
                      <input
                        type="date"
                        value={addEmp.dob}
                        name="dob"
                        onChange={handleChange}
                        className="pl-3 focus:outline-none py-2 mt-1 text-lg rounded-md border-2 border-gray-300"
                      />
                    </div>
                    {/* Gender */}
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-lg">Gender</label>
                      <select
                        value={addEmp.Gen}
                        onChange={handleChange}
                        name="Gen"
                        className="pl-3 focus:outline-none py-2 mt-1 text-lg rounded-md border-2 border-gray-300"
                      >
                        <option disabled value="">
                          Select Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    {/* Marital Status */}
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-lg">Married Status</label>
                      <select
                        value={addEmp.Mrd}
                        onChange={handleChange}
                        name="Mrd"
                        className="pl-3 focus:outline-none py-2 mt-1 text-lg rounded-md border-2 border-gray-300"
                      >
                        <option disabled value="">
                          Select Status
                        </option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </select>
                    </div>
                    {/* Designation */}
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-lg">Designation</label>
                      <input
                        type="text"
                        value={addEmp.Des}
                        name="Des"
                        onChange={handleChange}
                        placeholder="Designation"
                        className="pl-3 focus:outline-none py-2 mt-1 text-lg rounded-md border-2 border-gray-300"
                      />
                    </div>
                    {/* Department */}
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-lg">Department</label>
                      <select
                        value={addEmp.Dept}
                        onChange={handleChange}
                        name="Dept"
                        className="pl-3 focus:outline-none py-2 mt-1 text-lg rounded-md border-2 border-gray-300"
                      >
                        <option disabled value="">
                          Select Department
                        </option>
                        <option value="IT">IT</option>
                        <option value="Database">Database</option>
                        <option value="Metal">Metal</option>
                        <option value="Logistic">Logistic</option>
                      </select>
                    </div>
                    {/* Salary */}
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-lg">Salary</label>
                      <input
                        type="number"
                        value={addEmp.Salary}
                        name="Salary"
                        onChange={handleChange}
                        placeholder="Salary"
                        className="pl-3 focus:outline-none py-2 mt-1 text-lg rounded-md border-2 border-gray-300"
                      />
                    </div>
                    {/* Password */}
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-lg">Password</label>
                      <input
                        type="password"
                        value={addEmp.Pass}
                        name="Pass"
                        onChange={handleChange}
                        placeholder="********"
                        className="pl-3 focus:outline-none py-2 mt-1 text-lg rounded-md border-2 border-gray-300"
                      />
                    </div>
                    {/* Role */}
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-lg">Role</label>
                      <select
                        value={addEmp.Role}
                        name="Role"
                        onChange={handleChange}
                        className="pl-3 focus:outline-none py-2 mt-1 text-lg rounded-md border-2 border-gray-300"
                      >
                        <option disabled value="">
                          Select Role
                        </option>
                        <option value="Developer">Developer</option>
                        <option value="Designer">Designer</option>
                        <option value="HR">HR</option>
                      </select>
                    </div>
                    {/* Image */}
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-lg">Image</label>
                      <input
                        type="file"
                        name="Img"
                        onChange={handleChange}
                        className="pl-3 focus:outline-none py-[0.30rem] mt-1 text-lg rounded-md border-2 border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full mt-4">
                  <button
                    type="submit"
                    className="bg-teal-600 p-2 text-white font-semibold text-lg"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </div>
  );
};

export default Add;
