import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Dashboard/Navbar";
import AdminSidebar from "../Dashboard/AdminSidebar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Loader = () => <div className="p-4 text-lg">Loading...</div>;

const formatDateTime = (value) => {
  if (!value || value === "Leave") return value;
  const dt = new Date(value);
  const date = dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const time = dt.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} ${time}`;
};

const formatForInput = (value) => {
  // Format date to yyyy-MM-ddTHH:mm for datetime-local input
  if (!value || value === "Leave") return "";
  const dt = new Date(value);
  const pad = (n) => (n < 10 ? "0" + n : n);
  const yyyy = dt.getFullYear();
  const MM = pad(dt.getMonth() + 1);
  const dd = pad(dt.getDate());
  const hh = pad(dt.getHours());
  const mm = pad(dt.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

const getTotalTime = (inTime, outTime) => {
  if (!inTime || !outTime || inTime === "Leave" || outTime === "Leave")
    return "-";
  const inDate = new Date(inTime);
  const outDate = new Date(outTime);
  const diffMs = outDate - inDate;

  if (isNaN(diffMs) || diffMs < 0) return "-";

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} hr${hours !== 1 ? "s" : ""} ${minutes} min${
    minutes !== 1 ? "s" : ""
  }`;
};

const getTotalHours = (inTime, outTime) => {
  if (!inTime || !outTime || inTime === "Leave" || outTime === "Leave")
    return 0;
  const inDate = new Date(inTime);
  const outDate = new Date(outTime);
  const diffMs = outDate - inDate;
  if (isNaN(diffMs) || diffMs < 0) return 0;
  return diffMs / (1000 * 60 * 60); // hours
};

const isLatePunchIn = (punchIn) => {
  if (!punchIn || punchIn === "Leave") return false;
  const dt = new Date(punchIn);
  return dt.getHours() > 9 || (dt.getHours() === 9 && dt.getMinutes() > 0);
};

