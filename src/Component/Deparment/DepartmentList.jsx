import React, { useEffect, useState } from "react";
import AdminSidebar from "../Dashboard/AdminSidebar";
import Navbar from "../Dashboard/Navbar";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import { DepartmentBtns } from "../../utils/DepartmentHealper";
import { columns } from "./../../utils/DepartmentHealper";
import Loader from "../Loader";

const DepartmentList = ({ setDepartment, department }) => {
  const [loading, setLoading] = useState(false);
  const [depLoading, setDepLoading] = useState(false);

  const url = "http://localhost:4000";

  useEffect(() => {
    const fetchData = async () => {
      setDepLoading(true);
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/department`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: (
              <DepartmentBtns
                department={department}
                setDepartment={setDepartment}
                _id={dep._id}
              />
            ),
          }));
          setDepartment(data);
        }
        setLoading(false);
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error || "Error fetching departments");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div>
        <div className="flex">
          <AdminSidebar />
          <div className="w-full bg-gray-100">
            <div className="w-full">
              <Navbar />
            </div>
            <div className="p-5">
              <div className="text-center">
                <h3 className="text-2xl font-bold">Manage Department</h3>
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Search By Dep Name"
                  className="px-4 py-0.5 border"
                />
                <Link
                  to="/admin-dashboard/add-department"
                  className="px-4 py-1 bg-teal-600 text-white rounded"
                >
                  Add New Department
                </Link>
              </div>
              <div>
                <DataTable columns={columns} data={department} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DepartmentList;
