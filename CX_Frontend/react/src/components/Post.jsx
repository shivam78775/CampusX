import React from "react";
import { Avatar } from "./Avatar";
import PostFooter from "./PostFooter";

export default function Post({ post, currentUserId }) {
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
        <PostFooter post={post}/>
        </div>
    </div>
  );
}
