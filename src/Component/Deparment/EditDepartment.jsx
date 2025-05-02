import React, { useEffect, useState } from "react";
import AdminSidebar from "../Dashboard/AdminSidebar";
import Navbar from "../Dashboard/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";

const EditDepartment = () => {

  const url = "https://employee-backend-q7hn.onrender.com";

  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  //   const [department, setDepartment] = useState([]);
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });

  const navigate = useNavigate();

    // console.log(department, "++++++")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${url}/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setDepartment(response.data.department);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("department data");
      const response = await axios.put(
        `${url}/api/department/${id}`,
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        console.log(response.data, "Department updated successfully");
        alert("Department updated successfully");
        navigate("/admin-dashboard/departments");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error occurred:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Axios config error:", error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      {loading&& <Loader />}
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gray-100 ">
          <div className="w-full">
            <Navbar />
          </div>

          {/* add */}
          <div className="max-w-md mx-auto mt-36 p-6 bg-white shadow-md  rounded-lg">
            <div>
              <h3 className="text-2xl  font-semibold text-black mb-6">
                Edit New Department
              </h3>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="dep_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Department Name
                  </label>
                  <input
                    type="text"
                    id="dep_name"
                    name="dep_name"
                    value={department.dep_name}
                    placeholder="Enter Department Name"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={department.description}
                    placeholder="Description"
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="submit"
                  onClick={() => navigate("/admin-dashboard/departments")}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Edit Department
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;
