import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./AlertsPage.css";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${JSON.parse(token)}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://localhost:3000/alert/with_info", { headers });
      const data = await res.json();

      // Temporary status tagging (mock)
      const statusedData = data.map((alert, index) => ({
        ...alert,
        status: index === 0 ? "initiated" : index === 1 ? "cancelled" : "seen", // Mock status
      }));

      setAlerts(statusedData);
      setFilteredAlerts(statusedData);
    } catch (err) {
      Swal.fire("Error", "Failed to load alerts", "error");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    filterAlerts(term, filterType, filterSeverity);
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
      // Simulate cancelling
      setAlerts((prev) =>
        prev.map((a) => (a.alert_id === alert_id ? { ...a, status: "cancelled" } : a))
      );
      filterAlerts(search, filterType, filterSeverity);
      Swal.fire("Cancelled!", "The task has been cancelled.", "success");
    }
  };

  const handleDelete = async (alert_id) => {
    const confirm = await Swal.fire({
      title: "Delete Alert?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      // Simulate deletion
      setAlerts((prev) => prev.filter((a) => a.alert_id !== alert_id));
      filterAlerts(search, filterType, filterSeverity);
      Swal.fire("Deleted!", "The alert has been deleted.", "success");
    }
  };

  const handleSeen = (alert_id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.alert_id === alert_id ? { ...a, status: "seen" } : a))
    );
    filterAlerts(search, filterType, filterSeverity);
    Swal.fire("Marked as Seen", "", "success");
  };

  return (
    <div className="alerts-container">
      <h2>Farm Alerts</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search alerts..."
          value={search}
          onChange={handleSearch}
        />

        <select onChange={(e) => { setFilterType(e.target.value); filterAlerts(search, e.target.value, filterSeverity); }}>
          <option value="">All Types</option>
          <option value="water">Water</option>
          <option value="weeding">Weeding</option>
        </select>

        <select onChange={(e) => { setFilterSeverity(e.target.value); filterAlerts(search, filterType, e.target.value); }}>
          <option value="">All Severity</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
      </div>

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
          {filteredAlerts.length === 0 ? (
            <tr><td colSpan="7">No alerts found.</td></tr>
          ) : (
            filteredAlerts.map((alert) => (
              <tr key={alert.alert_id}>
                <td>{alert.message}</td>
                <td>{alert.type}</td>
                <td>{alert.severity}</td>
                <td>{alert.farm_name}</td>
                <td>{alert.initiator_name}</td>
                <td>{alert.status}</td>
                <td>
                  {alert.status === "initiated" && (
                    <>
                      <button onClick={() => handleSeen(alert.alert_id)} className="seen-btn">Seen</button>
                      <button onClick={() => handleCancel(alert.alert_id)} className="cancel-btn">Cancel</button>
                      <button onClick={() => handleDelete(alert.alert_id)} className="delete-btn">Delete</button>
                    </>
                  )}
                  {alert.status === "cancelled" && (
                    <button onClick={() => handleDelete(alert.alert_id)} className="delete-btn">Delete</button>
                  )}
                  {alert.status === "seen" && <span className="no-action">✓</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsPage;
