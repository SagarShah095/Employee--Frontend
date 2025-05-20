import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Dashboard/Navbar";
import AdminSidebar from "../Dashboard/AdminSidebar";
import { CSVLink } from "react-csv";
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

const getTotalTime = (inTime, outTime) => {
    if (!inTime || !outTime || inTime === "Leave" || outTime === "Leave") return "-";
    const inDate = new Date(inTime);
    const outDate = new Date(outTime);
    const diffMs = outDate - inDate;

    if (isNaN(diffMs) || diffMs < 0) return "-";

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hr${hours !== 1 ? "s" : ""} ${minutes} min${minutes !== 1 ? "s" : ""}`;
};

const Attendance = () => {
    const [loading, setLoading] = useState(false);
    const [punchData, setPunchData] = useState([]);
    const [empData, setEmpData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchEmpId, setSearchEmpId] = useState("");
    const [searchEmpName, setSearchEmpName] = useState("");

    const url = "https://employee-backend-q7hn.onrender.com";

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
        const punchMap = punchData.reduce((acc, punch) => {
            acc[punch.emp_id] = punch;
            return acc;
        }, {});
        const empMap = empData.reduce((acc, emp) => {
            acc[emp.emp_id] = emp;
            return acc;
        }, {});

        let merged = empData.map((emp) => ({
            emp_id: emp.emp_id,
            emp_name: emp.emp_name,
            PunchIn: punchMap[emp.emp_id]?.PunchIn ?? "Leave",
            PunchOut: punchMap[emp.emp_id]?.PunchOut ?? "Leave",
            isLeave: !punchMap[emp.emp_id],
        }));

        const punchOnly = punchData
            .filter((p) => !empMap[p.emp_id])
            .map((p) => ({
                emp_id: p.emp_id,
                emp_name: "Unknown Employee",
                PunchIn: p.PunchIn,
                PunchOut: p.PunchOut,
                isLeave: false,
            }));

        merged = [...merged, ...punchOnly];

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

    const csvHeaders = [
        { label: "Employee ID", key: "emp_id" },
        { label: "Name", key: "emp_name" },
        { label: "Punch In", key: "PunchIn" },
        { label: "Punch Out", key: "PunchOut" },
        { label: "Total Time", key: "TotalTime" },
    ];

    const exportData = filteredData.map((row) => ({
        emp_id: row.emp_id,
        emp_name: row.emp_name,
        PunchIn: formatDateTime(row.PunchIn),
        PunchOut: formatDateTime(row.PunchOut),
        TotalTime: getTotalTime(row.PunchIn, row.PunchOut),
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

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <div className="flex gap-4 flex-wrap">
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
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={resetFilter}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex gap-4 mb-4">
                        {/* <CSVLink
                            headers={csvHeaders}
                            data={exportData}
                            filename="Attendance_Report.csv"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            Export CSV
                        </CSVLink> */}
                        <button
                            onClick={handleExcelExport}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Export Excel
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
                        {filteredData.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-teal-600 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Employee ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Punch In</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Punch Out</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Time</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.map((e, i) => (
                                        <tr key={i} className="hover:bg-gray-100 transition">
                                            <td className="px-6 py-4 text-sm text-gray-700">{e.emp_id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{e.emp_name}</td>
                                            <td className={`px-6 py-4 text-sm font-medium ${e.isLeave ? "bg-red-200 text-red-800" : "text-green-600"}`}>
                                                {formatDateTime(e.PunchIn)}
                                            </td>
                                            <td className={`px-6 py-4 text-sm font-medium ${e.isLeave ? "bg-red-200 text-red-800" : "text-red-600"}`}>
                                                {formatDateTime(e.PunchOut)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-blue-700 font-medium">
                                                {getTotalTime(e.PunchIn, e.PunchOut)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-600 py-4">No records found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
