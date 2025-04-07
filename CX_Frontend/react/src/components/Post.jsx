import { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";
import { Avatar } from "./Avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MessageMultiple02Icon,
  Share01Icon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons";

export default function Post({ post, currentUserId }) {
  const [likes, setLikes] = useState(post?.likes || []);
  const [comments, setComments] = useState(post?.comments || []);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(likes.includes(currentUserId));
  }, [likes, currentUserId]);

  useEffect(() => {
    const handlePostLiked = ({ postId, updatedLikes }) => {
      if (postId === post._id) {
        setLikes(updatedLikes);
      }
    };
  
    socket.on("post-liked", handlePostLiked);
  
    return () => {
      socket.off("post-liked", handlePostLiked);
    };
  }, [post._id]);
  
  function getRelativeTime(date) {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "• Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `• ${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `• ${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30)
      return `• ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12)
      return `• ${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `• ${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  }

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4444/api/v1/post/like-unlike/${post._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.liked) {
        setLikes((prev) => [...prev, currentUserId]);
        socket.emit("like-post", { postId: post._id }); // ✅ This must be emitted
      } else {
        setLikes((prev) => prev.filter((id) => id !== currentUserId));
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async () => {
    const text = prompt("Write your comment:");
    if (!text) return;

    try {
      const res = await axios.post(
        `http://localhost:4444/api/v1/post/comment/${post._id}`,
        { text },
        { withCredentials: true }
      );
      setComments((prev) => [...prev, res.data.comment]);
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl shadow-sm text-black min-w-[350px] mb-11">
      {/* Post Header */}
      <div className="flex items-center p-3">
        <Avatar className="w-10 h-10 mr-3" />
        <div>
          <p className="font-semibold text-black mx-2">
            @{post?.user?.username || "username"}
          </p>
          <p className="text-xs text-gray-500 mx-2">
            {post?.date ? getRelativeTime(post.date) : "•Just now"}
          </p>
        </div>
      </div>

      {/* Post Image */}
      {post?.postpic && (
        <img src={post.postpic} alt="Post" className="w-full object-cover" />
      )}

      {/* Post Body */}
      <div className="p-3">
        <p className="text-sm">
          <span className="font-semibold">@{post?.user?.username}</span>{" "}
          {post?.content}
        </p>
        <div className="flex space-x-4 my-2 justify-between items-center">
          <div className="flex gap-2">
            <HugeiconsIcon
              icon={ThumbsUpIcon}
              onClick={handleLike}
              className={`cursor-pointer ${
                isLiked ? "text-blue-500" : "text-black"
              }`}
            />
            <p className="text-sm pt-1 text-gray-500">{likes.length} Likes</p>
          </div>
          <div className="flex gap-2">
            <HugeiconsIcon
              icon={MessageMultiple02Icon}
              className="text-black cursor-pointer"
              onClick={handleComment}
            />
            <p
              className="text-sm pt-1 text-gray-500 cursor-pointer"
              onClick={handleComment}
            >
              {comments.length} Comments
            </p>
          </div>

          <HugeiconsIcon
            icon={Share01Icon}
            className="text-black cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
