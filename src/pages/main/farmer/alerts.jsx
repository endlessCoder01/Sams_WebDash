import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Alerts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrash,
  faEye,
  faBan,
  faArrowLeft,
  faArrowRight,
  faExclamationTriangle,
  faBell,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import CreateAlertModal from "../../../components/modals/createAlert";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const alertsPerPage = 5;

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/alert/with_info", {
        headers,
      });
      const data = await res.json();

      const possibleStatuses = ["initiated", "cancelled", "missed", "seen"];
      const statusedData = data.map((alert) => ({
        ...alert,
        status: alert.alert_status || possibleStatuses[Math.floor(Math.random() * 4)],
      }));

      setAlerts(statusedData);
      setFilteredAlerts(statusedData);
    } catch (err) {
      Swal.fire("Error", "Failed to load alerts", "error");
    }
    setLoading(false);
  };

  const filterAlerts = (term, type, severity) => {
    let filtered = alerts.filter(
      (alert) =>
        (alert.message.toLowerCase().includes(term) ||
          alert.farm_name.toLowerCase().includes(term) ||
          alert.type.toLowerCase().includes(term) ||
          alert.severity.toLowerCase().includes(term)) &&
        (type ? alert.type === type : true) &&
        (severity ? alert.severity === severity : true)
    );
    setFilteredAlerts(filtered);
    setCurrentPage(1); // Reset to page 1 when filtering
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    filterAlerts(term, filterType, filterSeverity);
  };

  const handleCancel = async (alert_id) => {
    const confirm = await Swal.fire({
      title: "Cancel Task?",
      text: "Are you sure you want to cancel this alert?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirm.isConfirmed) {
      setAlerts((prev) =>
        prev.map((a) =>
          a.alert_id === alert_id ? { ...a, status: "cancelled" } : a
        )
      );
      filterAlerts(search, filterType, filterSeverity);
      Swal.fire("Cancelled!", "The task has been cancelled.", "success");
    }
  };

  const handleDelete = async (alertId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the alert.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6B6F1D",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/alert/${alertId}`, {
          headers,
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete alert");
        }

        // Update UI
        setAlerts((prev) => prev.filter((alert) => alert.alert_id !== alertId));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The alert has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire("Error", "Failed to delete alert.", "error");
        console.error("Delete Alert Error:", error);
      }
    }
  };

  const handleSeen = (alert_id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.alert_id === alert_id ? { ...a, status: "seen" } : a))
    );
    filterAlerts(search, filterType, filterSeverity);
    Swal.fire("Marked as Seen", "", "success");
  };

  // Pagination logic
  const indexOfLast = currentPage * alertsPerPage;
  const indexOfFirst = indexOfLast - alertsPerPage;
  const currentAlerts = filteredAlerts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);

  return (
    <div className="alerts-container">
      <h2>
        <FontAwesomeIcon icon={faBell} /> Farm Alerts
      </h2>
      <div className="filters">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={handleSearch}
          />
        </div>

      {showCreateModal && (
          <CreateAlertModal
            onClose={() => setShowCreateModal(false)}
            onAlertCreated={(newAlert) => setAlerts((prev) => [...prev, newAlert])}
          />
        )}

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            filterAlerts(search, e.target.value, filterSeverity);
          }}
        >
          <option value="">All Types</option>
          <option value="water">Water</option>
          <option value="weeding">Weeding</option>
        </select>

        <select
          value={filterSeverity}
          onChange={(e) => {
            setFilterSeverity(e.target.value);
            filterAlerts(search, filterType, e.target.value);
          }}
        >
          <option value="">All Severity</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      {loading ? (
        <div className="loading-spinner">Loading Alerts...</div>
      ) : (
        <>
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Message</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Farm</th>
                <th>Initiator</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAlerts.length === 0 ? (
                <tr>
                  <td colSpan="7">No alerts found.</td>
                </tr>
              ) : (
                currentAlerts.map((alert) => (
                  <tr
                    key={alert.alert_id}
                    className={alert.status === "missed" ? "missed-row" : ""}
                  >
                    <td>{alert.message}</td>
                    <td>{alert.type}</td>
                    <td>{alert.severity}</td>
                    <td>{alert.farm_name}</td>
                    <td>{alert.initiator_name}</td>
                    <td>
                      <span className={`status-badge status-${alert.status}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td>
                      {alert.status === "initiated" && (
                        <>
                          <button
                            onClick={() => handleSeen(alert.alert_id)}
                            className="seen-btn"
                            title="Mark as Seen"
                          >
                            <FontAwesomeIcon icon={faEye} /> Seen
                          </button>
                          <button
                            onClick={() => handleCancel(alert.alert_id)}
                            className="cancel-btn"
                            title="Cancel Alert"
                          >
                            <FontAwesomeIcon icon={faBan} /> Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(alert.alert_id)}
                            className="delete-btn"
                            title="Delete Alert"
                          >
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                        </>
                      )}
                      {["cancelled", "missed"].includes(alert.status) && (
                        <button
                          onClick={() => handleDelete(alert.alert_id)}
                          className="delete-btn"
                          title="Delete Missed/Cancelled"
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      )}
                      {alert.status === "seen" && (
                        <span className="no-action" title="No Action">
                          <FontAwesomeIcon icon={faCheck} /> Done
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          )}
        </>
      )}
      <button
        className="floating-add-button"
        onClick={() => setShowCreateModal(true)}
        title="Add Task"
      >
        +
      </button>{" "}
    </div>
  );
};

export default AlertsPage;
