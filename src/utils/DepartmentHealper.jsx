import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Component/Loader";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
];

export const DepartmentBtns = ({ _id, department, setDepartment }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {

    setLoading(true);
    try {
      const response = await axios.delete(
        `http://https://employee-backend-q7hn.onrender.com/api/department/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        } 
      );

      if (response.data.success) {
        // Filter out the deleted department from state
        const updatedDepartments = department.filter((dep) => dep._id !== _id);
        setDepartment(updatedDepartments);
      } else {
        alert("Failed to delete department");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.error ||
          "An error occurred while deleting the department"
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2 justify-center">
      {loading && <Loader />}
      <button
        className="px-3 py-1 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition duration-200"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition duration-200"
      >
        Delete
      </button>
    </div>
  );
};
