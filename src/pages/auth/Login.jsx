import React from "react";
import "../../styles/Login.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";
import Swal from "sweetalert2";
import API from '../../services/config'
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  const Login = async () => {
    // try {
    //   const response = await fetch(`${API}/patient/login/${userId}`, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   const result = await response.json();

    //   if (response.ok && result) {
    //     console.log("patient", result);
    //     localStorage.setItem("patient", JSON.stringify(result));

    //     await Swal.fire(
    //       "Success!",
    //       "You have logged in successfully!",
    //       "success"
    //     );

    //     // onLogin(); // Call your login function to update state
    //     navigate("/patient_home");
    //   } else {
    //     await Swal.fire(
    //       "Error!",
    //       result.message || "Login failed. Please try again.",
    //       "error"
    //     );
    //   }
    // } catch (error) {
    //   console.log("Error", error);
    //   await Swal.fire(
    //     "Error!",
    //     "An unexpected error occurred. Please try again.",
    //     "error"
    //   );
    // }
  };
  return (
    <div className="signup-root">
      <div
        className="card signup-card glassmorphism"
        role="form"
        aria-labelledby="signup-heading"
      >
        <Heading text="Login" id="signup-heading" />
        <Input type="email" hold="Email" autoComplete="email" />
        <Input type="password" hold="Password" />
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
