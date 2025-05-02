import React, { useEffect } from "react";
import AdminSidebar from "../Component/Dashboard/AdminSidebar";
import Navbar from "../Component/Dashboard/Navbar";
import AdminSummary from "../Component/Dashboard/AdminSummary";

const AdminDashboard = () => {
  return (
    <div>
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gray-100 ">
          <div className="w-full">
            <Navbar />
          </div>
          <div>
            <AdminSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
