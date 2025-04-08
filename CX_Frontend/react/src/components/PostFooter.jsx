import React, { useState, useEffect } from "react";
import socket from "../socket";
import axios from "axios";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MessageMultiple02Icon,
  Share01Icon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons";

function PostFooter({ post, currentUserId }) {
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
  
    const handleLike = async () => {
      try {
        const res = await axios.post(
          `http://localhost:4444/api/v1/post/like-unlike/${post._id}`,
          {},
          { withCredentials: true }
        );
  
        if (res.data.liked) {
          setLikes((prev) => [...prev, currentUserId]);
          socket.emit("like-post", { postId: post._id });
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
    );
  }
  
  export default PostFooter;
  