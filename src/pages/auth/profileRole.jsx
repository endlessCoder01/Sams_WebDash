import React from "react";
import "../../styles/ProfileRole.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";

const ProfileRole = () => {
  return (
    <div className="signup-root">

      <div className="card signup-card glassmorphism" role="form" aria-labelledby="signup-heading">
        <Heading text="Sign Up" id="signup-heading" />
        <form autoComplete="off" className="signup-form">
          <Input type="text" hold="Name" autoFocus autoComplete="name" />
          <Button name="Sign Up" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default ProfileRole;