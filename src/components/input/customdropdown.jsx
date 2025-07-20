import React from "react";
import "./CustomDropdown.css";

const CustomDropdown = ({ label, name, options, onChange, value }) => {
  return (
    <div className="dropdown-container">
      {label && <label htmlFor={name} className="dropdown-label">{label}</label>}
      <select
        className="dropdown-select"
        name={name}
        id={name}
        onChange={onChange}
        value={value}
      >
        <option value="">Select an option</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default CustomDropdown;