const isEarlyPunchOut = (punchOut) => {
  if (!punchOut || punchOut === "Leave") return false;
  const dt = new Date(punchOut);
  return dt.getHours() < 18;
};

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [punchData, setPunchData] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchEmpId, setSearchEmpId] = useState("");
  const [searchEmpName, setSearchEmpName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // false = add, true = edit
  const [currentEdit, setCurrentEdit] = useState(null); // object of row being edited or null
  const [showUser, setShowUser] = useState({});

  console.log(showUser, "showUsershowUsershowUser");

  const url = "http://localhost:5000";

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${url}/api/employee`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success) setEmpData(data.Emp);
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  console.log(empData, "empDataempDataempData");

  useEffect(() => {
    const fetchPunches = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${url}/api/punch/`);
        setPunchData(data.data);
      } catch (err) {
        console.error("Failed to fetch punch data:", err);
      }
      setLoading(false);
    };
    fetchPunches();
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPunches = punchData.filter((p) => {
      const punchDate = new Date(p.PunchIn);
      punchDate.setHours(0, 0, 0, 0);
      return punchDate.getTime() === today.getTime();
    });

    const punchMap = todayPunches.reduce((acc, punch) => {
      acc[punch.emp_id] = punch;
      return acc;
    }, {});

    let merged = empData.map((emp) => {
      const punch = punchMap[emp.emp_id];
      const punchIn = punch?.PunchIn ?? "Leave";
      const punchOut = punch?.PunchOut ?? "Leave";
      const hoursWorked = getTotalHours(punchIn, punchOut);

      let status = "Absent";
      if (punchIn !== "Leave" && punchOut !== "Leave") {
        if (hoursWorked >= 6) {
          status = "Present";
        } else if (hoursWorked >= 3) {
          status = "Half Day";
        }
      }

      return {
        emp_id: emp.emp_id,
        emp_name: emp.emp_name,
        PunchIn: punchIn,
        PunchOut: punchOut,
        isLeave: !punch,
        isLate: isLatePunchIn(punchIn),
        isEarly: isEarlyPunchOut(punchOut),
        status,
      };
    });

    if (searchEmpId) {
      merged = merged.filter((x) =>
        x.emp_id.toLowerCase().includes(searchEmpId.toLowerCase())
      );
    }

    if (searchEmpName) {
      merged = merged.filter((x) =>
        x.emp_name.toLowerCase().includes(searchEmpName.toLowerCase())
      );
    }

    setFilteredData(merged);
  }, [empData, punchData, searchEmpId, searchEmpName]);

  const resetFilter = () => {
    setSearchEmpId("");
    setSearchEmpName("");
  };

  const exportData = filteredData.map((row) => ({
    emp_id: row.emp_id,
    emp_name: row.emp_name,
    PunchIn: formatDateTime(row.PunchIn),
    PunchOut: formatDateTime(row.PunchOut),
    TotalTime: getTotalTime(row.PunchIn, row.PunchOut),
    Status: row.status,
    Notes: `${row.isLate ? "Late " : ""}${
      row.isEarly ? "| Early Leave" : ""
    }`.trim(),
  }));

  const handleExcelExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "Attendance_Report.xlsx");
  };

  // Handlers for modal form
  const openEditModal = (row) => {
    setCurrentEdit({
      emp_id: row.emp_id,
      emp_name: row.emp_name,
      PunchIn: row.PunchIn === "Leave" ? "" : row.PunchIn,
      PunchOut: row.PunchOut === "Leave" ? "" : row.PunchOut,
    });
    setEditMode(true);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentEdit({
      emp_id: "",
      emp_name: "",
      PunchIn: "",
      PunchOut: "",
    });
    setEditMode(false);
    setModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setCurrentEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Validation: emp_id and emp_name required
    if (!currentEdit.emp_id || !currentEdit.emp_name) {
      alert("Employee ID and Name are required");
      return;
    }
    // Check if PunchIn and PunchOut are valid dates or empty string (means leave)
    const isValidDate = (d) => {
      if (!d) return true;
      return !isNaN(new Date(d).getTime());
    };
    if (
      !isValidDate(currentEdit.PunchIn) ||
      !isValidDate(currentEdit.PunchOut)
    ) {
      alert("Invalid date/time for Punch In or Punch Out");
      return;
    }

    // Update punchData or add new
    setPunchData((prev) => {
      // If editing, update existing or add if doesn't exist
      const idx = prev.findIndex((p) => p.emp_id === currentEdit.emp_id);
      const newPunch = {
        emp_id: currentEdit.emp_id,
        PunchIn: currentEdit.PunchIn || "Leave",
        PunchOut: currentEdit.PunchOut || "Leave",
      };
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newPunch;
        return updated;
      } else {
        return [...prev, newPunch];
      }
    });

    // If adding new employee (emp_id not in empData), optionally add empData as well (simplified here: just add to empData)
    if (!empData.find((e) => e.emp_id === currentEdit.emp_id)) {
      setEmpData((prev) => [
        ...prev,
        { emp_id: currentEdit.emp_id, emp_name: currentEdit.emp_name },
      ]);
    }

    setModalOpen(false);
    setCurrentEdit(null);
  };

  const matchTotalData = empData.filter((data) => data?.emp_id === showUser);

  console.log(matchTotalData[0]?.emp_name, "matchTotalDatamatchTotalDatamatchTotalData");

  return (
    <div className="flex">
      {loading && <Loader />}
      <AdminSidebar />
      <div className="w-full bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Employee Attendance
          </h1>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex gap-4 flex-wrap items-end">
              <div className="flex-1 min-w-[200px] flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Filter by Employee ID:
                </label>
                <input
                  type="text"
                  placeholder="Enter Employee ID"
                  value={searchEmpId}
                  onChange={(e) => setSearchEmpId(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="flex-1 min-w-[200px] flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Filter by Employee Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter Employee Name"
                  value={searchEmpName}
                  onChange={(e) => setSearchEmpName(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                onClick={resetFilter}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
              >
                Reset Filters
              </button>
              <button
                onClick={handleExcelExport}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
              >
                Export to Excel
              </button>
              <button
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded ml-auto"
              >
                Add Attendance
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">
                    Employee ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Employee Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Punch In</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Punch Out
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Total Time
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Notes</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center text-gray-500 px-4 py-6"
                    >
                      No data found.
                    </td>
                  </tr>
                )}
                {filteredData.map((row) => (
                  <tr
                    key={row.emp_id}
                    className="border border-gray-300 hover:bg-gray-50"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {row.emp_id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.emp_name}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 ${
                        row.isLate ? "text-red-600 font-semibold" : ""
                      }`}
                      title={row.isLate ? "Late Punch In" : ""}
                    >
                      {formatDateTime(row.PunchIn)}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 ${
                        row.isEarly ? "text-red-600 font-semibold" : ""
                      }`}
                      title={row.isEarly ? "Early Punch Out" : ""}
                    >
                      {formatDateTime(row.PunchOut)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {getTotalTime(row.PunchIn, row.PunchOut)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.isLate && "Late "}
                      {row.isEarly && "| Early Leave"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => openEditModal(row)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for Add/Edit */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4">
                  {editMode ? "Edit Attendance" : "Add Attendance"}
                </h2>

                <label className="block mb-2 font-medium">
                  Employee ID:
                  <select
                    name="emp_id"
                    value={currentEdit.emp_id}
                    onChange={(e) => {
                      handleModalChange(e); // Your existing change handler
                      setShowUser(e.target.value); // Update your state with the selected value
                    }}
                    disabled={editMode}
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  >
                        <option value="" selected disabled>
                          selected empId
                        </option>
                    {empData?.map((data, i) => (
                        <option key={i} value={data.emp_id}>
                          {data.emp_id}
                        </option>
                    ))}
                  </select>
                </label>

                <label className="block mb-2 font-medium">
                  Employee Name:
                  <select
                    type="text"
                    name="emp_name"
                    value={currentEdit.emp_name}
                    onChange={handleModalChange}
                    disabled={editMode}
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  >
                    
                    <option value={matchTotalData[0]?.emp_name}>{matchTotalData[0]?.emp_name}</option>
                  </select>
                </label>

                <label className="block mb-2 font-medium">
                  Punch In:
                  <input
                    type="datetime-local"
                    name="PunchIn"
                    value={formatForInput(currentEdit.PunchIn)}
                    onChange={handleModalChange}
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  />
                </label>

                <label className="block mb-2 font-medium">
                  Punch Out:
                  <input
                    type="datetime-local"
                    name="PunchOut"
                    value={formatForInput(currentEdit.PunchOut)}
                    onChange={handleModalChange}
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  />
                </label>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setCurrentEdit(null);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
