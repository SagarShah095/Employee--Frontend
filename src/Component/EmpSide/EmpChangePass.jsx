import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";
import { useAuth } from "../../Context/authContext";
import axios from "axios";
import { Loader } from "lucide-react";

const EmpChangePass = () => {
  const { user } = useAuth();
  const url = "https://employee-backend-q7hn.onrender.com";

  const [selectedEmp, setSelectedEmp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState("");

  // console.log(form, "form in emp change password");
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setSelectedEmp(response?.data?.Emp);
        }
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user]);

  const userData = selectedEmp?.find((emp) => emp.email === user?.email);

  console.log(userData, "userData in emp change password");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmNewPassword
    ) {
      setMessage("All fields are required.");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const res = await axios.put(
        `${url}/api/employee/change-password/${userData?._id}`,
        {
          // empId: user._id,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }

        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // }
      );
      console.log(res.data, "response in change password");

      if (res.data.success) {
        setMessage("✅ Password updated successfully.");
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setMessage(res.data.message || "Failed to update password.");
      }
    setLoading(false)
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error.");
    }
    setLoading(false)
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50">
      <Navbar />
      <div className="flex">
        <EmployeeSidebar />
        {loading && <Loader />}
        <div className="flex-1 p-6">
          <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Change Password
            </h2>
            {message && (
              <div className="text-center mb-4 text-sm text-red-500">
                {message}
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                   focus:ring-blue-400"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                   focus:ring-blue-400"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                   focus:ring-blue-400"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg 
                transition duration-300"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpChangePass;
