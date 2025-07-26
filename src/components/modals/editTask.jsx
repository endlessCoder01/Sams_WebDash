import React, { useState } from "react";
import "../styles/EditTaskModal.css";

const EditTaskModal = ({ task, onSave, onCancel }) => {
  const [description, setDescription] = useState(task.task_description);
  const [scheduledDate, setScheduledDate] = useState(
    task.scheduled_date.split("T")[0]
  );
  const [status, setStatus] = useState(task.status);

  const handleSave = () => {
    const updatedTask = {
      ...task,
      task_description: description,
      scheduled_date: scheduledDate,
      status,
    };
    onSave(updatedTask);
  };

  return (
    <div className="edit-task-modal">
      <div className="modal-content">
        <h3>Edit Task</h3>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Scheduled Date:
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </label>

        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <div className="modal-actions">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
