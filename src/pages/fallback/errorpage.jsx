import React from "react";
import Lottie from "lottie-react";
import astroAnimation from "./astronaut-with-space-shuttle.json";
import "./ComingSoon.css";

const ErrorFallback = () => {
  return (
    <div className="sensors-container">
      <Lottie animationData={astroAnimation} loop={true} className="rocket" />
      <h1>An Error Occured we are looking into it</h1>
      <p>Stay tuned!</p>
    </div>
  );
};

export default ErrorFallback;
