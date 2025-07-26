import React, { useState, useEffect } from "react";
import "../styles/TaskTable.css";
import { FaUserCircle, FaSort, FaFilter } from "react-icons/fa";
import { MdPending, MdDone } from "react-icons/md";

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [showAssignPopup, setShowAssignPopup] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenFromL = localStorage.getItem("token");
        const token = JSON.parse(tokenFromL);

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const taskRes = await fetch("http://localhost:3000/task", { headers });
        const userRes = await fetch("http://localhost:3000/users", { headers });

        if (!taskRes.ok || !userRes.ok) {
          console.error(
            "Failed to fetch: Task or User",
            await taskRes.text(),
            await userRes.text()
          );
          return;
        }

        const taskData = await taskRes.json();
        const userData = await userRes.json();

        setTasks(Array.isArray(taskData) ? taskData : [taskData]); // safety
        setUsers(Array.isArray(userData) ? userData : [userData]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const getUserName = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    return user ? user.name : "Unknown";
  };

  const assignUser = (taskId, userId) => {
    const updated = tasks.map((task) =>
      task.task_id === taskId ? { ...task, assigned_to: userId } : task
    );
    setTasks(updated);
    setShowAssignPopup(null);
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
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="sort" onClick={() => setSortAsc(!sortAsc)}>
          <FaSort /> Sort by Date {sortAsc ? "↑" : "↓"}
        </div>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>Assigned To</th>
            <th>Description</th>
            <th>Scheduled Date</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task) => (
            <tr key={task.task_id}>
              <td>
                {getUserName(task.assigned_to) || <em>Unassigned</em>}
                {!task.assigned_to && task.status.toLowerCase() === "pending" && (
                  <>
                    <button
                      className="assign-btn"
                      onClick={() => setShowAssignPopup(task.task_id)}
                    >
                      Assign
                    </button>
                    {showAssignPopup === task.task_id && (
                      <div className="assign-popup">
                        {users.map((user) => (
                          <div
                            key={user.user_id}
                            onClick={() =>
                              assignUser(task.task_id, user.user_id)
                            }
                          >
                            <FaUserCircle /> {user.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </td>
              <td>{task.task_description}</td>
              <td>{new Date(task.scheduled_date).toLocaleDateString()}</td>
              <td>
                <span className={`badge ${task.status.toLowerCase()}`}>
                  {task.status.toLowerCase() === "pending" ? (
                    <MdPending />
                  ) : (
                    <MdDone />
                  )}{" "}
                  {task.status}
                </span>
              </td>
              <td>{new Date(task.created_at).toLocaleDateString()}</td>
              <td>
                <button className="edit-btn">Edit</button>{" "}
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
