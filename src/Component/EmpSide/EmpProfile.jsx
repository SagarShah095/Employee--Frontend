import React, { useEffect, useState } from "react";
import AdminSidebar from "./EmployeeDashboard";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";
import { useAuth } from "../../Context/authContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader } from "lucide-react";

const EmpProfile = () => {
  const { user } = useAuth();
  const url = "https://employee-backend-q7hn.onrender.com";

  const [selectedEmp, setSelectedEmp] = useState([]);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState();

  console.log(data, "data in emp profile");


  useEffect(() => {
    const fetchData = async () => {
      Console.log("Fetching employee data...");
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/employee/${user?._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response.data, "response in emp profile");
        if (response.data.success) {
          setSelectedEmp(response?.data.emp);
        }
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error.response || error);
      }
      setLoading(false);
    };

    fetchData;
  });

  const userData = selectedEmp?.find((emp) => emp.email === user?.email);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50">
      {loading && <Loader />}
      <Navbar />
      <div className="flex">
        <EmployeeSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
            <div className="flex items-center gap-6">
              <img
                src={user?.profileImage || "/default-profile.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {user?.name}
                </h1>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>
            </div>

            {loading ? (
              <div className="mt-6 text-center text-blue-500 font-medium">
                Loading employee details...
              </div>
            ) : (
              <div className="mt-8 space-y-4 text-gray-700 text-base">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span className="font-semibold text-gray-900">
                      Department:
                    </span>
                    <p>{user?.Dept}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      Designation:
                    </span>
                    <p>{user?.Des}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Salary:</span>
                    <p>₹{user?.Salary}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      Employee ID:
                    </span>
                    <p>{user?.emp_id}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpProfile;
