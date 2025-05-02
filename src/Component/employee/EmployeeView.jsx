import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import AdminSidebar from "../Dashboard/AdminSidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../Loader";

const EmployeeView = () => {

  const url = "https://employee-backend-q7hn.onrender.com";

  const [selectedemp, setSelectedEmp] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClick = async () => {
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
          setSelectedEmp(response.data.emp);
        }
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error.response || error);
      }
      setLoading(false);
    };

    if (id) handleClick();
  }, [id]);

  return (
    <div className="flex">
      {loading && <Loader />}
      <AdminSidebar />
      <div className="w-full bg-gray-100">
        <Navbar />
        <div className="p-5">
          <div className="bg-white shadow-md p-5 rounded-lg">
            <h2 className=" mb-4 text-center text-4xl font-bold">Employee Details</h2>
            {selectedemp ? (
              <div className="gap-10 mt-10 justify-center items-center flex">
                <div>
                  <img
                    src={`${url}/${selectedemp.Img}`}
                    alt=""
                    className="rounded-full w-56 h-56  object-cover mb-4"
                  />
                </div>
                <div className="space-y-6">
                  <p className="text-lg font-semibold ">
                    <strong>Name:</strong> <span className="text-base font-normal">{selectedemp.emp_name}</span>
                  </p>
                  <p className="text-lg font-semibold ">
                    <strong>Employee ID:</strong> <span className="text-base font-normal">{selectedemp.emp_id}</span>
                  </p>
                  <p className="text-lg font-semibold ">
                    <strong>Date of Birth:</strong> <span className="text-base font-normal">{selectedemp.dob ? new Date(selectedemp.dob).toLocaleDateString("en-GB") : ""} </span>
                  </p>
                  <p className="text-lg font-semibold ">
                    <strong>Gender:</strong> <span className="text-base font-normal">{selectedemp.Gen}</span>
                  </p>
                  <p className="text-lg font-semibold ">
                    <strong>Department:</strong> <span className="text-base font-normal">{selectedemp.Dept}</span>
                  </p>
                </div>
              </div>
            ) : (
              <p>Loading employee data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
