import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeSidebar from "./EmployeeSidebar";
import Navbar from "../Dashboard/Navbar";
import { useAuth } from "../../Context/authContext";

import TourManager from "../../shared/TourManager";
import Loader from "../Loader";

const SummaryCard = ({ count, label, bgColor, textColor }) => (
  <div className={`${bgColor} p-6 rounded-xl shadow-md text-center`}>
    <h2 className={`text-2xl font-bold ${textColor}`}>{count}</h2>
    <p className="text-gray-600">{label}</p>
  </div>
);

const EmpLeave = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const URL = "https://employee-backend-q7hn.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}/api/leave`);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.emp_id) {
      fetchData();
    }
  }, [user]);

  const userData = data?.filter((item) => item?.emp_id === user?.emp_id);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Pending":
        return "text-yellow-600";
      case "Rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const steps = [
    {
      id: "page4-step",
      text: "This is  Leave History Page, here you can check your Leave History. Click next to go to Apply Leave Page",
      attachTo: { element: ".page4-next-btn", on: "bottom" },
      nextRoute: "/employee/apply-leave",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-100 to-white">
      <TourManager steps={steps} pageKey="page6" />
      {loading && <Loader />}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <EmployeeSidebar />

        <main className="flex-1 p-10 bg-gradient-to-br from-white via-blue-50 to-blue-100">
          <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-2xl p-10 border border-gray-200">
            <h1 className="text-4xl font-extrabold text-black mb-6">
              Employee Leave Portal
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Manage your leave applications, check balance, and view leave
              history.
            </p>

            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b animate-pulse">
                  <td className="py-3 px-4">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 bg-gray-300 rounded w-28"></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </td>
                </tr>
              ))
            ) : userData && userData.length > 0 ? (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <SummaryCard
                    count={userData.length}
                    label="Total Leaves"
                    bgColor="bg-blue-100"
                    textColor="text-blue-700"
                  />
                  <SummaryCard
                    count={
                      userData.filter((item) => item.status === "Approved")
                        .length
                    }
                    label="Approved Leaves"
                    bgColor="bg-green-100"
                    textColor="text-green-700"
                  />
                  <SummaryCard
                    count={
                      userData.filter((item) => item.status === "Pending")
                        .length
                    }
                    label="Pending Leaves"
                    bgColor="bg-yellow-100"
                    textColor="text-yellow-700"
                  />
                </div>

                {/* Leave history table */}
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
                            className={`py-3 px-4 font-semibold ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center mt-10">
                <h2 className="text-xl font-bold mb-2">
                  No Leave Data Available
                </h2>
                <p className="text-gray-400">
                  You have not applied for any leaves yet.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmpLeave;
