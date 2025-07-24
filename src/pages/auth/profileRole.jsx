import React, { useState } from "react";
import "../../styles/ProfileRole.css";
import Input from "../../components/input/Input";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";
import CustomDropdown from "../../components/input/customdropdown";
import ImageUploadPreview from "../../components/input/ImageUploads";
import { useNavigate } from "react-router-dom";
import { API } from "../../services/config";
import Swal from 'sweetalert2';

const ProfileRole = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [address, setAddress] = useState("N/A");
  const [contact, setContact] = useState();
  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();
  const SignUp = async () => {
    await createUser();
  };

  // const handleImageUpload = async (imageUri) => {
  //   // console.log("Image", imageUri);
  //   const formData = new FormData();
  //   const fileName = imageUri.split("/").pop();
  //   const type = `image/${fileName.split(".").pop()}`;

  //   formData.append("image", {
  //     uri: imageUri,
  //     name: fileName,
  //     type: type,
  //   });

  //   try {
  //     const response = await fetch(`${API_URL_UPLOADS}/uploads`, {
  //       method: "POST",
  //       body: formData,
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     const data = await response.json();
  //     return `${data.path}`; // Return the full URL
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     throw new Error("Failed to upload image");
  //   }
  // };

  // const handleImageUpload = async (imageUri) => {
  //   console.log("Image URI:", imageUri);

  //   // let blob;
  //   // if (imageUri.startsWith("data:")) {
  //   //   const response = await fetch(imageUri);
  //   //   blob = await response.blob();
  //   // } else {
  //   //   blob = {
  //   //     uri: imageUri,
  //   //     name: imageUri.split("/").pop(),
  //   //     type: `image/${imageUri.split(".").pop()}`,
  //   //   };
  //   // }

  //   const formData = new FormData();
  //   const fileName = imageUri.split("/").pop();
  //   const type = `image/${fileName.split(".").pop()}`;

  //   formData.append("image", {
  //     uri: imageUri,
  //     name: fileName,
  //     type: type,
  //   });

  //   try {
  //     const response = await fetch(`${API}/uploads`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`Upload failed: ${errorText}`);
  //     }

  //     const data = await response.json();
  //     return data.path;
  //   } catch (error) {
  //     console.log("Upload error:", error);
  //     throw new Error("Failed to upload image");
  //   }
  // };

  const handleImageUpload = async (imageUri) => {
  console.log("Image URI:", imageUri);

  // 🛡️ Ensure it's a string
  const uri = typeof imageUri === "string" ? imageUri : imageUri?.uri;

  if (!uri) {
    throw new Error("Invalid image URI");
  }

  const formData = new FormData();
  const fileName = uri.split("/").pop();
  const type = `image/${fileName.split(".").pop()}`;

  formData.append("image", {
    uri: uri,
    name: fileName,
    type: type,
  });

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

  const profile = await handleImageUpload(profileImage);
  const newUser = {
    name: userInfo.name,
    email: userInfo.email,
    password: userInfo.password,
    phone_number: contact,
    home_address: address,
    role: selectedRole,
    profile_picture: profile,
  };

  console.log("Going from page 3", newUser);

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
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

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'User account created successfully.',
      confirmButtonColor: '#3085d6',
    });

  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message || 'Something went wrong during registration.',
      confirmButtonColor: '#d33',
    });
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
