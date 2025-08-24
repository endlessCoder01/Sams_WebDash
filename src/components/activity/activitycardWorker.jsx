import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { MdPending, MdDone, MdCancel } from "react-icons/md";
import "./TodayActivityCard.css";
import Swal from "sweetalert2";
import TaskDetailModalWorker from "../modals/taskdetailWorker";

const TodayActivityCardWorker = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [farms, setFarms] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const dToken = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user_id"));

  const headers = {
    Authorization: `Bearer ${dToken}`,
  };

useEffect(() => {
  const fetchAllData = async () => {
    try {
      const [tasksRes, userRes, farmsRes] = await Promise.all([
        fetch("http://localhost:3000/task", { headers }),
        fetch(`http://localhost:3000/users/${user}`, { headers }),
        fetch("http://localhost:3000/farms", { headers }),
      ]);

      const [taskData, userData, farmData] = await Promise.all([
        tasksRes.json(),
        userRes.json(),
        farmsRes.json(),
      ]);

      console.log("taskdata", taskData);
      console.log("userdata", userData);
      console.log("farmdata", farmData);

      const farmMap = {};
      farmData.forEach((f) => {
        farmMap[f.farm_id] = f.farm_name || "Unnamed Farm";
      });

      // ✅ filter tasks for current user
      const userTasks = taskData
        .filter((task) => task.assigned_to === userData.user_id)
        .map((task) => ({
          ...task,
          user_name: userData.name,
          farm_name: farmMap[task.farm_id] || "Unknown",
        }));

      // ✅ custom sort order: pending → completed → cancelled
      const statusOrder = { pending: 1, completed: 2, cancelled: 3 };

      const sortedTasks = userTasks.sort((a, b) => {
        return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
      });

      setTasks(sortedTasks);
      setUsers([userData]);
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

  const handleAssign = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:3000/task/updateTask/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dToken}`,
        },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!res.ok) throw new Error("Failed to assign");

      Swal.fire("Success", "Task assigned successfully!", "success");

      // Refresh task list
      const updatedTasks = tasks.map((task) =>
        task.task_id === taskId
          ? {
              ...task,
              status: "completed",
            }
          : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.log("complete erroe", error)
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
        <TaskDetailModalWorker
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
};

export default TodayActivityCardWorker;
