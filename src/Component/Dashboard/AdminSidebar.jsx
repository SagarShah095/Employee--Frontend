import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaMoneyBillWave,
  FaBuilding,
} from "react-icons/fa";
import { FcLeave } from "react-icons/fc";

import { CgDetailsMore } from "react-icons/cg";
const AdminSidebar = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition ${
      isActive ? "bg-teal-500" : "hover:bg-white/20"
    }`;

  return (
    <div className="w-64 min-h-screen bg-gray-600 text-white flex flex-col shadow-lg">
      <div className="text-2xl font-bold p-[1.20rem] bg-teal-600 border-b border-teal-600">
        Employee MS
      </div>
      <nav className="flex flex-col gap-2 p-4">
        <NavLink to="/admin-dashboard" end className={navLinkClass}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin-dashboard/employees" className={navLinkClass}>
          <FaUser />
          <span>Employee</span>
        </NavLink>

        {/* <NavLink to="/admin-dashboard/departments" className={navLinkClass}>
          <FaBuilding />
          <span>Department</span>
        </NavLink> */}
        <NavLink to="/admin-dashboard/punch" className={navLinkClass}>
          <FaBuilding />
          <span>Attendence</span>
        </NavLink>

        {/* <NavLink to="/admin-dashboard/employee/leave" className={navLinkClass}>
          <FcLeave />
          <span>Leaves Apply</span>
        </NavLink> */}
        <NavLink
          to="/admin-dashboard/employee/leaveview"
          className={navLinkClass}
        >
          <CgDetailsMore />
          <span>Leaves Details</span>
        </NavLink>

        <NavLink to="/admin-dashboard/employee/salary" className={navLinkClass}>
          <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>

        {/* <NavLink to="/admin-dashboard/setting" className={navLinkClass}>
          <IoSettingsSharp />
          <span>Setting</span>
        </NavLink> */}
      </nav>
    </div>
  );
};

export default AdminSidebar;
