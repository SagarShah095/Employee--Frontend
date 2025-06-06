import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Navbar from "../Component/Dashboard/Navbar";
import EmployeeSidebar from "../Component/EmpSide/EmployeeSidebar";
import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom";
import TourManager from "../shared/TourManager";
import Loader from "../Component/Loader";

const socket = io("https://employee-backend-q7hn.onrender.com");

function EmpNotifications() {
  const { user } = useAuth();
  const userId = user?._id;
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `https://employee-backend-q7hn.onrender.com/api/notifications/${userId}`
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `https://employee-backend-q7hn.onrender.com/api/notifications/unread-count/${userId}`
      );
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      const res = await axios.put(
        `https://employee-backend-q7hn.onrender.com/api/notifications/mark-all-read/${userId}`
      );
      console.log(res.data);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchUnreadCount();
    }

    socket.on("newProjectNotification", (data) => {
      console.log("New notification received via socket:", data);
      fetchNotifications();
      fetchUnreadCount();
    });

    return () => {
      socket.off("newProjectNotification");
    };
  }, [userId]);

  const steps = [
    {
      id: "page9-step",
      text: "🎉 This is the Notification page, here is you can check your all notificaton. You’ve completed the onboarding!",
      attachTo: { element: ".page9-end-btn", on: "top" },
      nextRoute: "/employee-dashboard",
      buttons: [
        {
          text: "End",
          action: () => {
            localStorage.setItem("tour_page9_done", "true");
            window.__tour__?.complete();
          },
        },
      ],
    },
  ];

  const resetTour = () => {
    for (let i = 1; i <= 9; i++) {
      localStorage.removeItem(`tour_page${i}_done`);
    }
    navigate("/employee-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-100 to-white">
      <TourManager steps={steps} pageKey="page9" />
      <Navbar />
      <div className="flex flex-1">
        <EmployeeSidebar />
        <div className="flex-1 p-8 overflow-y-auto ">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            onClick={resetTour}
          >
            🔁 Reset Tour
          </button>
          <div className="flex justify-between items-center gap-10 ">
            <h2 className="text-2xl font-bold mb-4">🔔 Notifications</h2>

            <div className="flex items-center mb-4">
              <button
                onClick={markAllAsRead}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Mark All as Read
              </button>
              {unreadCount > 0 && (
                <span className="ml-4 bg-red-500 text-white px-3 py-1 rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : notifications.length === 0 ? (
            <p className="text-gray-500 italic">No notifications available.</p>
          ) : (
            <ul className="page9-end-btn">
              {notifications.map((n, index) => (
                <li
                  key={index}
                  className={`border-b p-3 my-2 rounded ${
                    !n.read ? "font-[800]" : "font-[500]"
                  }`}
                >
                  <div
                    className=" cursor-pointer inline-block"
                    onClick={async () => {
                      try {
                        await axios.put(
                          `https://employee-backend-q7hn.onrender.com/api/notifications/mark-read/${n._id}`
                        );
                        setNotifications((prev) =>
                          prev.map((item) =>
                            item._id === n._id ? { ...item, read: true } : item
                          )
                        );
                        navigate(`/employee/my-project/${n?.projectId}`);
                      } catch (err) {
                        console.error(
                          "Error marking notification as read:",
                          err
                        );
                      }
                    }}
                  >
                    {n.message}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmpNotifications;
