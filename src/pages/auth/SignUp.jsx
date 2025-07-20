import React from "react";
import "../../styles/SignUp.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate(); 

  const NextPage = () => {
    navigate('/signup_profile_role'); 
  }

  return (
    <div className="signup-root">

      <div className="card signup-card glassmorphism" role="form" aria-labelledby="signup-heading">
        <Heading text="Sign Up" id="signup-heading" />
          <Input type="text" hold="Name" autoFocus autoComplete="name" />
          <Input type="text" hold="Surname" autoComplete="family-name" />
          <Input type="date" hold="Date Of Birth" autoComplete="bday" />
          <Input type="email" hold="Email" autoComplete="email" />
          <Input type="password" hold="Password" autoComplete="new-password" />
          <Input type="password" hold="Confirm Password" autoComplete="new-password" />
          <Button name="Next" click={NextPage}/>
      </div>
    </div>
  );
};

export default SignUp;