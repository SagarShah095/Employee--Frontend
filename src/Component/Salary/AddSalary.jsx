import React, { useEffect, useState } from "react";
import AdminSidebar from "../Dashboard/AdminSidebar";
import Navbar from "../Dashboard/Navbar";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";

const AddSalary = () => {
  const url = "https://employee-backend-q7hn.onrender.com";

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [selectedEmp, setSelectedEmp] = useState({});
  console.log(selectedEmp, "my name is selectedEmp");

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

  // console.log(employees, "my name is emp");
  // console.log(edit, "my name is edit");

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
            emp_name: response.data.emp.emp_name,
            Mrd: response.data.emp.Mrd || "",
            Des: response.data.emp.Des || "",
            Dept: response.data.emp.Dept || "",
          }));
        }
        setLoading(false);
      } catch (error) {
        if (error.response && !error.response.data.success) {
          console.log(
            error.response.data.error || "Error fetching employee data"
          );
        }
      }
      setLoading(false);
    };
    fetchData();
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

      // console.log(response, "my name is response");

      if (response.data.success) {
        setEmployees(response.data.employees); // Set the list of employees from the department
      } else {
        setEmployees([]); // If no employees, clear the list
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching department employees:", error);
      setEmployees([]); // Clear the employee list if there's an error
    }
    setLoading(false);
  };

  // console.log(employees, "my name is setEmployees");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const totalSalary =
      parseFloat(edit.Salary) +
      parseFloat(edit.allowances) -
      parseFloat(edit.deductions);
    
    setLoading(true);
    try {
      // Step 1: Check if salary data already exists for selected employee
      const checkResponse = await axios.get(
        `${url}/api/salary/employee/${selectedEmp._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      // Check match by name
      if (
        checkResponse.data.success &&
        checkResponse.data.data &&
        checkResponse.data.data.empId.emp_name === selectedEmp.emp_name
      ) {
        // Update existing salary
        const updateResponse = await axios.put(
          `${url}/api/salary/update/${selectedEmp._id}`, // assume you have this route
          {
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
  
        if (updateResponse.data.success) {
          navigate("/admin-dashboard/employees");
        } else {
          console.log("Failed to update salary");
        }
      } else {
        // Add new salary
        const addResponse = await axios.post(
          `${url}/api/salary/add`,
          {
            empId: selectedEmp._id,
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
          navigate("/admin-dashboard/employees");
        } else {
          console.log("Failed to add salary");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error occurred in AddSalary:", error);
      if (error.response) {
        console.log(error.response.data.error || "Error processing salary");
      } else {
        console.log("An error occurred");
      }
    }
    setLoading(false);
  };
  

  return (
    <div>
      {loading && <Loader />}
      <div className="flex">
        <AdminSidebar />
        <div className="w-full bg-gray-100">
          <div className="w-full">
            <Navbar />
          </div>
          <div className="m-10 p-5 rounded-md shadow-lg bg-white">
            <form onSubmit={handleSubmit}>
              <div>
                <h1 className="text-2xl font-bold">Add Salary</h1>
              </div>
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
                    <option value="IT">I T</option>
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
                      console.log(e.target.value, "my name is e.target");
                      const selectedId = e.target.value;
                      const selected = employees.find(
                        (emp) => emp._id === selectedId
                      );
                      setEdit({ ...edit, emp_name: selectedId }); // or update your state correctly
                      setSelectedEmp(selected); // ✅ set it only on change
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
                <div className="flex flex-col w-full mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 rounded-sm p-2 text-white font-semibold text-lg"
                  >
                    Add Salary
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalary;
