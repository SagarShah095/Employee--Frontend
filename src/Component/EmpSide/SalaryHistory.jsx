import React, { useEffect, useState } from "react";
import EmployeeSidebar from "./EmployeeSidebar";
import Navbar from "../Dashboard/Navbar";
import axios from "axios";
import { useAuth } from "../../Context/authContext";
import { Loader } from "lucide-react";

const SalaryHistory = () => {
  const URL = "https://employee-backend-q7hn.onrender.com";
  const { user } = useAuth();
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      setLoading(true);
      if (!user) {
        console.warn("User not available yet.");
        return;
      }
      try {
        const response = await axios.get(`${URL}/api/salary`);
        console.log("Salary History Response:", response.data);
        if (response.data.success) {
          setSalaryHistory(response.data.data);
        } else {
          console.error("Failed to fetch salary history");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching salary history:", error);
      }
      setLoading(false);
    };

    fetchSalaryHistory();
  }, [user]);

  console.log("User:", user);
  console.log("Full Salary History:", salaryHistory);

  // ✅ Correct Filter only user's department and emp_name match
  const filteredData = salaryHistory.filter(
    (data) => data.mainEmpId === user?.emp_id
  );

  console.log("Filtered Salary Data for User Dept & Name:", filteredData);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-100 to-white">
      {loading && <Loader />}
      <Navbar />
      <div className="flex flex-1">
        <EmployeeSidebar />

        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-gray-700 mb-6">
            Salary History
          </h1>

          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((salary, index) => (
                <div
                  key={index}
                  className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-300"
                >
                  <h2 className="text-xl font-bold text-gray-800">
                    {salary.month} {salary.year}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Amount: ₹{salary.basicSalary}
                  </p>
                  <p className="text-gray-600">
                    Allowance: {salary.allowances}
                  </p>
                  <p className="text-gray-600">
                    Date: {new Date(salary.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No salary history found or loading...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryHistory;
