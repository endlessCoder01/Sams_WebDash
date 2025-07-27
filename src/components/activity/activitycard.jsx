import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { MdPending, MdDone, MdCancel } from "react-icons/md";
import "./TodayActivityCard.css";

const TodayActivityCard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [farms, setFarms] = useState([]);
  const dToken = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${JSON.parse(dToken)}`,
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [tasksRes, usersRes, farmsRes] = await Promise.all([
          fetch("http://localhost:3000/task", { headers }),
          fetch("http://localhost:3000/users", { headers }),
          fetch("http://localhost:3000/farms", { headers }),
        ]);

        const [taskData, userData, farmData] = await Promise.all([
          tasksRes.json(),
          usersRes.json(),
          farmsRes.json(),
        ]);

        const userMap = {};
        userData.forEach((u) => {
          userMap[u.user_id] = u.name || "Unnamed User";
        });

        const farmMap = {};
        farmData.forEach((f) => {
          farmMap[f.farm_id] = f.farm_name || "Unnamed Farm";
        });

        const enrichedTasks = taskData.map((task) => ({
          ...task,
          user_name: userMap[task.assigned_to] || "Unassigned",
          farm_name: farmMap[task.farm_id] || "Unknown",
        }));

        setTasks(enrichedTasks);
        setUsers(userData);
        setFarms(farmData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchAllData();
  }, []);

  const getStatusIcon = (status) => {
    const s = status.toLowerCase();
    if (s === "pending") return <MdPending />;
    if (s === "done") return <MdDone />;
    if (s === "cancelled") return <MdCancel />;
    return null;
  };

  return (
    <div className="activity-card">
      <h2 className="activity-title">Today's Activities</h2>
      <div className="scroll-area">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div className="task-card" key={task.task_id}>
              <div className="task-header">
                <h3>{task.task_description}</h3>
                <span className={`badge ${task.status.toLowerCase()}`}>
                  {getStatusIcon(task.status)} {task.status}
                </span>
              </div>
              <p><strong>Assigned to:</strong> {task.user_name}</p>
              <p><strong>Scheduled:</strong> {dayjs(task.scheduled_date).format("MMM D, YYYY")}</p>
              <p><strong>Farm:</strong> {task.farm_name}</p>
            </div>
          ))
        ) : (
          <p className="no-tasks">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default TodayActivityCard;
