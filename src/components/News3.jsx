import React from "react";
import AgriNewsSlider from "./news2";
import "../styles/News.css";

const NewsCard2 = () => {
  return (
    <div className="news-card">
      <h2 className="news-title">🌍 Latest Agricultural News</h2>
      <AgriNewsSlider />
    </div>
  );
};

export default NewsCard2;
