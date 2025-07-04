import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";
import { useAuth } from "../../Context/authContext";
import axios from "axios";

import TourManager from "../../shared/TourManager";
import Loader from "../Loader";

const EmpProfile = () => {
  const { user } = useAuth();
  const url = "https://employee-backend-q7hn.onrender.com";

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [loading, setLoading] = useState(true); // start with loading true

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return; // ensure user is ready
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/employee/${user?._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setSelectedEmp(response.data.emp);
        } else {
          console.error("Failed to fetch employee");
        }
      } catch (error) {
        console.error("API Error:", error.response || error);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const steps = [
    {
      id: "page2-step",
      text: "This is Profile Page , here you can check your all data. Click next to go to Attendance",
      attachTo: { element: ".page2-next-btn", on: "bottom" },
      nextRoute: "/employee/punch",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50">
      <TourManager steps={steps} pageKey="page2" />
      <Navbar />
      <div className="flex">
        <EmployeeSidebar />
        <div className="flex-1 p-6 ">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 page2-next-btn">
            {loading && <Loader />}
            <div className="flex items-center gap-6  ">
              <img
                src={
                  selectedEmp?.Img
                    ? `${url}/${selectedEmp.Img}`
                    : "https://via.placeholder.com/150"
                }
                alt="profile"
                className="w-28 h-28 object-cover rounded-full"
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-gray-800">
                  {selectedEmp?.emp_name}
                </h1>
                <p className="text-gray-600 text-sm">{selectedEmp?.email}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-gray-700 text-base ">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <span className="font-semibold text-gray-900">
                    Department:
                  </span>
                  <p>{selectedEmp?.Dept}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    Designation:
                  </span>
                  <p>{selectedEmp?.Des}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Salary:</span>
                  <p>₹{selectedEmp?.Salary}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    Employee ID:
                  </span>
                  <p>{selectedEmp?.emp_id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpProfile;
