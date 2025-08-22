import "./App.css";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signUp";
import ProfileRole from "./pages/auth/profileRole";
import TodayActivityCard from "./components/activity/activitycard";
import HomePage from "./pages/main/farmer/home";
import Navbar from "./components/navbars/farmernav";
import TaskTable from "./components/tasktable";
import AllWorkers from "./pages/main/farmer/allworkers";
import AlertsPage from "./pages/main/farmer/alerts";
import SensorsFallback from "./pages/fallback/comingsoon";
import ProfilePage from "./pages/main/farmer/profile";
import FarmRegistration from "./pages/auth/KYC/farmDocx";
import HomePageWorker from "./pages/main/worker/home";
import WorkerNavbar from "./components/navbars/workerNav";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  const handleLogin = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
  };

  return (
    <div className="App">
      <Router>
        {/* Show navbar depending on role */}
        {isAuthenticated && (role === "admin" || role === "farmer" || role === "agronomist") && <Navbar />}
        {isAuthenticated && role === "worker" && <WorkerNavbar />}

        <Routes>
          {isAuthenticated ? (
            role === "admin" || role === "farmer" || role === "agronomist" ? (
              <>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/soon" element={<SensorsFallback />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/workers" element={<AllWorkers />} />
                <Route path="/tasks" element={<TaskTable />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/activity" element={<TodayActivityCard />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </>
            ) : role === "worker" ? (
              <>
                <Route path="/home/worker" element={<HomePageWorker />} />
                <Route path="*" element={<Navigate to="/home/worker" replace />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" replace />} />
            )
          ) : (
            <>
              <Route path="/signup_farm/:userId" element={<FarmRegistration />} />
              <Route path="/signup_profile_role" element={<ProfileRole />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}


export default App;
