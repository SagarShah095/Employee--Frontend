import React from "react";
import Navbar from "../Dashboard/Navbar";
import EmployeeSidebar from "./EmployeeSidebar";

// Main Sidebar Layout
const AdminSidebar = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <EmployeeSidebar />

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Your Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Attendance Card */}
            <div className="bg-white shadow-md rounded-lg p-5">
              <h2 className="text-lg font-semibold text-teal-600">Today's Attendance</h2>
              <p className="text-gray-600 mt-2">Status: Present</p>
              <p className="text-gray-500">Check-in: 9:00 AM | Check-out: 6:00 PM</p>
            </div>

            {/* Task Card */}
            <div className="bg-white shadow-md rounded-lg p-5">
              <h2 className="text-lg font-semibold text-teal-600">Assigned Tasks</h2>
              <p className="text-gray-600 mt-2">3 Tasks Due Today</p>
              <p className="text-gray-500">View detailed task list in "Tasks" section.</p>
            </div>

            {/* Salary Card */}
            <div className="bg-white shadow-md rounded-lg p-5">
              <h2 className="text-lg font-semibold text-teal-600">Latest Salary</h2>
              <p className="text-gray-600 mt-2">₹45,000 Credited</p>
              <p className="text-gray-500">On: 31st March, 2025</p>
            </div>
          </div>

          {/* Announcements Section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Announcements</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Annual Meeting scheduled on 10th May at 11:00 AM.</li>
              <li>New HR policies are live, check your email.</li>
              <li>Submit your April timesheet before 5th May.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
