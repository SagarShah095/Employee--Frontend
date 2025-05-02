import React from "react";
import { useAuth } from "../Context/authContext";
import { Navigate } from "react-router-dom";
import AdminSidebar from "../Component/Dashboard/AdminSidebar";
import Navbar from "../Component/Dashboard/Navbar";

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <div className="flex">
          <AdminSidebar />
          <div className="w-full bg-gray-100 ">
            <div className="w-full">
              <Navbar />
            </div>
            <div className="flex flex-col items-center justify-center h-[80vh] text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-600 font-medium">
                Checking permissions...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default RoleBaseRoutes;
