import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Modal.css";

const CreateAlertModal = ({ onClose, onAlertCreated }) => {
  const [farm, setFarm] = useState([]);
  const [alert, setAlert] = useState({
    farm_id: "",
    message: "",
    type: "",
    severity: "warning",
    initiated_by: "",
    alert_status: "seen",
  });

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user_id"));

      const farmsRes = await fetch(`http://localhost:3000/farms/joined/user/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!farmsRes.ok) {
        throw new Error("Failed to fetch farms");
      }

      const farmsData = await farmsRes.json();

      console.log("farmdata", farmsData); // ✅ log parsed JSON
      setFarm(farmsData[0]);
    } catch (err) {
      console.error("Failed to fetch users or farms", err);
    }
  };

  fetchData();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlert((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const user = JSON.parse(localStorage.getItem("user_id"));
      const payload = {
        ...alert,
        initiated_by: user === "" ? null : parseInt(user),
        farm_id: farm.farm_id === "" ? null : parseInt(farm.farm_id),
      };

      console.log("payload", payload);

      const res = await fetch("http://localhost:3000/alert", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
      }

      const createdAlert = await res.json();
      Swal.fire("Success!", "Alert successfully posted", "success");
      onAlertCreated(createdAlert);
      onClose();
    } catch (error) {
      console.error("Create Error:", error.message);
      Swal.fire("Error", error.message || "Could not create Alert", "error");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create New Alert</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Alert Message</label>
          <input
            type="text"
            name="message"
            value={alert.message}
            onChange={handleChange}
            required
          />

          {/* <label>Scheduled Date</label>
          <input
            type="date"
            name="scheduled_date"
            value={alert.scheduled_date}
            onChange={handleChange}
            required
          /> */}

          <label>Alert Severity</label>
          <select
            name="severity"
            value={alert.severity}
            onChange={handleChange}
          >
            <option value="warning">Warning</option>
            <option value="info">New Update</option>
            <option value="critical">Emergency</option>
          </select>

          {/* <label>Assign To (Optional)</label>
          <select
            name="assigned_to"
            value={alert.assigned_to}
            onChange={handleChange}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.name}
              </option>
            ))}
          </select> */}

          {/* <label>Select Farm</label>
          <select
            name="farm_id"
            value={alert.farm_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a farm</option>
            {farms.map((farm) => (
              <option key={farm.farm_id} value={farm.farm_id}>
                {farm.farm_name} - {farm.location}
              </option>
            ))}
          </select> */}

          <div className="modal-actions">
            <button type="submit" className="create-btn">
              Create Alert
            </button>
            <button type="button" className="cancelbtn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlertModal;
