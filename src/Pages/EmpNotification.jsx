import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Navbar from "../Component/Dashboard/Navbar";
import EmployeeSidebar from "../Component/EmpSide/EmployeeSidebar";
import { useAuth } from "../Context/authContext";

const socket = io("http://localhost:4000"); // Backend URL

function EmpNotifications() {
const {user} = useAuth()
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load initial notifications
    axios
      .get(`http://localhost:4000/api/notification/${user?._id}`)
      .then((res) => setNotifications(res.data));

    // Listen for real-time events
    socket.on("newProjectNotification", (data) => {
      setNotifications((prev) => [
        { message: data.message, createdAt: new Date(), type: "new_project" },
        ...prev,
      ]);
    });

    return () => {
      socket.off("newProjectNotification");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-100 to-white">
      <Navbar />
      <div className="flex flex-1">
        <EmployeeSidebar />

        <div className="flex-1 p-8 overflow-y-auto"></div>
        <button>🔔 ({notifications.length})</button>
        <div>
          <button>🔔 ({notifications.length})</button>
          <ul>
            {notifications.map((n, i) => (
              <li key={i}>
                {n.message} - {new Date(n.createdAt).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
      s
    </div>
  );
}

export default EmpNotifications;
