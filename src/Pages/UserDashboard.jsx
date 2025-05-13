import React from "react";
import AdminSidebar from "../Component/Dashboard/AdminSidebar";
import Navbar from "../Component/Dashboard/Navbar";

const UserDashboard = () => {
  return (
    <div>
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gray-100 ">
          <div className="w-full">
            <Navbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
