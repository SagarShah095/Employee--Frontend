// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const url = "http://localhost:5000";

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Stored token:", token);

        if (!token) {
          console.log("No token found");
          // setUser(null);
          return;
        }

        const userFromStorage = JSON.parse(localStorage.getItem("user"));
        const role = userFromStorage?.role;
        const userId = userFromStorage?._id;

        if (!role || !userId) {
          console.log("User or role missing in localStorage");
          // setUser(null);
          return;
        }

        let endpoint = "";
        if (role === "admin") {
          endpoint = `${url}/api/auth/verify`;
        } else if (role === "employee") {
          endpoint = `${url}/api/employee/verify/${userId}`;
        } else {
          console.log("Unknown role");
          setUser(null);
          return;
        }

        console.log("Verifying via:", endpoint);

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          console.log("Verification failed from server");
          // setUser(null);
        }
      } catch (error) {
        console.log(
          "Verify user error:",
          error.response?.data || error.message
        );
        // setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
