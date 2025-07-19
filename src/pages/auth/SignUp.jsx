import React from "react";
import "../../styles/SignUp.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";

const SignUp = () => {
  return (
    <div className="signup-root">

      {/* Animated Grass Blades background */}

      {/* <div className="grass-anim-bg" aria-hidden="true">
        {[...Array(12)].map((_, idx) => (
          <div key={idx} className={`grass-blade blade${idx % 6}`} />
        ))}
      </div> */}

      <div className="card signup-card glassmorphism" role="form" aria-labelledby="signup-heading">
        <Heading text="Sign Up" id="signup-heading" />
        <form autoComplete="off" className="signup-form">
          <Input type="text" hold="Name" autoFocus autoComplete="name" />
          <Input type="text" hold="Surname" autoComplete="family-name" />
          <Input type="date" hold="Date Of Birth" autoComplete="bday" />
          <Input type="email" hold="Email" autoComplete="email" />
          <Input type="password" hold="Password" autoComplete="new-password" />
          <Input type="password" hold="Confirm Password" autoComplete="new-password" />
          <Button name="Sign Up" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default SignUp;