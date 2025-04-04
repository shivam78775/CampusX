import { Avatar } from "./Avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MessageMultiple02Icon,
  Share01Icon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons";

export default function Post({ post }) {
  return (
    <div className="bg-gray-50 rounded-xl shadow-sm text-black min-w-[350px] mb-11 ">
      {/* Post Header */}
      <div className="flex items-center p-3">
        <Avatar className="w-10 h-10 mr-3" />
        <div>
          <p className="font-semibold text-black mx-2">
            @{post?.user?.username || "username"}
          </p>
          <p className="text-xs text-gray-500 mx-2">
            •{" "}
            {post?.date
              ? new Date(post.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now"}
          </p>
        </div>
      </div>

      {/* Post Image */}
      {post?.image ? (
        <img src={post.image} alt="Post" className="w-full h-64 object-cover" />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">
          No image
        </div>
      )}

      {/* Post Body */}
      <div className="p-3">
        <p className="text-sm">
          <span className="font-semibold">
            @{post?.user?.username || "username"}
          </span>{" "}
          {post?.content || "This is a sample caption."}
        </p>
        <div className="flex space-x-4 my-2">
          <HugeiconsIcon icon={ThumbsUpIcon} />
          <p className="text-sm pt-1">{post?.likes?.length || 0} Likes</p>
          <HugeiconsIcon icon={MessageMultiple02Icon} />
          <HugeiconsIcon icon={Share01Icon} />{" "}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          View all {post?.comments?.length || 0} comments
        </p>
      </div>
    </div>
  );
}
