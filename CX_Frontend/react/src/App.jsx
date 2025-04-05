import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CreatePostPage from './pages/CreatePost';
import Profile from './pages/Profile';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/verify-email/" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
