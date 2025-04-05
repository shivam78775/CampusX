import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { FiImage } from "react-icons/fi";
import Footer from "../components/Footer";

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState(""); // 🔥 Hashtags state
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && !image) return;

    const finalContent = hashtags
      ? `${content.trim()}\n\n${hashtags.trim()}`
      : content.trim();

    const formData = new FormData();
    formData.append("content", finalContent); // ✅ Combined content + tags
    if (image) formData.append("postpic", image);

    try {
      const res = await axios.post(
        "http://localhost:4444/api/v1/post/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Post created:", res.data);
      navigate("/home");
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="min-h-screen w-screen flex justify-center bg-white px-4 pt-8 pb-20 overflow-x-hidden">
      <div className="w-full max-w-md min-w-[350px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span
            onClick={() => navigate(-1)}
            className="cursor-pointer hover:opacity-70 transition"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              className="w-8 h-8 text-gray-500"
            />
          </span>
          <h2 className="text-xl font-bold text-black">Create Post</h2>
          <div className="w-8" />
        </div>

        {/* Post Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 bg-white p-4 rounded-2xl shadow-lg text-gray-500"
        >
          <textarea
            placeholder="What's on your mind?"
            className="border border-gray-200 rounded-xl p-4 w-full resize-none h-36 focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-3">
            {/* Image Upload */}
            <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-green-700 text-sm font-medium border border-dashed border-green-300 py-2 rounded-xl hover:bg-green-50 truncate">
              <FiImage size={18} />
              {image
                ? image.name.length > 20
                  ? image.name.slice(0, 20) + "..."
                  : image.name
                : "Add Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Hashtag Input */}
            <input
              type="text"
              placeholder="# Tags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#eafe31] to-[#d2f93c] text-black font-semibold py-3 rounded-2xl shadow-md hover:opacity-90 transition duration-200"
          >
            Post
          </button>
        </form>
         {/* Footer */}
         <Footer />

      </div>
    </div>
  );
}
