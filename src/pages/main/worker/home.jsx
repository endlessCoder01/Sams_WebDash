import React, { useState, useEffect } from "react";
import AgriNewsSlider from "../../../components/news2";
import TodayActivityCard from "../../../components/activity/activitycard";
import WeatherCard from "../../../components/weather";
import { fetchHomeData } from "../../../services/homeService";
import Swal from "sweetalert2";
import "./HomePage.css";
import TodayActivityCardWorker from "../../../components/activity/activitycardWorker";

const HomePageWorker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [farms, setFarms] = useState([]);
  const [myTasksCount, setMyTasksCount] = useState(0);
  const [tasks, setTasks] = useState();

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
    console.log("data from service", data);

    // await fetchTasks(); // 👈 runs AFTER fetchHomeData
    setAlerts(data.alerts);
    setFarms(data.farms);
    setMyTasksCount(data.myTasks.length);
  } catch (err) {
    Swal.fire("Error", "Failed to load home data", "error");
  }
};


    loadData();
  }, []);

  useEffect(() => {
  fetchTasks();
}, []);

const fetchTasks = async () => {
  console.log("➡️ fetchTasks called");
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user_id"));

    console.log("➡️ user:", user, "token:", token);

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const tasksRes = await fetch(`http://localhost:3000/task/user/${user}`, {
      headers,
    });

    if (!tasksRes.ok) {
      throw new Error(`Failed to fetch tasks: ${tasksRes.status}`);
    }

    const results = await tasksRes.json();
    console.log("✅ from tasks", results);

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
    <div className="home-container">
      <div className="content-row">
        {/* 🌤 Weather */}
        {/* <div className="left-column">
          <WeatherCard />
        </div> */}

        {/* ✅ Tasks */}
      {/* ✅ Tasks Section */}
<div className="right-column">
  <h5>📋 My Assigned Tasks ({myTasksCount})</h5>

  <div className="tasks-layout">
    {/* 👈 Left side - Today's Activities */}
    <div className="tasks-activities">
      <TodayActivityCardWorker searchTerm={searchTerm} />
    </div>

    {/* 👉 Right side - Task Count Summary */}
    <div className="tasks-summary">
      <div className="task-summary-card">
        <h4>✅ Completed</h4>
        <div className="task-count">
          {tasks ? tasks.filter((t) => t.status === "completed").length : 0}
        </div>
      </div>

      <div className="task-summary-card">
        <h4>📌 Pending</h4>
        <div className="task-count">
          {tasks ? tasks.filter((t) => t.status === "pending").length : 0}
        </div>
      </div>

      <div className="task-summary-card">
        <h4>❌ Cancelled</h4>
        <div className="task-count">
          {tasks ? tasks.filter((t) => t.status === "cancelled").length : 0}
        </div>
      </div>
    </div>
  </div>
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

export default HomePageWorker;
