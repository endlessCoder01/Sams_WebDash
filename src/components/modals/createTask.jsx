import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Modal.css"; 

const CreateTaskModal = ({ onClose, onTaskCreated }) => {
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    task_description: "",
    scheduled_date: "",
    status: "pending",
    assigned_to: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await fetch("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await fetch("http://localhost:3000/task", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
      }

      const createdTask = await res.json();
      Swal.fire("Success!", "Task created successfully", "success");
      onTaskCreated(createdTask);
      onClose();
    } catch (error) {
      console.error("Create Error:", error.message);
      Swal.fire("Error", "Could not create task", "error");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create New Task</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Description</label>
          <input
            type="text"
            name="task_description"
            value={task.task_description}
            onChange={handleChange}
            required
          />

          <label>Scheduled Date</label>
          <input
            type="date"
            name="scheduled_date"
            value={task.scheduled_date}
            onChange={handleChange}
            required
          />

          <label>Status</label>
          <select name="status" value={task.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <label>Assign To (Optional)</label>
          <select
            name="assigned_to"
            value={task.assigned_to}
            onChange={handleChange}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.name}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="submit" className="create-btn">Create Task</button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
