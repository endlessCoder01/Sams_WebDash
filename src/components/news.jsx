import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/News.css";

const API_KEY = "1d387c59e6f5ed36447522817fcc757b";

const NewsCard = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(false);

  const fetchNews = async () => {
    try {
      const res = await axios.get(
        `https://gnews.io/api/v4/search?q=agriculture&lang=en&max=10&token=${API_KEY}`
      );
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (error) {
    return (
      <div className="news-card">
        <h2 className="news-title">🌍 Agriculture News</h2>
        <p className="error-text">⚠️ Failed to load news. Please check your API key or connection.</p>
      </div>
    );
  }

  return (
    <div className="news-card">
      <h2 className="news-title">🌍 Agriculture News</h2>
      <div className="headlines-container">
        {articles.map((article, index) => (
          <div
            key={index}
            className={`headline-card ${
              article.title.toLowerCase().includes("warning") ? "warning" : ""
            }`}
          >
            <h4 className="headline">{article.title}</h4>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-link">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsCard;
