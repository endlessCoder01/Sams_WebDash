import React, { useState, useEffect } from "react";
import "../styles/TaskTable.css";
import { FaUserCircle, FaSort, FaFilter } from "react-icons/fa";
import {
  MdPending,
  MdDone,
  MdCancel,
  MdStart,
  MdNewReleases,
} from "react-icons/md";
import Swal from "sweetalert2";
import EditTaskModal from "./modals/editTask";

const TaskTableWorker = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [showAssignPopup, setShowAssignPopup] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user_id"));
      if (!token) return console.error("No token found in localStorage");

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

      const taskData = await tasksRes.json();

      setTasks(Array.isArray(taskData) ? taskData : [taskData]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const deleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;

    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const res = await fetch(
        `http://localhost:3000/task/updateTask/${taskId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      // setTasks((prev) => prev.filter((t) => t.task_id !== taskId));

      Swal.fire("Cancelled!", "The task has been cancelled.", "success");
      await fetchData();
    } catch (err) {
      console.error("Delete Error:", err.message);
      Swal.fire("Error", "Failed to cancel task", "error");
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    return user ? user.name : "Unknown";
  };

  const assignUser = async (taskId, userId) => {
    const data = {
      userState: "occupied",
      status: "pending",
      assigned_to: userId,
    };
    const token = JSON.parse(localStorage.getItem("token"));

    try {
      const res = await fetch(
        `http://localhost:3000/task/assignTask/${taskId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error(await res.text());
      Swal.fire("Assigned!", "Task assigned successfully.", "success");

      const updated = tasks.map((task) =>
        task.task_id === taskId ? { ...task, assigned_to: userId } : task
      );
      setTasks(updated);
      setShowAssignPopup(null);
    } catch (error) {
      console.log("Error from assignment", error);
    }
  };

  const filteredTasks = tasks.filter(
    (t) =>
      filterStatus === "All" ||
      t.status.toLowerCase() === filterStatus.toLowerCase()
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.scheduled_date);
    const dateB = new Date(b.scheduled_date);
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="task-table-container">
      <h2 className="heading">📋 Farm Task Schedule</h2>
      <div className="controls">
        <div className="filters">
          <FaFilter />
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            value={filterStatus}
          >
            <option value="All">All</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="sort" onClick={() => setSortAsc(!sortAsc)}>
          <FaSort /> Sort by Date {sortAsc ? "↑" : "↓"}
        </div>
      </div>
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={(updatedTask) => {
            const updatedTasks = tasks.map((t) =>
              t.task_id === updatedTask.task_id ? updatedTask : t
            );
            setTasks(updatedTasks);
            setEditingTask(null);
          }}
          onCancel={() => setEditingTask(null)}
        />
      )}

      <table className="task-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Scheduled Date</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task) => {
            const isCancelled = task.status.toLowerCase() === "cancelled";
            const isUnassigned = !task.assigned_to;

            return (
              <tr key={task.task_id}>
                <td>{task.task_description}</td>
                <td>{new Date(task.scheduled_date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${task.status.toLowerCase()}`}>
                    {task.status.toLowerCase() === "pending" && <MdPending />}
                    {task.status.toLowerCase() === "completed" && <MdDone />}
                    {task.status.toLowerCase() === "initiated" && (
                      <MdNewReleases />
                    )}
                    {task.status.toLowerCase() === "cancelled" && <MdCancel />}{" "}
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </td>
                <td>{new Date(task.created_at).toLocaleDateString()}</td>
                <td>
                  {!isCancelled && isUnassigned && (
                    <button
                      className="edit-btn"
                      onClick={() => setEditingTask(task)}
                    >
                      Edit
                    </button>
                  )}

                  {/* Show cancel button only if task is NOT cancelled or completed */}
                  {!["cancelled", "completed"].includes(
                    task.status.toLowerCase()
                  ) && (
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.task_id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
};

export default TaskTableWorker;
