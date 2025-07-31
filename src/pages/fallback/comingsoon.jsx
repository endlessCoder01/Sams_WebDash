import React from "react";
import Lottie from "lottie-react";
import rocketAnimation from "./rocket.json";
import "./SensorsFallback.css";

const SensorsFallback = () => {
  return (
    <div className="sensors-container">
      <Lottie animationData={rocketAnimation} loop={true} className="rocket" />
      <h1>Sensors Coming Soon 🚀</h1>
      <p>We are working hard to integrate smart sensors into your dashboard. Stay tuned!</p>
    </div>
  );
};

export default SensorsFallback;
