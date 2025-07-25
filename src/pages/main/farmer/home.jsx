import React, { useState } from 'react';
import WeatherCard from './WeatherCard';
import TasksCard from './TasksCard';
import NewsCard from './NewsCard';
import './HomePage.css';

const dummyAlerts = [
  'Fertilizer stock is low.',
  'Rain expected tomorrow.',
  'Farm equipment maintenance overdue.',
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="home-container">
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>

      <div className="content-row">
        <div className="left-column">
          <WeatherCard />
        </div>
        <div className="right-column">
          <TasksCard searchTerm={searchTerm} />
        </div>
        <div className="alerts-panel">
          <h3>Alerts</h3>
          <ul>
            {dummyAlerts.map((alert, index) => (
              <li key={index} className="alert-item">{alert}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bottom-row">
        <NewsCard />
      </div>
    </div>
  );
};

export default HomePage;
