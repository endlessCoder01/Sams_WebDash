import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Profile.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [tasksCount, setTasksCount] = useState(0);
  const [farms, setFarms] = useState([]);
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user_id")); // Save user_id in login

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
        
    try {
      const userRes = await fetch(`http://localhost:3000/users/${userId}`, { headers });
      const userData = await userRes.json();
      setUser(userData);

      const tasksRes = await fetch("http://localhost:3000/task", { headers });
      const tasksData = await tasksRes.json();
      const assignedTasks = tasksData.filter((t) => t.assigned_to === userId);
      setTasksCount(assignedTasks.length);

      const farmsRes = await fetch("http://localhost:3000/farm-member/workers", { headers });
      const farmsData = await farmsRes.json();
      const myFarms = farmsData.filter((fm) => fm.user_id === userId);
      setFarms(myFarms);
    } catch (err) {
      Swal.fire("Error", "Failed to load profile data", "error");
    }
  };

  const handleEditProfile = () => {
    Swal.fire({
      title: "Edit Profile",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${user.name}">
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${user.email}">
        <input id="swal-phone" class="swal2-input" placeholder="Phone" value="${user.phone_number || ""}">
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById("swal-name").value;
        const email = document.getElementById("swal-email").value;
        const phone = document.getElementById("swal-phone").value;
        return { name, email, phone };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/users/${userId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(result.value),
          });
          if (!res.ok) throw new Error("Failed to update");
          Swal.fire("Updated!", "Your profile has been updated.", "success");
          fetchProfileData();
        } catch (err) {
          Swal.fire("Error", "Could not update profile", "error");
        }
      }
    });
  };


  if (!user) return <div className="profile-loading">Loading Profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={`http://localhost:3000/${user.profile_picture.replace(/\\/g, "/")}`}
          alt="Profile"
          className="profile-pic"
        />
        <div>
          <h2>{user.name}</h2>
          <p>{user.role}</p>
          <button className="edit-btn" onClick={handleEditProfile}>Edit Profile</button>
        </div>
      </div>

      <div className="profile-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone_number || "Not set"}</p>
        <p><strong>Tasks Assigned:</strong> {tasksCount}</p>
      </div>

      <div className="profile-farms">
        <h3>Farms</h3>
        {farms.length > 0 ? (
          <ul>
            {farms.map((farm, index) => (
              <li key={index}>
                <strong>{farm.farm_name}</strong> - {farm.location} ({farm.role_on_farm})
              </li>
            ))}
          </ul>
        ) : (
          <p>No farms assigned.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
