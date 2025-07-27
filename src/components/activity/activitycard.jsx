import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { MdPending, MdDone, MdCancel } from "react-icons/md";
import "./TodayActivityCard.css";
import TaskDetailModal from "../modals/taskdetail";
import Swal from "sweetalert2";

const TodayActivityCard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [farms, setFarms] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

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

        console.log("userdata", taskData)
        console.log("userdata", userData)
        console.log("userdata", farmData)
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

  const handleAssign = async (taskId, userId) => {
    try {
      const res = await fetch(`http://localhost:3000/task/${taskId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(dToken)}`,
        },
        body: JSON.stringify({ assigned_to: userId }),
      });

      if (!res.ok) throw new Error("Failed to assign");

      Swal.fire("Success", "Task assigned successfully!", "success");

      // Refresh task list
      const updatedTasks = tasks.map((task) =>
        task.task_id === taskId
          ? {
              ...task,
              assigned_to: userId,
              user_name: users.find((u) => u.user_id === Number(userId))?.name,
            }
          : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      Swal.fire("Error", "Failed to assign task.", "error");
    }
  };

  return (
    <div className="activity-card">
      <h2 className="activity-title">Today's Activities</h2>
      <div className="scroll-area">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              className="task-card"
              key={task.task_id}
              onClick={() => setSelectedTask(task)}
            >
              <div className="task-header">
                <h3>{task.task_description}</h3>
                <span className={`badge ${task.status.toLowerCase()}`}>
                  {getStatusIcon(task.status)} {task.status}
                </span>
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
          <p className="no-tasks">No tasks found.</p>
        )}
      </div>
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
};

export default TodayActivityCard;
