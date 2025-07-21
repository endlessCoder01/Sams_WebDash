import React from "react";
import "../../styles/Input.css";

const Input = ({ type, hold, changed, ...rest }) => (
  <div className="input-group">
    <input
      type={type}
      placeholder={hold}
      aria-label={hold}
      className="input-element"
      onChange={changed}
      required
      {...rest}  
    />
  </div>
);

export default Input;
