// AgriNewsSlider.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/News2.css";

const API_KEY = "1d387c59e6f5ed36447522817fcc757b";

const countries = [
  { code: "us", label: "USA" },
  { code: "gb", label: "UK" },
  { code: "za", label: "South Africa" },
  { code: "ng", label: "Nigeria" }
];

const topics = ["agriculture", "farming", "climate", "crop", "drought"];

const AgriNewsSlider = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(false);
  const [country, setCountry] = useState("za");
  const [topic, setTopic] = useState("agriculture");

  const fetchNews = async () => {
    try {
      const res = await axios.get(
        `https://gnews.io/api/v4/search?q=${topic}&lang=en&country=${country}&max=10&token=${API_KEY}`
      );
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [country, topic]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h2>🌾 International Agriculture News</h2>
        <div className="filters">
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="error-text">
          ⚠️ Could not load news. Please check API Key or Internet.
        </div>
      ) : (
        <Slider {...settings}>
          {articles.map((article, index) => (
            <div
              key={index}
              className={`slide-card ${
                article.title.toLowerCase().includes("warning") ? "warning" : ""
              }`}
            >
              <h4 className="slide-title">📰 {article.title}</h4>
              <p className="slide-desc">
                {article.description?.slice(0, 120)}
                {article.description?.length > 120 && "..."}
              </p>
              <div className="slide-footer">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-link"
                >
                  🔗 Read Full Article
                </a>
                <p className="source-name">{article.source?.name}</p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default AgriNewsSlider;

