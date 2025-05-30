import React, { useEffect, useState } from "react";
import AdminSidebar from "../Dashboard/AdminSidebar";
import Navbar from "../Dashboard/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../Loader";

const SalaryView = () => {
  const url = "http://localhost:4000";
  const [salary, setSalary] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/salary/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response?.data?.success) {
          setSalary(response?.data?.data);
        }
        setLoading(false);
      } catch (error) {
        if (error.response && !error.response.data.success) {
          console.log(
            error.response.data.error || "Error fetching employee data"
          );
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {loading && <Loader />}
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="m-10">
          <h1 className="text-2xl font-bold mb-6">Salary Records</h1>

          <div className="overflow-x-auto bg-white shadow-lg rounded-md">
            <table className="min-w-full divide-y divide-gray-300 text-center">
              <thead className="bg-gray-100 text-black uppercase text-sm">
                <tr>
                  <th className="py-3 px-4">Emp ID</th>
                  <th className="py-3 px-4">Salary</th>
                  <th className="py-3 px-4">Allowance</th>
                  <th className="py-3 px-4">Deduction</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Pay Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b hover:bg-gray-100 transition">
                  <td className="py-3 px-4">{salary?.empId?.emp_name}</td>
                  <td className="py-3 px-4">{salary.basicSalary}</td>
                  <td className="py-3 px-4">{salary.allowances}</td>
                  <td className="py-3 px-4">{salary.deductions}</td>
                  <td className="py-3 px-4">{salary.totalSalary}</td>
                  <td className="py-3 px-4">{new Date(salary.payDate).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryView;
