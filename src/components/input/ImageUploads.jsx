import React, { useState } from "react";
import "./ImageUploadPreview.css";

const ImageUploadPreview = ({ onImageSelect }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onImageSelect(null);
    }
  };

  return (
    <div className="image-upload-wrapper">
      <label className="image-upload-label">
        {preview ? (
          <img src={preview} alt="Preview" className="image-preview" />
        ) : (
          <div className="placeholder">Click to select image</div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="image-input"
        />
      </label>
    </div>
  );
};

export default ImageUploadPreview;
