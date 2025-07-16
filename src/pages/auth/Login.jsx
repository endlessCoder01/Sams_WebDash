import React from "react";
import "../../styles/Login.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";

const Login = () => {
  return (
    <div className="card">
      <Heading text="Login" />
      <Input type="text" hold="Username" /> <br />
      <Input type="password" hold="Password" /> <br />
      <Button
        name="Login"
        style={{
          padding: "8px",
          backgroundColor: "chartreuse",
          border: "1px solid blue",
          font: "inherit",
        }}
      />
    </div>
  );
};

export default Login;
