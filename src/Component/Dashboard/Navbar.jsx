import React from "react";
import { useAuth } from "./../../Context/authContext";

const Navbar = () => {
  const { user } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="bg-teal-600 text-white px-6 py-4 flex justify-between items-center w-full">
      <p className="text-2xl">Welcome, {user?.name}</p>
      <button onClick={handleLogout} className="bg-white text-teal-600 font-semibold px-4 py-2 rounded hover:bg-teal-700 hover:text-white transition">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
