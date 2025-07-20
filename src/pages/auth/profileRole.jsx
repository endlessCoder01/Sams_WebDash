import React, { useState } from "react";
import "../../styles/ProfileRole.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";
import CustomDropdown from "../../components/input/customdropdown";
import ImageUploadPreview from "../../components/input/ImageUploads";
import { useNavigate } from "react-router-dom";

const ProfileRole = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate()
const SignUp = () => {

}


  return (
    <div className="signup-root">
      <div
        className="card signup-card glassmorphism"
        role="form"
        aria-labelledby="signup-heading"
      >
        <Heading text="Sign Up" id="signup-heading" />
        <form autoComplete="off" className="signup-form">
            <label className="dropdown-label">Select Profile Picture</label>
          <ImageUploadPreview onImageSelect={setProfileImage} />
          <CustomDropdown
            label="Select Role"
            name="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={[
              { value: "farmer", label: "Farmer" },
              { value: "agronomist", label: "Agronomist" },
            //   { value: "admin", label: "Admin" },
            ]}
          />
          <Button name="Sign Up" click={SignUp} />
        </form>
      </div>
    </div>
  );
};

export default ProfileRole;
