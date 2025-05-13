import React, { useEffect, useState } from "react";
import AdminSidebar from "../Dashboard/AdminSidebar";
import Navbar from "../Dashboard/Navbar";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";

const List = () => {

  const {id} = useParams();

  const url = "https://employee-backend-q7hn.onrender.com";

  const [empData, setEmpData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          console.log(response.data.Emp, "response data");
          setEmpData(response.data.Emp);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading && <Loader/>}
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
                placeholder="Search By Dep Name/"
                className="px-4 py-0.5 border"
              />
              <Link
                to="/admin-dashboard/add-employee"
                className="px-4 py-1 bg-teal-600 text-white rounded"
              >
                Add New Department
              </Link>
            </div>
          </div>
          <div className="p-5">
            <div className="relative overflow-x-auto rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                <thead className="text-xs text-black border shadow-sm uppercase bg-white">
                  <tr>
                    <th scope="col" className="px-6 text-lg py-3">
                      S No
                    </th>
                    <th scope="col" className="px-6 text-lg py-3">
                      Image
                    </th>
                    <th scope="col" className="px-6 text-lg py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 text-lg py-3">
                      Dob
                    </th>
                    <th scope="col" className="px-6 text-lg py-3">
                      Department
                    </th>

                    <th scope="col" className="px-6 text-lg py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {empData?.map((emp, i) => (
                    <tr
                      key={i}
                      className="bg-white border-b  text-black border-gray-200 hover:bg-gray-50 "
                    >
                      <th
                        scope="row"
                        className="px-6 text-base py-4 font-medium text-black whitespace-nowrap "
                      >
                        {i + 1}
                      </th>
                      <td className="px-6 text-base py-4">
                        <img
                          src={`${url}/${emp.Img}`}
                          alt={emp.emp_name}
                          className="w-12 h-12 rounded-full"
                        />
                      </td>
                      <td className="px-6 text-base py-4">{emp.emp_name}</td>
                      <td className="px-6 text-base py-4">
                        {emp.dob
                          ? new Date(emp.dob).toLocaleDateString("en-GB")
                          : ""}{" "}
                      </td>
                      <td className="px-6 text-base py-4">{emp.Dept}</td>
                      <td className="flex items-center gap-2 px-2 py-4">
                        <div
                          to="/admin-dashboard/employee/view"
                          className="font-medium bg-blue-500 px-3 py-2 text-white rounded-lg hover:underline"
                          onClick={() =>
                            navigate(`/admin-dashboard/employee/${emp._id}`)
                          }
                        >
                          View
                        </div>
                        <NavLink
                          href="#"
                          className="font-medium text-white px-3 py-2 rounded-lg bg-teal-500 hover:underline mr-3"
                          to={`/admin-dashboard/employee/edit/${emp._id}`}
                        >
                          Edit
                        </NavLink>
                        <NavLink
                          to={`/admin-dashboard/employee/salary/${emp._id}`}
                          href="#"
                          className="font-medium bg-yellow-500 px-3 py-2 text-white rounded-lg hover:underline"
                        >
                          Salary
                        </NavLink>
                        <NavLink
                          to={`/admin-dashboard/employee/leave/${emp._id}`}
                          className="font-medium bg-red-500 px-3 py-2 text-white rounded-lg hover:underline"
                        >
                          Leave
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
