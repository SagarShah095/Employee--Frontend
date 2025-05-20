import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import Loader from "../Component/Loader";

const Login = () => {
  const url = "https://employee-backend-q7hn.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  console.log(error, "login in login page");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First try admin login
      const adminRes = await axios.post(`${url}/api/auth/login`, {
        email,
        password,
      });

      if (adminRes.data.success && adminRes.data.user?.role === "admin") {
        const user = adminRes.data.user;
        login(user);
        localStorage.setItem("token", adminRes.data.token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/admin-dashboard");
        return;
      }
      console.log(adminRes.data,"Admin login failed, trying employee login...");
    } catch (err) {
      // Ignore admin error; fall through to employee
    }


    try {
      // Then try employee login
      const empRes = await axios.post(`${url}/api/employee/EmpLogin`, {
        email,
        password,
      });

      console.log("Employee Login Response:", empRes.data);

      if (empRes.data.success && empRes.data.user?.role === "employee") {
        const user = empRes.data.user;
        login(user);
        localStorage.setItem("token", empRes.data.token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/employee-dashboard");
      } else {
        setError("Invalid credentials or unknown role");
      }
    } catch (error) {
      if (error.response?.data) {
        setError(error.response.data.error || "Invalid email or password");
      } else {
        setError("Server Error");
      }
    }

    setLoading(false);
  };

  // const fetchData = async () => {
  //   try {
  // const response = await axios.get(`${url}/api/auth/emplogin`, {

  //     });
  //     if (response.data.success) {
  //       console.log(response.data, "Data fetched successfully");
  //       setData(response.data.allData);
  //     } else {
  //       console.log(response.data, "Failed to fetch data");
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.data) {
  //       setError(error.response.data.error || "Email or Pass wrong");
  //     } else {
  //       setError("Server Error");
  //     }
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {loading && <Loader />}
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600 font-Alegreya">
          Employee
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold text-gray-700">Login</h3>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="******"
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
