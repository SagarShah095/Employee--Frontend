import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";
import { useAuth } from "../../Context/authContext";
import axios from "axios";
import { Loader } from "lucide-react";

const EmpChangePass = () => {
  const { user } = useAuth();
  const url = "http://localhost:4000";

  const [selectedEmp, setSelectedEmp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState("");

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
      } catch (error) {
        console.error("API Error:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user]);

  // Memoize userData so it updates when selectedEmp or user changes
  const userData = useMemo(() => {
    return selectedEmp.find((emp) => emp.email === user?.email);
  }, [selectedEmp, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      setMessage("User data is loading. Please wait.");
      return;
    }

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

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.put(
        `${url}/api/employee/change-password/${userData?._id}`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }
        // Add headers if needed here
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // }
      );

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
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50">
      <Navbar />
      <div className="flex">
        <EmployeeSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Change Password
            </h2>

            {loading && (
              <div className="flex justify-center mb-4">
                <Loader className="animate-spin" />
              </div>
            )}

            {message && (
              <div
                className={`text-center mb-4 text-sm ${
                  message.includes("successfully")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {message}
              </div>
            )}

            {!loading && !userData && (
              <div className="text-center mb-4 text-red-500">
                Loading user data... please wait.
              </div>
            )}

            {!loading && userData && (
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpChangePass;
