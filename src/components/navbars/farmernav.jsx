import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faTasks,
  faBell,
  faUser,
  faSignOutAlt,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const Navbar = () => {
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
          <li><a href="/home"><FontAwesomeIcon icon={faHome} /> Home</a></li>
          <li><a href="/tasks"><FontAwesomeIcon icon={faTasks} /> Tasks</a></li>
          <li><a href="#"><FontAwesomeIcon icon={faBell} /> Alerts</a></li>
          <li><a href="#"><FontAwesomeIcon icon={faUser} /> Profile</a></li>
          <li><a href="#"><FontAwesomeIcon icon={faSignOutAlt} /> Logout</a></li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
