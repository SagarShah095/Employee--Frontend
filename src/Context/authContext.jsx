import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const url = "http://localhost:4000";

  // 🔥 Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const verifyUser = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // ✅ Check for missing token or user
      if (!token || !storedUser) {
        console.warn("No token or user found in localStorage during verifyUser.");
        setLoading(false); // Instead of logout, just end loading
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const { role, _id: userId } = parsedUser;

      if (!role || !userId) {
        console.warn("Invalid user data in localStorage during verifyUser.");
        setLoading(false);
        return;
      }

      let endpoint = "";
      if (role === "admin") {
        endpoint = `${url}/api/auth/verify`;
      } else if (role === "employee") {
        endpoint = `${url}/api/employee/verify/${userId}`;
      } else {
        console.warn("Unknown user role:", role);
        setLoading(false);
        return;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("User verified successfully:", response.data.user);
      } else {
        console.warn("Verification failed from server.");
        logout();
      }
    } catch (error) {
      console.error("Error verifying user:", error.response?.data || error.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
