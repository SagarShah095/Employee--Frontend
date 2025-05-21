import React from "react";
import {
  User,
  CalendarDays,
  ListTodo,
  Lock,
  Wallet,
  History,
  FilePlus,
  LayoutDashboard,
} from "lucide-react";
import { NavLink } from "react-router-dom";


const SidebarItem = ({ to, icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
        isActive
          ? "bg-teal-500 text-white shadow-md"
          : "text-gray-700 hover:bg-gray-100 hover:text-teal-600"
      }`
    }
  >
    <span className="text-xl">{icon}</span>
    <span className="text-base">{label}</span>
  </NavLink>
);
const EmployeeSidebar = () => {
  return (
    <div className="flex">
      <aside className="w-64 min-h-screen bg-white border-r p-6 shadow-lg">
        <nav className="space-y-2">
          <SidebarItem
            to="/employee-dashboard"
            icon={<LayoutDashboard />}
            label="Dashboard"
            end
          />
          <SidebarItem to="/employee/profile" icon={<User />} label="Profile" />
          <SidebarItem
            to="/employee/punch"
            icon={<CalendarDays />}
            label="Attendance"
          />
          {/* <SidebarItem to="/employee/tasks" icon={<ListTodo />} label="Tasks" /> */}
          <SidebarItem
            to="/employee/change-password"
            icon={<Lock />}
            label="Change Password"
          />
          <SidebarItem
            to="/employee/leave-history"
            icon={<History />}
            label="Leave History"
          />
          <SidebarItem
            to="/employee/apply-leave"
            icon={<FilePlus />}
            label="Apply Leave"
          />
          <SidebarItem
            to="/employee/salary-history"
            icon={<Wallet />}
            label="Salary History"
          />
        </nav>
      </aside>
    </div>
  );
};

export default EmployeeSidebar;

