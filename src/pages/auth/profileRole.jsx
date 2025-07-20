import React, { useState } from "react";
import "../../styles/ProfileRole.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";
import CustomDropdown from "../../components/input/customdropdown";
import ImageUploadPreview from "../../components/input/ImageUploads";

const ProfileRole = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  return (
    <div className="signup-root">
      <div
        className="card signup-card glassmorphism"
        role="form"
        aria-labelledby="signup-heading"
      >
        <Heading text="Sign Up" id="signup-heading" />
        <form autoComplete="off" className="signup-form">
          <ImageUploadPreview onImageSelect={setProfileImage} />
          <Input type="text" hold="Name" autoFocus autoComplete="name" />
          <CustomDropdown
            label="Select Role"
            name="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={[
              { value: "farmer", label: "Farmer" },
              { value: "agronomist", label: "Agronomist" },
              { value: "admin", label: "Admin" },
            ]}
          />
          <Button name="Sign Up" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default ProfileRole;
