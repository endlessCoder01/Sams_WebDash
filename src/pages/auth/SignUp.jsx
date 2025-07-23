import React, { useState } from "react";
import "../../styles/SignUp.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState()
  // const [surname, setSurname] = useState()
  // const [dob, setDob] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate();


  
   const changedName = (event) => {
    setName(event.target.value);
  }

  // const changedSurname = (event) => {
  //   setSurname(event.target.value);
  // }

  //  const changedDOB = (event) => {
  //   setDob(event.target.value);
  // }

   const changedEmail = (event) => {
    setEmail(event.target.value);
  }

  const changedPass = (event) => {
    setPassword(event.target.value);
  }

  const NextPage = () => {
    const details = [name, email, password];
    localStorage.setItem('info',  JSON.stringify(details))
    navigate("/signup_profile_role");
  };


  return (
    <div className="signup-root">
      <div
        className="card signup-card glassmorphism"
        role="form"
        aria-labelledby="signup-heading"
      >
        <Heading text="Sign Up" id="signup-heading" />
        <Input type="text" hold="Full name" autoFocus autoComplete="name" changed={changedName} />
        {/* <Input type="text" hold="Surname" autoComplete="family-name"  changed={changedSurname}/> */}
        {/* <Input type="date" hold="Date Of Birth" autoComplete="bday"  changed={changedDOB}/> */}
        <Input type="email" hold="Email" autoComplete="email"  changed={changedEmail}/>
        <Input type="password" hold="Password" autoComplete="new-password"  changed={changedPass}/>
        <Input
          type="password"
          hold="Confirm Password"
          autoComplete="new-password"
        />
        <p>
          Have an Account? <a href="/">Login</a> / <a href="/">Forgot Password</a>
        </p>
        <Button name="Next" click={NextPage} />
      </div>
    </div>
  );
};

export default SignUp;
