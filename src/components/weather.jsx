import "../styles/WeatherCard.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import { WiHumidity, WiStrongWind, WiDirectionUp } from "react-icons/wi";
import { BsThermometerHalf } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";
import {
  WiDaySunny,
  WiCloudy,
  WiDayCloudy,
  WiRain,
  WiSnow,
  WiFog,
  WiThunderstorm,
} from "react-icons/wi";

const API_KEY = "d0b180f6a8fba3e0262b3e23937ce9ce";
const CITY = "Harare"; // or any city you want

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      );

      const temp = res.data.main.temp;
      const humidity = res.data.main.humidity;
      const windSpeed = res.data.wind.speed;
      const windDirection = res.data.wind.deg;
      const skyState = res.data.weather[0].main;
      const brief = res.data.weather[0].description;
      const icon = res.data.weather[0].icon;

      const graphData = [
        { time: "Morning", temp: temp - 2 },
        { time: "Afternoon", temp: temp },
        { time: "Evening", temp: temp - 3 },
        { time: "Night", temp: temp - 5 },
      ];

      setWeatherData({
        temperature: Math.round(temp),
        skyState,
        brief,
        windSpeed,
        windDirection: windDirection + "°",
        humidity,
        timestamp: new Date(),
        graphData,
        icon,
      });
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="weather-card center-content">
        <div className="spinner"></div>
        <p className="loading-text">Fetching weather...</p>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="weather-card center-content">
        <p className="error-text">⚠️ Unable to fetch weather data.</p>
        <button onClick={fetchWeather} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const getSkyIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <WiDaySunny size={55} />;
      case "clouds":
        return <WiCloudy size={55} />;
      case "few clouds":
      case "partly cloudy":
        return <WiDayCloudy size={55} />;
      case "rain":
      case "drizzle":
        return <WiRain size={55} />;
      case "snow":
        return <WiSnow size={55} />;
      case "mist":
      case "haze":
      case "fog":
        return <WiFog size={55} />;
      case "thunderstorm":
        return <WiThunderstorm size={55} />;
      case "wind":
        return <WiStrongWind size={55} />;
      default:
        return <WiDaySunny size={55} />;
    }
  };

  const {
    temperature,
    skyState,
    brief,
    windSpeed,
    windDirection,
    humidity,
    graphData,
    timestamp,
    icon,
  } = weatherData;

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div>
  <div className="sky-condition">
    {getSkyIcon(skyState)}
    <div className="sky-text">
      <h2 className="sky-state">{skyState}</h2>
      <p className="brief">{brief}</p>
    </div>
  </div>
  <p className="date-time">
    <AiOutlineClockCircle size={14} style={{ marginRight: "4px" }} />
    {dayjs(timestamp).format("dddd, MMM D • hh:mm A")}
  </p>
</div>

        <div className="temperature">
          <BsThermometerHalf size={28} style={{ marginRight: "6px" }} />
          {temperature}°C
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt="weather-icon"
            className="weather-icon"
          />
        </div>
      </div>

      <div className="weather-details">
        <div>
          <WiHumidity size={24} />
          <p className="label">Humidity</p>
          <p>{humidity}%</p>
        </div>
        <div>
          <WiStrongWind size={24} />
          <p className="label">Wind</p>
          <p>{windSpeed} km/h</p>
        </div>
        <div>
          <WiDirectionUp size={24} />
          <p className="label">Direction</p>
          <p>{windDirection}</p>
        </div>
      </div>

      <div className="weather-chart">
        <h4 className="chart-title">Temp Chart</h4>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={graphData}>
            <XAxis dataKey="time" stroke="#fff" fontSize={10} />
            <Tooltip
              contentStyle={{ backgroundColor: "#000", borderColor: "#FCE023" }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#FCE023"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherCard;
