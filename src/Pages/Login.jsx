import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import Loader from "../Component/Loader";

const Login = () => {
  const url = "https://employee-backend-q7hn.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, verifyUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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
    } catch (err) {
      // Ignore admin error; fall through to employee
    }

    try {
      const empRes = await axios.post(`${url}/api/employee/EmpLogin`, {
        email,
        password,
      });
      console.log(empRes, "emp res");
      if (empRes.data.success && empRes.data.user?.role === "employee") {
        const user = empRes.data.user;
        login(user);
        localStorage.setItem("token", empRes.data.token);
        localStorage.setItem("user", JSON.stringify(user));
        verifyUser();
        navigate("/employee-dashboard");
      } else {
        setError("Invalid credentials or unknown role");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data) {
        setError(error.response.data.error || "Invalid email or password");
      } else {
        setError("Server Error");
      }
    }

    setLoading(false);
  };

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
          <Link
            to={"/forget-password"}
            className="text-[14px] font-[500] hover:underline cursor-pointer text-black/60"
          >
            Forget Password ?
          </Link>

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
