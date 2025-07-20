import React from "react";
import "../../styles/Login.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";

const Login = () => {
  return (
    <div className="signup-root">
      <div className="card signup-card glassmorphism" role="form" aria-labelledby="signup-heading">
        <Heading text="Login" id="signup-heading" />
        <form autoComplete="off" className="signup-form">
          <Input type="email" hold="Email" autoComplete="email" />
          <Input type="password" hold="Password"/>
           <a href="signup">Forgot Passsword</a>
          <Button name="Login" type="submit" />
        </form>
        <p>Don't have an Account? <a href="#">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Login;
