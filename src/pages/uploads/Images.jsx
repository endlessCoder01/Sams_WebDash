import React, { useRef } from "react";
import "../../styles/UploadImages.css";
import Heading from "../../components/headings/Heading";
import Button from "../../components/buttons/Button";

const MAX_IMAGES = 5;

const UploadImages = () => {
  const [images, setImages] = React.useState(Array(MAX_IMAGES).fill(null));
  const fileInputs = useRef([]);

  // Handle file input change
  const handleFileChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImages((imgs) => {
        const newImgs = [...imgs];
        newImgs[idx] = ev.target.result;
        return newImgs;
      });
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input
  const triggerInput = (idx) => {
    if (fileInputs.current[idx]) {
      fileInputs.current[idx].click();
    }
  };

  // Remove image
  const removeImage = (idx) => {
    setImages((imgs) => {
      const newImgs = [...imgs];
      newImgs[idx] = null;
      return newImgs;
    });
    if (fileInputs.current[idx]) {
      fileInputs.current[idx].value = ""; // reset input
    }
  };

  // Remove all images
  const resetAll = () => {
    setImages(Array(MAX_IMAGES).fill(null));
    fileInputs.current.forEach(input => input && (input.value = ""));
  };

  return (
    <div className="upload-root">
      <div className="upload-card glassmorphism">
        <Heading text="Upload 5 Images" />
        <p className="upload-desc">
          Please upload <span className="hl">{MAX_IMAGES}</span> images (JPEG or PNG).
        </p>
        <div className="images-upload-container">
          {images.map((img, idx) => (
            <div key={idx} className={`img-upload-card${img ? " has-img" : ""}`}>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={el => fileInputs.current[idx] = el}
                onChange={e => handleFileChange(e, idx)}
                aria-label={`Upload image #${idx + 1}`}
              />
              {img ? (
                <>
                  <img src={img} alt={`Uploaded #${idx + 1}`} />
                  <button className="remove-btn" onClick={() => removeImage(idx)} title="Remove">
                    ✕
                  </button>
                  <button className="replace-btn" onClick={() => triggerInput(idx)} title="Replace">
                    Replace
                  </button>
                </>
              ) : (
                <button className="upload-btn" onClick={() => triggerInput(idx)}>
                  <span className="upload-icon">📷</span>
                  <span>Upload</span>
                </button>
              )}
            </div>
          ))}
        </div>
        <Button
          name="Remove All"
          click={resetAll}
          style={{
            background: "linear-gradient(99deg, #ffd6d6 0%, #ffbcbc 100%)",
            color: "#900",
            marginTop: 24,
            maxWidth: 180,
            marginLeft: "auto",
            marginRight: "auto"
          }}
        />
      </div>
    </div>
  );
};

export default UploadImages;