import React, { useState } from "react";
import "../../styles/ProfileRole.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";
import CustomDropdown from "../../components/input/customdropdown";
import ImageUploadPreview from "../../components/input/ImageUploads";
import { useNavigate } from "react-router-dom";
import { API } from "../../services/config";

const ProfileRole = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [address, setAddress] = useState("N/A");
  const [contact, setContact] = useState();
  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();
  const SignUp = async() => {
    await createUser();
  };

  const handleImageUpload = async (imageUri) => {
    console.log("Image URI:", imageUri);

    // Convert base64 to Blob if necessary
    let blob;
    if (imageUri.startsWith("data:")) {
      const response = await fetch(imageUri);
      blob = await response.blob();
    } else {
      // If it's a file URI, use it directly
      blob = {
        uri: imageUri,
        name: imageUri.split("/").pop(),
        type: `image/${imageUri.split(".").pop()}`,
      };
    }

    const formData = new FormData();
    formData.append("image", blob);

    try {
      const response = await fetch(`${API}/uploads`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const data = await response.json();
      return data.path;
    } catch (error) {
      console.log("Upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  const createUser = async () => {
    let info = localStorage.getItem("info");
    const userInfo = await JSON.parse(info);
    console.log(userInfo);

    // const profile = await handleImageUpload(profileImage);
    const newUser = {
      name: userInfo.name,
      email: userInfo.email,
      password: userInfo.password,
      phone_number: contact,
      home_address: address,
      role: selectedRole,
      // profile_picture: profile,
    };

    console.log("Going from page 3", newUser);
    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
            console.log("honai", response);


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create customer details: ${errorText}`);
      }

    } catch (error) {
      console.error()
    }
  };

  const changedAddress = (event) => {
    setAddress(event.target.value);
  };

  const changedPhone = (event) => {
    setContact(event.target.value);
  };

  return (
    <div className="signup-root">
      <div
        className="card signup-card glassmorphism"
        role="form"
        aria-labelledby="signup-heading"
      >
        <Heading text="Sign Up" id="signup-heading" />
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
        <Input
          type="text"
          hold="Home Address"
          autoComplete="Home Address"
          changed={changedAddress}
        />
        <Input
          type="phone"
          hold="Contact"
          autoComplete="Contact"
          changed={changedPhone}
        />

        <Button name="Sign Up" click={SignUp} />
      </div>
    </div>
  );
};

export default ProfileRole;
