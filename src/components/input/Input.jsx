import React from "react";
import "../../styles/Input.css";

const Input = (props) => (
  <div className="input-group">
    <input
      type={props.type}
      placeholder={props.hold}
      className="input-element"
      aria-label={props.hold}
      required
      {...props}
    />
  </div>
);

export default Input;