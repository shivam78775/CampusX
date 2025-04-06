import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "../components/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import { Avatar} from "../components/Avatar";
import { Grid3X3, Video, FileText } from "lucide-react"; // FileText for blogs
import Footer from "../components/Footer";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreHorizontalCircle01Icon,
  UserEdit01Icon,
} from "@hugeicons/core-free-icons";

export default function ProfilePage() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("posts");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // default image to detect "blog-type" post
  const defaultPostPic = "default.png";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `http://localhost:4444/api/v1/user/profile/${username}`
        );
        setUser(res.data.user);
        setPosts(res.data.posts);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile.");
        setLoading(false);
        console.error("Profile fetch error:", err);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  if (loading)
    return <div className="text-center mt-10">Loading profile...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  // Separate posts: imagePosts and blogPosts
  const imagePosts = posts.filter(
    (post) => post.postpic && post.postpic !== defaultPostPic
  );
  const blogPosts = posts.filter(
    (post) => !post.postpic || post.postpic === defaultPostPic
  );

  return (
    <div className="min-h-screen w-screen flex justify-center bg-white overflow-x-hidden">
      <div className="flex justify-center p-4 bg-white min-h-screen text-black">
        <Card className="w-full max-w-md bg-white rounded-2xl mb-15">
          {/* Cover and Avatar */}
          <div className="relative">
            <img
              src="/cover-placeholder.jpg"
              alt="Cover"
              className="w-full h-32 object-cover rounded-t-2xl"
            />
            <img
              src={user.profilepic || "default.png"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white absolute left-4 -bottom-12"
            />
            
          </div>

          <div className="mt-16 px-4 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <p className="text-sm mt-1 text-gray-600">🎓 CampusX Student</p>
              </div>
              <span className="bg-gradient-to-r from-[#eafe31] to-[#d2f93c] text-black rounded-full px-4 py-1">
                Follow
              </span>
            </div>

            {/* Stats */}
            <div className="flex justify-between text-center mt-4">
              <div>
                <p className="font-bold">{user.postsCount}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div>
                <p className="font-bold">{user.followersCount}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="font-bold">{user.followingCount}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="posts" className="mt-6 mb-6">
              <TabsList className="grid grid-cols-3 bg-gray-100 rounded-xl overflow-hidden">
                <TabsTrigger
                  value="posts"
                  onClick={() => setActiveTab("posts")}
                  className="flex justify-center items-center gap-1"
                >
                  <Grid3X3 className="w-4 h-4" /> Posts
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  onClick={() => setActiveTab("videos")}
                  className="flex justify-center items-center gap-1"
                >
                  <Video className="w-4 h-4" /> Videos
                </TabsTrigger>
                <TabsTrigger
                  value="blogs"
                  onClick={() => setActiveTab("blogs")}
                  className="flex justify-center items-center gap-1"
                >
                  <FileText className="w-4 h-4" /> Blogs
                </TabsTrigger>
              </TabsList>

              {/* Posts tab */}
              <TabsContent
                value="posts"
                className="grid grid-cols-3 gap-2 mt-4"
              >
                {imagePosts.length === 0 ? (
                  <p className="col-span-3 text-center text-gray-500">
                    No posts yet.
                  </p>
                ) : (
                  imagePosts.map((post) => (
                    <img
                      key={post._id}
                      src={post.postpic}
                      alt="Post"
                      className="w-full h-32 object-cover rounded-lg border-[0.5px] border-gray-700"
                    />
                  ))
                )}
              </TabsContent>

              {/* Videos tab */}
              <TabsContent
                value="videos"
                className="text-center text-gray-500 mt-4"
              >
                No videos yet.
              </TabsContent>

              {/* Blogs tab */}
              <TabsContent
                value="blogs"
                className="text-left text-gray-800 mt-4"
              >
                {blogPosts.length === 0 ? (
                  <p className="text-center text-gray-500">No blogs yet.</p>
                ) : (
                  blogPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-gray-50 rounded-xl shadow-sm text-black min-w-[350px] mb-11"
                    >
                      {/* Post Header */}
                      <div className="flex items-center p-3">
                        <Avatar className="w-10 h-10 mr-3" />
                        <div>
                          <p className="font-semibold text-black mx-2">
                            @{post?.username || "username"}
                          </p>
                          <p className="text-xs text-gray-500 mx-2">
                            {post?.date
                              ? getRelativeTime(post.date)
                              : "• Just now"}
                          </p>
                        </div>
                      </div>

                      {/* Post Image (optional) */}
                      {post?.postpic && post.postpic !== "default" && (
                        <img
                          src={post.postpic}
                          alt="Post"
                          className="w-full object-cover"
                        />
                      )}

                      {/* Post Body */}
                      <div className="p-3">
                        <p className="text-sm">
                          <span className="font-semibold">
                            @{post?.username}
                          </span>{" "}
                          {post?.caption || "No description."}
                        </p>
                        {/* Optional: Add interactions if needed */}
                        {/* 
          <div className="flex space-x-4 my-2 justify-between items-center">
            <div className="flex gap-2">
              <HugeiconsIcon
                icon={ThumbsUpIcon}
                className="cursor-pointer text-black"
              />
              <p className="text-sm pt-1 text-gray-500">{post.likes?.length || 0} Likes</p>
            </div>
            <div className="flex gap-2">
              <HugeiconsIcon
                icon={MessageMultiple02Icon}
                className="text-black cursor-pointer"
              />
              <p className="text-sm pt-1 text-gray-500 cursor-pointer">
                {post.comments?.length || 0} Comments
              </p>
            </div>
            <HugeiconsIcon
              icon={Share01Icon}
              className="text-black cursor-pointer"
            />
          </div>
          */}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </Card>
        <Footer />
      </div>
    </div>
  );
}
   