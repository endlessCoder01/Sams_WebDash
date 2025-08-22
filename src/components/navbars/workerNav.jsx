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
import { Link } from "react-router-dom";

const WorkerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <li><Link to ="/home/worker" onClick={toggleMenu}><FontAwesomeIcon icon={faHome} /> Home</Link></li>
          <li><Link to ="/worker/tasks" onClick={toggleMenu}><FontAwesomeIcon icon={faTasks} /> Tasks</Link></li>
          <li><Link to="/alerts"><FontAwesomeIcon icon={faBell} /> Alerts</Link></li>
          <li><Link to="/profile"><FontAwesomeIcon icon={faUser} /> Profile</Link></li>
          <li><Link to="#"><FontAwesomeIcon icon={faSignOutAlt} /> Logout</Link></li>
        </ul>
      </div>
    </>
  );
};

export default WorkerNavbar;
