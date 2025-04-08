import { useEffect } from "react";
import socket from "./socket"; // make sure this is the correct import path
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CreatePostPage from './pages/CreatePost';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SearchUsers from './pages/SearchUsers';
import UpdateProfilePage from "./pages/UpdateProfilePage";
import SinglePostPage from "./pages/SinglePostPage";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile/update" element={<UpdateProfilePage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/search/users" element={<SearchUsers />} />
        <Route path="/verify-email/" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/post/:postId" element={<SinglePostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
