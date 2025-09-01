import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faTasks,
  faBell,
  faUser,
  faSignOutAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/logoutService";

const WorkerNavbar = ({ setIsAuthenticated, setRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user_id"));

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="floating-navbar">
        <button className="menu-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <div className={`slide-menu ${isOpen ? "open" : ""}`}>
        <button className="close-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <ul>
          <li>
            <Link to="/home/worker" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
          </li>
          <li>
            <Link to="/worker/tasks" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faTasks} /> Tasks
            </Link>
          </li>
          <li>
            <Link to={`/alerts/worker/${user}`} onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBell} /> Alerts
            </Link>
          </li>
          <li>
            <Link to="/worker/profile" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faUser} /> Profile
            </Link>
          </li>
          <li>
            <Link
              onClick={() => logout(navigate, setIsAuthenticated, setRole)}
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default WorkerNavbar;
