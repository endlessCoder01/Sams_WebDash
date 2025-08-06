import React, { useState } from "react";
import "../../../styles/ProfileRole.css";
import Input from "../../../components/input/Input";
import Heading from "../../../components/headings/Heading";
import Button from "../../../components/buttons/Button";
import CustomDropdown from "../../../components/input/customdropdown";
import ImageUploadPreview from "../../../components/input/ImageUploads";
import { useNavigate } from "react-router-dom";
import { API } from "../../../services/config";
import Swal from "sweetalert2";

const FarmRegistration = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [address, setAddress] = useState();
  const [name, setName] = useState();
  const [location, setLocation] = useState();
  const [type, setType] = useState();
  const [size, setSize] = useState();
  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();
  const SignUp = async () => {
    await createUser();
  };

  const handleImageUpload = async (file) => {
    console.log("Image URI (File):", file);

    if (!file || !(file instanceof File)) {
      throw new Error("Invalid image file");
    }

    const formData = new FormData();
    formData.append("image", file);

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
      return data.path; // adjust this based on your backend response
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  const sendToDocuments = async (url, userId, title, description) => {
    const newData = {
      user_id: userId,
      title: title,
      description: description,
      file_url: url,
    };

    try {
      const response = await fetch(`${API}/auth/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create user: ${errorText}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
    }
  };

  const createUser = async () => {
    let info = localStorage.getItem("info");
    const userInfo = await JSON.parse(info);

    const profile = await handleImageUpload(profileImage);
    const newUser = {
      name: userInfo.name,
      email: userInfo.email,
      password: userInfo.password,
      profile_picture: profile,
    };

    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create user: ${errorText}`);
      }

      const userRes = await response.json();
      const toDoc = await sendToDocuments(profile, userRes.id);

      if (toDoc) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User account created successfully.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong during registration.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong during registration.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const changedFarmName = (event) => {
    setName(event.target.value);
  };

  const changedLocation = (event) => {
    setLocation(event.target.value);
  };

  const changedSize = (event) => {
    setSize(event.target.value);
  };

  return (
    <div className="signup-root">
      <div
        className="card signup-card glassmorphism"
        role="form"
        aria-labelledby="signup-heading"
      >
        <Heading text="Register Farm" id="signup-heading" />

        <label className="dropdown-label">Title Deeds Image</label>
        <ImageUploadPreview onImageSelect={setProfileImage} />

        <label className="dropdown-label">National ID Image</label>
        <ImageUploadPreview onImageSelect={setProfileImage} />

        <label className="dropdown-label">Farm Registration License Image</label>
        <ImageUploadPreview onImageSelect={setProfileImage} />

        <label className="dropdown-label">Farm Layout Image</label>
        <ImageUploadPreview onImageSelect={setProfileImage} />

        <label className="dropdown-label">Crop Insurance Image</label>
        <ImageUploadPreview onImageSelect={setProfileImage} />

        <Input type="text" hold="Farm Name" changed={changedFarmName} />

        <Input type="text" hold="Farm Address" changed={changedLocation} />
        <CustomDropdown
          label="Select Soil Type"
          name="role"
          value={selectedRole}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: "farmer", label: "Farmer" },
            { value: "agronomist", label: "Agronomist" },
            //   { value: "admin", label: "Admin" },
          ]}
        />
        <Input type="text" hold="Size (in hectares)" changed={changedSize} />

        <Button name="Sign Up" click={SignUp} />
      </div>
    </div>
  );
};

export default FarmRegistration;
