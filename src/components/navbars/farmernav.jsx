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
  faUserGroup,
  faPooStorm,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/logoutService";

const Navbar = ({ setIsAuthenticated, setRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
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
            <Link to="/home" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
          </li>
          <li>
            <Link to="/tasks" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faTasks} /> Tasks
            </Link>
          </li>
          <li>
            <Link to="/workers" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faUserGroup} /> Employees
            </Link>
          </li>
          <li>
            <Link to="/alerts" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBell} /> Alerts
            </Link>
          </li>
          <li>
            <Link to="/soon" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faPooStorm} /> Sensors
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={toggleMenu}>
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

export default Navbar;
