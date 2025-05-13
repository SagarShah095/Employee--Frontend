import React from "react";
import SummaryCard from "./SummaryCard";
import { FaUsers } from "react-icons/fa";

const AdminSummary = () => {
  return (
    <div>
      <h3 className="text-[24px] font-semibold p-4">Dashboard Overview</h3>
      <div>
        <SummaryCard icon={<FaUsers />} text="Total Employees" number={13} />
      </div>
    </div>
  );
};

export default AdminSummary;

