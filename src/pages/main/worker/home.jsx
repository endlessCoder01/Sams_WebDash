import React, { useState, useEffect } from "react";
import AgriNewsSlider from "../../../components/news2";
import TodayActivityCardWorker from "../../../components/activity/activitycardWorker";
import { fetchHomeData } from "../../../services/homeService";
import Swal from "sweetalert2";
import ChatPage from "../../chatbot/ChatPage"; 
import "../../../styles/HomePageWorker.css";

const HomePageWorker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [farms, setFarms] = useState([]);
  const [myTasksCount, setMyTasksCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [showChat, setShowChat] = useState(false); // ✅ toggle chatbot

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user_id"));
        if (!user) {
          Swal.fire("Error", "User not logged in", "error");
          return;
        }

        const data = await fetchHomeData(user, token);
        setAlerts(data.alerts ?? []);
        setFarms(data.farms ?? []);
        setMyTasksCount(data.myTasks.length ?? 0);
      } catch (err) {
        Swal.fire("Error", "Failed to load home data", "error");
      }
    };

    loadData();
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user_id"));

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const res = await fetch(`http://localhost:3000/task/user/${user}`, {
        headers,
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);

      const results = await res.json();
      setTasks(sortTasks(results));
    } catch (err) {
      console.error("❌ fetchTasks error:", err);
    }
  };

  const sortTasks = (tasks) => {
    const order = { pending: 1, completed: 2, cancelled: 3 };
    return [...tasks].sort((a, b) => order[a.status] - order[b.status]);
  };

  return (
    <div className="worker-home-container">
      <div className="worker-content-row">
        {/* ✅ Tasks Section */}
        <div className="worker-right-column">
          <h5>📋 My Assigned Tasks ({myTasksCount})</h5>

          <div className="tasks-layout">
            {/* 👈 Left side - Task list */}
            <div className="tasks-activities">
              <TodayActivityCardWorker searchTerm={searchTerm} />
            </div>

            {/* 👉 Right side - Task summary cards */}
            <div className="tasks-summary">
              <div className="task-summary-card completed">
                <h4>✅ Completed</h4>
                <div className="task-count">
                  {tasks.filter((t) => t.status === "completed").length}
                </div>
              </div>

              <div className="task-summary-card pending">
                <h4>📌 Pending</h4>
                <div className="task-count">
                  {tasks.filter((t) => t.status === "pending").length}
                </div>
              </div>

              <div className="task-summary-card cancelled">
                <h4>❌ Cancelled</h4>
                <div className="task-count">
                  {tasks.filter((t) => t.status === "cancelled").length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🚨 Alerts */}
        <div className="alerts-panel">
          <div className="top-bar">
            <input
              type="text"
              className="search-bar"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <h3>Alerts</h3>
          {alerts.length > 0 ? (
            alerts
              .filter(
                (alert) =>
                  alert.message.toLowerCase().includes(searchTerm) ||
                  alert.farm_name.toLowerCase().includes(searchTerm)
              )
              .map((alert) => (
                <div className="alert-item" key={alert.alert_id}>
                  <strong>{alert.farm_name}</strong> — {alert.message}
                </div>
              ))
          ) : (
            <p className="no-alerts">No alerts available</p>
          )}
        </div>

        {/* 📰 News */}
        <div className="bottom-row">
          <AgriNewsSlider />
        </div>
      </div>

      {/* 💬 Floating Chat Button */}
      <button
        className="chat-float-btn"
        onClick={() => setShowChat((prev) => !prev)}
      >
        💬
      </button>

      {/* 📱 Chat Overlay */}
      {showChat && (
        <div className="chat-overlay">
          <ChatPage onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  );
};

export default HomePageWorker;
