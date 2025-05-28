import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";
import AdminSidebar from "../Dashboard/AdminSidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../Loader";

const EmployeeView = () => {
  const url = "http://localhost:5000";

  const [selectedemp, setSelectedEmp] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [atdData, setAtdData] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setSelectedEmp(response.data.emp);
        }
      } catch (error) {
        console.error("API Error:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${url}/api/punch`);

        if (response?.data?.success) {
          console.log("Data Get Successfully");

          const punchData = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data];

          setAtdData(punchData);
        } else {
          console.log("Attendance error in View");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAttendanceData();
  }, []);

  const matchData = atdData
    .filter((data) => {
      const empMatch = data.emp_id === selectedemp.emp_id;
      const punchDate = new Date(data.PunchIn);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null;

      const dateMatch =
        (!start || punchDate >= start) &&
        (!end || punchDate <= end);

      return empMatch && dateMatch;
    })
    .sort((a, b) => new Date(b.PunchIn) - new Date(a.PunchIn));

  const formatTime = (datetime) => {
    if (!datetime) return "--";
    const date = new Date(datetime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateTotalTime = (punchIn, punchOut) => {
    if (!punchIn || !punchOut) return "--";

    const inTime = new Date(punchIn);
    const outTime = new Date(punchOut);

    const diffMs = outTime - inTime;
    if (diffMs < 0) return "--";

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flex">
      {loading && <Loader />}
      <AdminSidebar />
      <div className="w-full bg-gray-100">
        <Navbar />
        <div className="p-5">
          <div className="bg-white shadow-md p-5 rounded-lg">
            <h2 className="mb-4 text-center text-4xl font-bold">Employee Details</h2>
            {selectedemp ? (
              <div className="gap-10 mt-10 justify-center items-center flex">
                <div>
                  <img
                    src={`${url}/${selectedemp.Img}`}
                    alt=""
                    className="rounded-full w-56 h-56 object-cover mb-4"
                  />
                </div>
                <div className="space-y-6">
                  <p className="text-lg font-semibold">
                    <strong>Name:</strong>{" "}
                    <span className="text-base font-normal">
                      {selectedemp.emp_name}
                    </span>
                  </p>
                  <p className="text-lg font-semibold">
                    <strong>Employee ID:</strong>{" "}
                    <span className="text-base font-normal">
                      {selectedemp.emp_id}
                    </span>
                  </p>
                  <p className="text-lg font-semibold">
                    <strong>Date of Birth:</strong>{" "}
                    <span className="text-base font-normal">
                      {selectedemp.dob
                        ? new Date(selectedemp.dob).toLocaleDateString("en-GB")
                        : ""}
                    </span>
                  </p>
                  <p className="text-lg font-semibold">
                    <strong>Gender:</strong>{" "}
                    <span className="text-base font-normal">
                      {selectedemp.Gen}
                    </span>
                  </p>
                  <p className="text-lg font-semibold">
                    <strong>Department:</strong>{" "}
                    <span className="text-base font-normal">
                      {selectedemp.Dept}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <p>Loading employee data...</p>
            )}
          </div>

          {/* Attendance Records */}
          {matchData.length > 0 && (
            <div className="bg-white shadow-md p-5 mt-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Attendance Records</h3>

              {/* Date Filter */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Attendance Table */}
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-100">
                  <tr className="text-center text-gray-700 uppercase text-sm font-semibold">
                    <th className="py-3 px-6 border-b border-gray-300">Date</th>
                    <th className="py-3 px-6 border-b border-gray-300">Punch In</th>
                    <th className="py-3 px-6 border-b border-gray-300">Punch Out</th>
                    <th className="py-3 px-6 border-b border-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {matchData.map((item, index) => (
                    <tr
                      key={index}
                      className={`text-center text-gray-700 text-base ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-200 transition-colors duration-200`}
                    >
                      <td className="py-3 px-6 border-b border-gray-200">
                        {item.PunchIn
                          ? new Date(item.PunchIn).toLocaleDateString("en-GB")
                          : "--"}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200">
                        {formatTime(item.PunchIn)}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200">
                        {formatTime(item.PunchOut)}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200">
                        <span className="text-sm text-gray-500">
                          {calculateTotalTime(item.PunchIn, item.PunchOut)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
