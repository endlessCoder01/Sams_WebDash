import './App.css';
import Login from './pages/auth/login';
import SignUp from './pages/auth/signUp';
import WeatherCard from './components/weather';
import NewsCard from './components/news';
import NewsCard2 from './components/News3';

function App() {
  const sampleData = {
  temperature: 28,
  skyState: "Clear Sky",
  windSpeed: 10,
  windDirection: "E",
  humidity: 58,
  timestamp: new Date(),
  graphData: [
    { time: "Morning", temp: 22 },
    { time: "Afternoon", temp: 28 },
    { time: "Evening", temp: 24 },
    { time: "Night", temp: 18 },
  ],
};

  return (
    // <div className="App">
    // <UploadImages/>
    // </div>

        <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: "20px" }}>
      <NewsCard2 />
    </div>
  );
}

export default App;
