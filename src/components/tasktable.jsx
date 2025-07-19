import React, { useState } from "react";
import "../styles/TaskTable.css";
import { FaPlus, FaUserCircle, FaSort, FaFilter } from "react-icons/fa";
import { MdPending, MdDone } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const dummyTasks = [
  {
    id: 1,
    assignedTo: "Alice",
    description: "Irrigate maize field",
    scheduledDate: "2025-07-20",
    status: "Pending",
    createdAt: "2025-07-18",
  },
  {
    id: 2,
    assignedTo: "Bob",
    description: "Check fertilizer levels",
    scheduledDate: "2025-07-21",
    status: "Completed",
    createdAt: "2025-07-17",
  },
];

const availableUsers = ["Alice", "Bob", "Charlie"];

const TaskTable = () => {
  const [tasks, setTasks] = useState(dummyTasks);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    assignedTo: "",
    description: "",
    scheduledDate: "",
    status: "Pending",
  });
  const [showAssignPopup, setShowAssignPopup] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);

  const handleCreateTask = () => {
    setTasks([
      ...tasks,
      {
        ...newTask,
        id: tasks.length + 1,
        createdAt: new Date().toISOString().split("T")[0],
      },
    ]);
    setShowModal(false);
    setNewTask({ assignedTo: "", description: "", scheduledDate: "", status: "Pending" });
  };

  const assignUser = (taskId, user) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, assignedTo: user } : t
    );
    setTasks(updated);
    setShowAssignPopup(null);
  };

  const filteredTasks = tasks.filter(
    (t) => filterStatus === "All" || t.status === filterStatus
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.scheduledDate);
    const dateB = new Date(b.scheduledDate);
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="task-table-container">
      <h2 className="heading">📝 Task Schedule</h2>

      <div className="controls">
        <div className="filters">
          <FaFilter />
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            value={filterStatus}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
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
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.assignedTo || <em>Unassigned</em>}</td>
              <td>{task.description}</td>
              <td>{task.scheduledDate}</td>
              <td>
                <span className={`badge ${task.status.toLowerCase()}`}>
                  {task.status === "Pending" ? <MdPending /> : <MdDone />} {task.status}
                </span>
                {task.status === "Pending" && (
                  <>
                    <button className="assign-btn" onClick={() => setShowAssignPopup(task.id)}>
                      Assign
                    </button>
                    {showAssignPopup === task.id && (
                      <div className="assign-popup">
                        {availableUsers.map((user) => (
                          <div key={user} onClick={() => assignUser(task.id, user)}>
                            <FaUserCircle /> {user}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </td>
              <td>{task.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="floating-btn" onClick={() => setShowModal(true)}>
        <FaPlus />
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              <IoMdClose />
            </button>
            <h3>Create Task</h3>
            <input
              type="text"
              placeholder="Assigned To"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            ></textarea>
            <input
              type="date"
              value={newTask.scheduledDate}
              onChange={(e) => setNewTask({ ...newTask, scheduledDate: e.target.value })}
            />
            <button className="submit-btn" onClick={handleCreateTask}>Add Task</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
