import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import AdminSidebar from "../Dashboard/AdminSidebar";
import axios from "axios";
import { Loader } from "lucide-react";

const LeaveAdd = () => {
  const [leave, setLeave] = React.useState({
    empId: "",
    emp_name: "",
    leavetype: "",
    fromDate: "",
    toDate: "",
  });
  const [empData, setEmpData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [redAlert, setRedAlert] = useState(false);

  const url = "https://employee-backend-q7hn.onrender.com";


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setEmpData(response.data.Emp);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prevLeave) => ({
      ...prevLeave,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (leave.toDate < leave.fromDate) {
      setRedAlert(true);
    }
    if (leave.toDate > leave.fromDate) {
      try {
        const response = await axios.post(
          "https://employee-backend-q7hn.onrender.com/api/leave/add",
          {
            empId: leave.empId,
            emp_name: leave.emp_name,
            leavetype: leave.leavetype,
            fromDate: leave.fromDate,
            toDate: leave.toDate,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response?.data?.success) {
          alert("Leave applied successfully!");
          setLeave({
            empId: "",
            emp_name: "",
            leavetype: "",
            fromDate: "",
            toDate: "",
          });
        } else {
          alert("Leave applied Error!");
        }
      } catch (error) {
        console.error("Error applying leave:", error);
      }
    } else {
      alert("Please check the date");
    }
  };

  return (
    <div>
      {loading && <Loader/>}
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gray-100 min-h-screen">
          <div className="w-full">
            <Navbar />
          </div>
          <div>
            <div className="flex justify-center items-center mt-4">
              <h1 className="font-semibold text-xl">Apply Leaves</h1>
            </div>
            <div>
              <div>
                <div className="flex justify-center items-center mt-4">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                  >
                    <div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="empId"
                        >
                          Employee ID
                        </label>
                        <select
                          id="empId"
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const selectedEmp = empData.find(
                              (emp) => emp.emp_id === selectedId
                            );
                            setLeave((prev) => ({
                              ...prev,
                              empId: selectedId,
                              emp_name: selectedEmp ? selectedEmp.emp_name : "",
                            }));
                          }}
                          value={leave.empId}
                          name="empId"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="" disabled>
                            Select Employee ID
                          </option>
                          {empData.map((emp, i) => (
                            <option key={i} value={emp.emp_id}>
                              {emp.emp_id}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="emp_name"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="emp_name"
                          name="emp_name"
                          value={leave.emp_name}
                          readOnly
                          className="shadow appearance-none border bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="leavetype"
                      >
                        Leave Type
                      </label>
                      <select
                        id="leavetype"
                        onChange={handleChange}
                        value={leave.leavetype}
                        name="leavetype"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="" selected disabled>
                          Select Leave Type
                        </option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Casual">Casual Leave</option>
                        <option value="Annual">Annual Leave</option>
                      </select>
                    </div>
                    <div
                      className={`text-red-400 ${
                        redAlert ? "block" : "hidden"
                      }`}
                    >
                      Please check the Date
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="fromDate"
                      >
                        From Date
                      </label>
                      <input
                        type="date"
                        id="fromDate"
                        onChange={handleChange}
                        value={leave.fromDate}
                        name="fromDate"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div
                      className={`text-red-400 ${
                        redAlert ? "block" : "hidden"
                      }`}
                    >
                      Please check the Date
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="fromDate"
                      >
                        To Date
                      </label>
                      <input
                        type="date"
                        id="toDate"
                        onChange={handleChange}
                        value={leave.toDate}
                        name="toDate"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="bg-teal-600 text-white px-6 py-2 mt-3 rounded-md w-full hover:bg-teal-700 transition duration-200"
                      >
                        Apply Leave
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveAdd;
