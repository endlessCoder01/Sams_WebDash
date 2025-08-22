import React, { useState } from "react";
import "../../styles/Login.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { API } from "../../services/config";

const Login = ({ onLogin }) => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log("login response:", result);

      if (response.ok && result) {
        // Save token and user details
        localStorage.setItem("token", result.token.token);
        localStorage.setItem("user_id", result.token.userDetails.userId);
        localStorage.setItem("role", result.token.userDetails.role);

        await Swal.fire(
          "Success!",
          "You have logged in successfully!",
          "success"
        );

        const role = result.token.userDetails.role;

        // Tell App that we logged in with this role
        onLogin(role);

        // Navigate by role
        if (role === "farmer" || role === "admin" || role === "agronomist") {
          navigate("/home");
        } else if (role === "worker") {
          navigate("/home/worker");
        }
      } else {
        await Swal.fire("Error!", result.message || "Login failed", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
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
