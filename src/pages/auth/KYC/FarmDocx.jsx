import React, { useState } from "react";
import "../../../styles/ProfileRole.css";
import Input from "../../../components/input/Input";
import Heading from "../../../components/headings/Heading";
import Button from "../../../components/buttons/Button";
import CustomDropdown from "../../../components/input/customdropdown";
import ImageUploadPreview from "../../../components/input/ImageUploads";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../../services/config";
import Swal from "sweetalert2";


const FarmRegistration = () => {
  const { userId } = useParams(); 

  console.log("id yauya", userId)
  const [name, setName] = useState();
  const [location, setLocation] = useState();
  const [type, setType] = useState();
  const [size, setSize] = useState();
  const [nId, setNId] = useState(null);
  const [deeds, setDeeds] = useState(null);
  const [regLicense, setRegLicense] = useState(null);
  const [layout, setLayout] = useState(null);
  const [insurance, setInsurance] = useState(null);

  const navigate = useNavigate();
  const SignUp = async () => {
    await RegisterFarm();
  };

const handleImageUpload = async (file) => {
  console.log("Image URI (File):", file);

  // ✅ Return "N/A" immediately if file is null or undefined
  if (file === null || file === undefined) {
    return "N/A";
  }

  // ✅ Only validate the file if it actually exists
  if (!(file instanceof File)) {
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

    if (url === "" || url === null || url === undefined) return;
    if (userId === "" || userId === null || userId === undefined) return;
    if (title === "" || title === null || title === undefined) return;
    if (description === "" || description === null || description === undefined)return;

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

  const RegisterFarm = async () => {
    const nationalID = await handleImageUpload(nId);
    const Tdeeds = await handleImageUpload(deeds);
    const license = await handleImageUpload(regLicense);
    const Flayout = await handleImageUpload(layout);
    const Cinsurance = await handleImageUpload(insurance);

    const newFarm = {
      user_id: userId,
      farm_name: name,
      location: location,
      size: size,
      soil_type: type,
    };

    console.log(newFarm)

    try {
      const response = await fetch(`${API}/auth/register/farm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFarm),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create user: ${errorText}`);
      }
      await sendToDocuments(nationalID, userId, "ID", "Zimbabwe National ID");
      await sendToDocuments(Tdeeds, userId, "Title Deeds", "Farm Title deeds");
      await sendToDocuments(
        license,
        userId,
        "License",
        "Farm Registration License"
      );
      await sendToDocuments(Flayout, userId, "Layout", "Farm Layout");
      await sendToDocuments(Cinsurance, userId, "Insurance", "Crop Insurance");

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Farm registered successfully.",
        confirmButtonColor: "#3085d6",
      });

       navigate('/');
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
        <ImageUploadPreview onImageSelect={setDeeds} />

        <label className="dropdown-label">National ID Image</label>
        <ImageUploadPreview onImageSelect={setNId} />

        <label className="dropdown-label">
          Farm Registration License Image
        </label>
        <ImageUploadPreview onImageSelect={setRegLicense} />

        <label className="dropdown-label">Farm Layout Image</label>
        <ImageUploadPreview onImageSelect={setLayout} />

        <label className="dropdown-label">Crop Insurance Image</label>
        <ImageUploadPreview onImageSelect={setInsurance} />

        <Input type="text" hold="Farm Name" changed={changedFarmName} />

        <Input type="text" hold="Farm Address" changed={changedLocation} />
        <CustomDropdown
          label="Select Soil Type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: "sandy", label: "Sandy" },
            { value: "silty", label: "Silty" },
            { value: "clay", label: "Clay" },
            { value: "loam", label: "Loam" },
            { value: "peat", label: "Peat" },
          ]}
        />
        <Input type="text" hold="Size (in hectares)" changed={changedSize} />

        <Button name="Register Farm" click={SignUp} />
      </div>
    </div>
  );
};

export default FarmRegistration;
