import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signUp";
import ProfileRole from "./pages/auth/profileRole";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/signup_profile_role" element={<ProfileRole />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
