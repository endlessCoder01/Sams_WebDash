import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./Taskdetail.css";

const MySwal = withReactContent(Swal);

const TaskDetailModal = ({ task, onClose, onAssign }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleAssign = async () => {
    if (!selectedUserId) return;

    const confirm = await MySwal.fire({
      title: "Confirm Assignment",
      text: `Assign this task to ${users.find(u => u.user_id === Number(selectedUserId))?.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, assign it!",
    });

    if (confirm.isConfirmed) {
      await onAssign(task.task_id, selectedUserId);
      onClose(); 
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Task Details</h2>
        <p><strong>Description:</strong> {task.task_description}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Scheduled:</strong> {task.scheduled_date}</p>
        <p><strong>Assigned to:</strong> {task.user_name || "Unassigned"}</p>
        <p><strong>Farm:</strong> {task.farm_name}</p>

        {task.status.toLowerCase() === "pending" && (
          <div className="assign-area">
            <label>Assign to:</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button onClick={handleAssign} className="assign-btn">
              Assign
            </button>
          </div>
        )}

        <button onClick={onClose} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TaskDetailModal;
