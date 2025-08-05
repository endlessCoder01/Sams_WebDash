import React, { useState, useEffect } from "react";
import AgriNewsSlider from "../../../components/news2";
import TodayActivityCard from "../../../components/activity/activitycard";
import WeatherCard from "../../../components/weather";
import { fetchHomeData } from "../../../services/homeService";
import Swal from "sweetalert2";
import "./HomePage.css";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [farms, setFarms] = useState([]);
  const [myTasksCount, setMyTasksCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const user = JSON.parse(localStorage.getItem("user_id"));
        if (!user) {
          Swal.fire("Error", "User not logged in", "error");
          return;
        }

        const data = await fetchHomeData(user, token);
        setAlerts(data.alerts);
        setFarms(data.farms);
        setMyTasksCount(data.myTasks.length);
      } catch (err) {
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
        <div className="right-column">
          <div className="task-summary-card">
            <h4>📋 My Assigned Tasks</h4>
            <p className="task-count">{myTasksCount}</p>
          </div>
          <TodayActivityCard searchTerm={searchTerm} />
        </div>

        {/* 🚨 Alerts */}
        <div className="alerts-panel">
          {/* 🔍 Top Search Bar */}
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
    </div>
  );
};

export default HomePage;
