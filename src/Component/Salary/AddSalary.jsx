import React, { useEffect, useState } from "react";
import AdminSidebar from "../Dashboard/AdminSidebar";
import Navbar from "../Dashboard/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSalary = () => {
  const url = "http://https://employee-backend-q7hn.onrender.com";

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [selectedEmp, setSelectedEmp] = useState({});
  const [edit, setEdit] = useState({
    empId: "",
    emp_name: "",
    Mrd: "",
    Des: "",
    Dept: "",
    Salary: "",
    allowances: "",
    deductions: "",
    payDate: "",
  });

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/salary/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setEdit((prev) => ({
            ...prev,
            empId: response.data.emp._id,
            emp_name: response.data.emp._id,
            Mrd: response.data.emp.Mrd || "",
            Des: response.data.emp.Des || "",
            Dept: response.data.emp.Dept || "",
          }));
          setSelectedEmp(response.data.emp);
        }
      } catch (error) {
        toast.error("Error fetching employee data");
      }
      setLoading(false);
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleDepart = async (e) => {
    const { value } = e.target;
    setEdit((prev) => ({ ...prev, Dept: value }));
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/salary/department/${value}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setEmployees(response.data.employees);
      } else {
        setEmployees([]);
        toast.warn("No employees found in selected department");
      }
    } catch (error) {
      console.error("Error fetching department employees:", error);
      toast.error("Error fetching department employees");
      setEmployees([]);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmp || !selectedEmp._id) {
      toast.warn("Please select an employee");
      return;
    }

    if (
      !edit.Salary ||
      !edit.allowances ||
      !edit.deductions ||
      !edit.payDate ||
      isNaN(edit.Salary) ||
      isNaN(edit.allowances) ||
      isNaN(edit.deductions)
    ) {
      toast.error("Please fill all fields correctly");
      return;
    }

    const totalSalary =
      parseFloat(edit.Salary) +
      parseFloat(edit.allowances) -
      parseFloat(edit.deductions);

    setLoading(true);
    try {
      const addResponse = await axios.post(
        `${url}/api/salary/add`,
        {
          empId: selectedEmp._id,
          mainEmpId: selectedEmp.emp_id,
          dept: selectedEmp.Dept,
          emp_name: selectedEmp.emp_name,
          basicSalary: parseFloat(edit.Salary),
          allowances: parseFloat(edit.allowances),
          deductions: parseFloat(edit.deductions),
          netSalary: totalSalary,
          payDate: edit.payDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (addResponse.data.success) {
        toast.success("Salary added successfully");
        setTimeout(() => {
          navigate("/admin-dashboard/employees");
        }, 2000);
      } else {
        toast.error(addResponse.data.error || "Failed to add salary");
      }
    } catch (error) {
      toast.error("Error processing salary");
    }
    setLoading(false);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gray-100">
          <div className="w-full">
            <Navbar />
          </div>
          <div className="m-10 p-5 rounded-md shadow-lg bg-white">
            {loading && <Loader />}
            <form onSubmit={handleSubmit}>
              <h1 className="text-2xl font-bold">Add Salary</h1>
              <div className="grid grid-cols-2 gap-5 mt-5">
                {/* Department */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Department</label>
                  <select
                    name="Dept"
                    className="border h-10 pl-2 text-lg border-gray-500 focus:outline-none rounded-[4px]"
                    onChange={handleDepart}
                    value={edit.Dept}
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    <option value="IT">IT</option>
                    <option value="Database">Database</option>
                    <option value="Meal">Meal</option>
                    <option value="Logistic">Logistic</option>
                  </select>
                </div>

                {/* Employee */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Employee</label>
                  <select
                    name="emp_name"
                    className="border h-10 pl-2 text-lg border-gray-500 focus:outline-none rounded-[4px]"
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selected = employees.find(
                        (emp) => emp._id === selectedId
                      );
                      setEdit({ ...edit, emp_name: selectedId });
                      setSelectedEmp(selected);
                    }}
                    value={edit.emp_name}
                    disabled={!employees.length}
                  >
                    <option value="" disabled>
                      Select Employee
                    </option>
                    {employees
                      .filter((emp) => emp.Dept === edit.Dept)
                      .map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.emp_name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Basic Salary */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Basic Salary</label>
                  <input
                    type="text"
                    name="Salary"
                    placeholder="Insert Salary"
                    className="border h-10 pl-2 text-lg border-gray-500 focus:outline-none rounded-[4px]"
                    onChange={handleChange}
                    value={edit.Salary}
                  />
                </div>

                {/* Allowances */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Allowances</label>
                  <input
                    type="text"
                    name="allowances"
                    placeholder="Monthly Allowances"
                    className="border h-10 pl-2 text-lg border-gray-500 focus:outline-none rounded-[4px]"
                    onChange={handleChange}
                    value={edit.allowances}
                  />
                </div>

                {/* Deductions */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Deductions</label>
                  <input
                    type="text"
                    name="deductions"
                    placeholder="Monthly Deductions"
                    className="border h-10 pl-2 text-lg border-gray-500 focus:outline-none rounded-[4px]"
                    onChange={handleChange}
                    value={edit.deductions}
                  />
                </div>

                {/* Pay Date */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Pay Date</label>
                  <input
                    type="date"
                    name="payDate"
                    className="border h-10 pl-2 text-lg border-gray-500 focus:outline-none rounded-[4px]"
                    onChange={handleChange}
                    value={edit.payDate}
                  />
                </div>
              </div>

              <div className="flex flex-col mt-7 gap-1">
                <button
                  type="submit"
                  className="bg-blue-500 rounded-sm p-2 text-white font-semibold text-lg"
                >
                  Add Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalary;
