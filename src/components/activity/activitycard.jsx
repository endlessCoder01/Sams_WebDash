import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./TodayActivityCard.css";

const TodayActivityCard = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch("http://localhost:3000/task", { headers });
        const data = await response.json();

        if (!Array.isArray(data) || data.length !== 3) {
          throw new Error("Invalid API response. Expected array of 3 objects.");
        }

        const [taskRaw, userRaw, farmRaw] = data;

        // Ensure all are treated as arrays, even if only 1 item returned
        const tasksArray = Array.isArray(taskRaw) ? taskRaw : [taskRaw];
        const usersArray = Array.isArray(userRaw) ? userRaw : [userRaw];
        const farmsArray = Array.isArray(farmRaw) ? farmRaw : [farmRaw];

        // Build lookup maps
        const userMap = {};
        usersArray.forEach((u) => {
          userMap[u.user_id] = u.name;
        });

        const farmMap = {};
        farmsArray.forEach((f) => {
          farmMap[f.farm_id] = f.farm_name;
        });

        // Filter pending tasks and enrich
        const pendingTasks = tasksArray.filter(
          (task) => task.status === "pending"
        );

        const enriched = pendingTasks.map((task) => ({
          ...task,
          user_name: userMap[task.assigned_to] || "Unassigned",
          farm_name: farmMap[task.farm_id] || "Unknown",
        }));

        setTasks(enriched);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="activity-card">
      <h2 className="activity-title">Today's Activities</h2>
      <div className="scroll-area">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div className="task-card" key={task.task_id}>
              <div className="task-header">
                <h3>{task.task_description}</h3>
                <span className={`badge ${task.status}`}>{task.status}</span>
              </div>
              <p>
                <strong>Assigned to:</strong> {task.user_name}
              </p>
              <p>
                <strong>Scheduled:</strong>{" "}
                {dayjs(task.scheduled_date).format("MMM D, YYYY")}
              </p>
              <p>
                <strong>Farm:</strong> {task.farm_name}
              </p>
            </div>
          ))
        ) : (
          <p className="no-tasks">No pending tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default TodayActivityCard;
