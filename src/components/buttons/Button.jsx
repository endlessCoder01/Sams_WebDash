import React from "react";
import "../../styles/Button.css";

const Button = props => {

    return <button  className="signup-btn" style={props.style} onClick={props.click}>{props.name}</button>
}

export default Button;