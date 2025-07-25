import React, { useState } from "react";
import AgriNewsSlider from "../../../components/news2";
import TodayActivityCard from "../../../components/activity/activitycard";
import WeatherCard from "../../../components/weather";
import "./HomePage.css";

const alerts = [
  "Irrigation needed in Plot A",
  "New pest outbreak detected in maize field",
  "Low soil moisture in Plot B",
  "Upcoming inspection scheduled tomorrow at 10AM",
  "Weather warning: Heavy rains expected tonight",
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="home-container">
      {/* 🧱 Main Content Layout */}
      <div className="content-row">
        {/* 🌤️ Weather */}
        <div className="left-column">
          <WeatherCard />
        </div>

        {/* ✅ Tasks */}
        <div className="right-column">
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
          {alerts.map((alert, index) => (
            <div className="alert-item" key={index}>
              {alert}
            </div>
          ))}
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
