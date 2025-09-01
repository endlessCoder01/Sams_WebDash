import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./AddWorkerToFarm.css";

const AddWorkerToFarm = () => {
  const [users, setUsers] = useState([]);
  const [farms, setFarms] = useState([]);
  const [farmMembers, setFarmMembers] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [roleOnFarm, setRoleOnFarm] = useState("worker");
  const [workStatus, setWorkStatus] = useState("available");

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, farmRes, farmMemberRes] = await Promise.all([
          fetch("http://localhost:3000/users", { headers }),
          fetch("http://localhost:3000/farms", { headers }),
          fetch("http://localhost:3000/farm-member/workers", { headers }),
        ]);

        const [usersData, farmsData, membersData] = await Promise.all([
          userRes.json(),
          farmRes.json(),
          farmMemberRes.json(),
        ]);

        setUsers(usersData);
        setFarms(farmsData);
        setFarmMembers(membersData);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch data", "error");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUserId || !selectedFarmId) {
      return Swal.fire("Incomplete", "Please select user and farm", "warning");
    }

    const isAlreadyMember = farmMembers.some(
      (m) => m.user_id === parseInt(selectedUserId) && m.farm_id === parseInt(selectedFarmId)
    );

    if (isAlreadyMember) {
      return Swal.fire("Duplicate", "This user is already a member of the farm.", "info");
    }

    try {
      const response = await fetch("http://localhost:3000/farm-member", {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: selectedUserId,
          farm_id: selectedFarmId,
          role_on_farm: roleOnFarm,
          work_status: workStatus,
        }),
      });

      if (response.ok) {
        Swal.fire("Success", "Worker added to farm!", "success");
        setSelectedFarmId("");
        setSelectedUserId("");
        setRoleOnFarm("worker");
        setWorkStatus("available");
      } else {
        Swal.fire("Error", "Failed to add worker", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const getAvailableUsers = () => {
    const farmUserIds = farmMembers
      .filter((member) => member.farm_id === parseInt(selectedFarmId))
      .map((m) => m.user_id);

    return users.filter(
      (user) => !farmUserIds.includes(user.user_id) && user.role === "worker"
    );
  };

  return (
    <div className="add-worker-container">
      <h2>Add Worker to Farm</h2>
      <form onSubmit={handleSubmit} className="add-worker-form">
        <label>Farm:</label>
        <select
          value={selectedFarmId}
          onChange={(e) => setSelectedFarmId(e.target.value)}
          required
        >
          <option value="">Select Farm</option>
          {farms.map((farm) => (
            <option key={farm.farm_id} value={farm.farm_id}>
              {farm.farm_name}
            </option>
          ))}
        </select>

        <label>User:</label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          required
        >
          <option value="">Select Worker</option>
          {getAvailableUsers().map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.name} - {user.email}
            </option>
          ))}
        </select>

        <label>Role on Farm:</label>
        <select
          value={roleOnFarm}
          onChange={(e) => setRoleOnFarm(e.target.value)}
        >
          <option value="worker">Worker</option>
          <option value="consultant">Consultant</option>
        </select>

        <label>Work Status:</label>
        <select
          value={workStatus}
          onChange={(e) => setWorkStatus(e.target.value)}
        >
          <option value="available">Available</option>
          <option value="busy">Busy</option>
        </select>

        <button type="submit" className="submit-btn">Add Worker</button>
      </form>
    </div>
  );
};

export default AddWorkerToFarm;
