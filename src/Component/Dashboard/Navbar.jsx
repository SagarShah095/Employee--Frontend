import React, { useState } from "react";
import { useAuth } from "./../../Context/authContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    window.location.href = "/login";
  };

  return (
    <div className="bg-teal-600 text-white px-6 py-4 flex justify-between items-center w-full relative">
      <p className="text-2xl">
        Welcome, {user?.emp_name || user?.name || "User"}
      </p>
      <button
        onClick={() => setShowLogoutModal(true)}
        className="bg-white text-teal-600 font-semibold px-4 py-2 rounded hover:bg-teal-700 hover:text-white transition"
      >
        Logout
      </button>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white text-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all scale-100">
            <h2 className="text-xl font-bold mb-2 text-gray-900">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
