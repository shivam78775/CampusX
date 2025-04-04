import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import StorySection from "../components/StorySection";
import Footer from "../components/Footer";
import Post from "../components/Post";
import Logo from "../assets/Logo.png";
import axios from "axios";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:4444/api/v1/post/all", {
          withCredentials: true, // 🔥 IMPORTANT: This sends the cookie!
        }); // Update URL if needed
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white w-screen px-6">
      <div className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-md bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <img src={Logo} alt="CampusX Logo" className="h-20" />
            <div className="flex space-x-3">
              <span className="text-lg">🔔</span>
              <span className="text-lg">✉️</span>
            </div>
          </div>

          {/* Stories */}
          <StorySection />

          {/* Posts */}
          <div className="p-4 space-y-6">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
          {/* Footer */}
          <Footer />

          
        </div>
      </div>
    </div>
  );
}
