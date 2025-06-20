import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import RouterRoutes from "./utils/RouterRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./Component/Dashboard/AdminSummary";
import DepartmentList from "./Component/Deparment/DepartmentList";
import EmployeeDashboard from "./Component/EmpSide/EmployeeDashboard";
import AdminSidebar from "./Component/Dashboard/AdminSidebar";
import AddDipartment from "./Component/Deparment/AddDipartment";
import EditDepartment from "./Component/Deparment/EditDepartment";
import List from "./Component/employee/List";
import Add from "./Component/employee/Add";
import Edit from "./Component/employee/Edit";
import AddSalary from "./Component/Salary/AddSalary";
import EmployeeView from "./Component/employee/EmployeeView";
import SalaryView from "./Component/employee/SalaryView";
import LeaveAdd from "./Component/Leaves/LeaveAdd";
import LeaveView from "./Component/Leaves/LeaveView";
import LeaveDetails from "./Component/Leaves/LeaveDetails";
import EmpProfile from "./Component/EmpSide/EmpProfile";
import EmpChangePass from "./Component/EmpSide/EmpChangePass";
import EmpLeave from "./Component/EmpSide/EmpLeave";
import EmpLeaveApply from "./Component/EmpSide/EmpLeaveApply";
import SalaryHistory from "./Component/EmpSide/SalaryHistory";
import Attendance from "./Component/Attendance/Attendance";
import EmpPunch from "./Component/EmpSide/EmpPunch";
import Project from "./Pages/Project";
import AddProject from "./Pages/AddProject";
import ProjectDetail from "./Pages/ProjectDetails";
import EditProject from "./Pages/EditProject";
import EmployeeProjectDetail from "./Pages/EmpProjectDetail";
import EmployeeSingleProjectDetail from "./Pages/EmployeeSingleProjectDetail";
import EmpNotifications from "./Pages/EmpNotification";
import ForgotPassword from "./Pages/ForgetPassword";
import ResetPassword from "./Pages/ResetPass";

function App() {
  const [department, setDepartment] = useState([]);
  const [addEmp, setAddEmp] = useState({
    emp_name: "",
    email: "",
    emp_id: "",
    dob: "",
    Gen: "",
    Mrd: "",
    Des: "",
    Dept: "",
    Salary: "",
    Pass: "",
    Role: "",
    Img: "",
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/admin-dashboard"
          element={
            <RouterRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </RouterRoutes>
          }
        >
          <Route path="/admin-dashboard" element={<AdminSummary />} />
        </Route>
        <Route
          path="/admin-dashboard/departments"
          element={
            <DepartmentList
              department={department}
              setDepartment={setDepartment}
            />
          }
        />
        <Route
          path="/admin-dashboard/add-department"
          element={<AddDipartment />}
        />
        <Route
          path="/admin-dashboard/department/:id"
          element={<EditDepartment />}
        />
        <Route
          path="/admin-dashboard/employees"
          element={<List addEmp={addEmp} setAddEmp={setAddEmp} />}
        />
        <Route
          path="/admin-dashboard/add-employee"
          element={<Add addEmp={addEmp} setAddEmp={setAddEmp} />}
        />
        <Route
          path="/admin-dashboard/employee/:id"
          element={<EmployeeView />}
        />
        <Route path="/admin-dashboard/employee/edit/:id" element={<Edit />} />
        <Route
          path="/admin-dashboard/employee/salary/:id"
          element={<SalaryView />}
        />

        <Route
          path="/admin-dashboard/employee/salary"
          element={<AddSalary />}
        />
        <Route
          path="/admin-dashboard/employee/leaveview"
          element={<LeaveView />}
        />
        <Route path="/admin-dashboard/employee/leave" element={<LeaveAdd />} />
        <Route
          path="/admin-dashboard/employee/leave/:id"
          element={<LeaveDetails />}
        />
        <Route path="/admin-dashboard/punch" element={<Attendance />} />

        <Route path="/admin-dashboard/project" element={<Project />} />
        <Route
          path="/admin-dashboard/project/edit/:id"
          element={<EditProject />}
        />
        <Route
          path="/admin-dashboard/project/:id"
          element={<ProjectDetail />}
        />
        <Route path="/admin-dashboard/project/new" element={<AddProject />} />

        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route
          path="/employee/my-project"
          element={<EmployeeProjectDetail />}
        />

        <Route
          path="/employee/my-project/:id"
          element={<EmployeeSingleProjectDetail />}
        />
        <Route path="/employee/profile" element={<EmpProfile />} />
        <Route path="/employee/change-password" element={<EmpChangePass />} />
        <Route path="/employee/leave-history" element={<EmpLeave />} />
        <Route path="/employee/apply-leave" element={<EmpLeaveApply />} />
        <Route path="/employee/salary-history" element={<SalaryHistory />} />
        <Route path="/employee/punch" element={<EmpPunch />} />
        <Route path="/employee/notification" element={<EmpNotifications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
