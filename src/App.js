import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signUp";
import ProfileRole from "./pages/auth/profileRole";
import TodayActivityCard from "./components/activity/activitycard";
import HomePage from "./pages/main/farmer/home";
import Navbar from "./components/navbars/farmernav";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/activity" element={<TodayActivityCard />} />
          <Route path="/signup_profile_role" element={<ProfileRole />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
