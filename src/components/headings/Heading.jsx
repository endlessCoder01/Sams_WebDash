import React from "react";
import "../../styles/Heading.css";

const Heading = ({ text, id }) => (
  <h1 id={id} className="signup-heading">
    {text}
  </h1>
);

export default Heading;