import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./AllWorkers.css";
import AddWorkerToFarm from "../../../components/modals/addworker";

const AllWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false); // ✅ Modal toggle state

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch("http://localhost:3000/farm-member/workers", {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch workers");

        const data = await response.json();
        setWorkers(data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Could not load workers data.", "error");
      }
    };

    fetchWorkers();
  }, [showModal]); // ✅ Refresh on modal close

  return (
    <div className="workers-page">
      <h2 className="workers-title">All Workers</h2>
      <div className="workers-grid">
        {workers.map((worker) => (
          <div className="worker-card" key={worker.user_id}>
            <h3>{worker.user_name}</h3>
            <p><strong>Email:</strong> {worker.email}</p>
            <p><strong>Role:</strong> {worker.user_role}</p>
            <p><strong>Farm:</strong> {worker.farm_name}</p>
            <p><strong>Location:</strong> {worker.location}</p>
            <p><strong>Soil Type:</strong> {worker.soil_type}</p>
            <p><strong>Work Status:</strong> {worker.work_status}</p>
            <p><strong>Joined:</strong> {new Date(worker.joined_at).toLocaleDateString()}</p>
            <button
              className="view-btn"
              onClick={() =>
                Swal.fire({
                  title: worker.user_name,
                  html: `
                    <p><strong>Email:</strong> ${worker.email}</p>
                    <p><strong>Farm:</strong> ${worker.farm_name}</p>
                    <p><strong>Role on Farm:</strong> ${worker.role_on_farm}</p>
                    <p><strong>Status:</strong> ${worker.work_status}</p>
                    <p><strong>Location:</strong> ${worker.location}</p>
                    <p><strong>Soil Type:</strong> ${worker.soil_type}</p>
                  `,
                  confirmButtonColor: "#6B6F1D",
                  confirmButtonText: "Close",
                })
              }
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Floating Button */}
      <button className="floating-btn" onClick={() => setShowModal(true)}>+</button>

      {/* ✅ Modal with background overlay */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            <AddWorkerToFarm />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWorkers;
