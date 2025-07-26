import React, { useState } from "react";
import "../../styles/Login.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { API } from "../../services/config";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const changedEmail = (event) => {
    setEmail(event.target.value);
  };

  const changedPass = (event) => {
    setPassword(event.target.value);
  };

  const Login = async () => {
    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();
      if (response.ok && result) {
        localStorage.setItem("tokens", JSON.stringify(result));
        await Swal.fire(
          "Success!",
          "You have logged in successfully!",
          "success"
        );

        localStorage.setItem("token", JSON.stringify(result.token.token));
        navigate("/home");
      } else {
        await Swal.fire(
          "Error!",
          result.message || "Login failed. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.log("Error", error);
      await Swal.fire(
        "Error!",
        "An unexpected error occurred. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="signup-root">
      <div
        className="card signup-card glassmorphism"
        role="form"
        aria-labelledby="signup-heading"
      >
        <Heading text="Login" id="signup-heading" />
        <Input
          type="email"
          hold="Email"
          autoComplete="email"
          changed={changedEmail}
        />
        <Input type="password" hold="Password" changed={changedPass} />
        <a href="#">Forgot Passsword</a>
        <Button name="Login" click={Login} />
        <p>
          Don't have an Account? <a href="signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
