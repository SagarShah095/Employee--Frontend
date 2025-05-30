import React from "react";
import EmployeeSidebar from "./EmployeeSidebar";
import Navbar from "../Dashboard/Navbar";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../Context/authContext";
import { Loader } from "lucide-react";

const EmpLeave = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const URL = "http://localhost:4000";

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}/api/leave`);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          console.error("Failed to fetch data");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const userData = data?.filter((item) => item?.emp_id === user?.emp_id);
  console.log(data, "U Data");
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-100 to-white">
      {loading && <Loader />}
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <EmployeeSidebar />

        {/* Content Area */}
        <main className="flex-1 p-10 bg-gradient-to-br from-white via-blue-50 to-blue-100">
          <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-2xl p-10 border border-gray-200">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-6">
              Employee Leave Portal
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Manage your leave applications, check balance, and view leave
              history.
            </p>
            {userData && userData.length > 0 ? (
              <div>
                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-blue-100 p-6 rounded-xl shadow-md text-center">
                    <h2 className="text-2xl font-bold text-blue-700">
                      {userData.length}
                    </h2>
                    <p className="text-gray-600">Total Leaves</p>
                  </div>
                  <div className="bg-green-100 p-6 rounded-xl shadow-md text-center">
                    <h2 className="text-2xl font-bold text-green-700">
                      {
                        userData.filter((item) => item.status === "Approved")
                          .length
                      }
                    </h2>
                    <p className="text-gray-600">Approved Leaves</p>
                  </div>
                  <div className="bg-yellow-100 p-6 rounded-xl shadow-md text-center">
                    <h2 className="text-2xl font-bold text-yellow-700">
                      {
                        userData.filter((item) => item.status === "Pending")
                          .length
                      }
                    </h2>
                    <p className="text-gray-600">Pending Leaves</p>
                  </div>
                </div>

                {/* Table for all leaves */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Recent Leave Requests
                  </h3>
                  <table className="w-full table-auto text-left">
                    <thead>
                      <tr className="bg-blue-50 text-blue-700">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {userData.map((item, i) => (
                        <tr key={i} className="border-b hover:bg-blue-50">
                          <td className="py-3 px-4">{item.fromDate}</td>
                          <td className="py-3 px-4">{item.leavetype} Leave</td>
                          <td
                            className={`py-3 px-4 font-semibold ${
                              item.status === "Approved"
                                ? "text-green-600"
                                : item.status === "Pending"
                                ? "text-yellow-600"
                                : item.status === "Rejected"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {item.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
                <h2 className="text-2xl font-bold mb-2">
                  No Leave Data Available
                </h2>
                <p className="text-gray-400">
                  You have not applied for any leaves yet.
                </p>
              </div>
            )}

            {/* Leave Summary */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmpLeave;
