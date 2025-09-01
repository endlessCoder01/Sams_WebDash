import React, { useState, useEffect } from "react";
import AgriNewsSlider from "../../../components/news2";
import TodayActivityCard from "../../../components/activity/activitycard";
import WeatherCard from "../../../components/weather";
import { fetchHomeData } from "../../../services/homeService";
import Swal from "sweetalert2";
import ChatPage from "../../chatbot/ChatPage"; 
import "./HomePageF.css";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [farms, setFarms] = useState([]);
  const [myTasksCount, setMyTasksCount] = useState(0);
  const [showChat, setShowChat] = useState(false); // ✅ toggle ChatPage

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user_id"));
        if (!user || !token) {
          Swal.fire("Error", "User not logged in", "error");
          return;
        }

        const data = await fetchHomeData(user, token);
        setAlerts(data.alerts ?? []);
        setFarms(data.farms ?? []);
        setMyTasksCount(data.myTasks.length ?? 0);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load home data", "error");
      }
    };

    loadData();
  }, []);

  return (
    <div className="home-container">
      <div className="content-row">
        {/* 🌤 Weather */}
        <div className="left-column">
          <WeatherCard />
        </div>

        {/* ✅ Tasks */}
        <TodayActivityCard searchTerm={searchTerm} />

        {/* 🚨 Alerts */}
        <div className="alerts-panel">
          <div className="top-bar">
            <input
              type="text"
              className="search-bar"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <h3>Alerts</h3>
          {alerts.length > 0 ? (
            alerts.map((alert) => (
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

      {/* 📱 Show ChatPage as overlay */}
      {showChat && (
        <div className="chat-overlay">
          <ChatPage onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
