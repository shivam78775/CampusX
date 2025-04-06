import { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import { Grid3X3, Video, FileText } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreHorizontalCircle01Icon,
  UserEdit01Icon,
} from "@hugeicons/core-free-icons";
import { Card } from "../components/Card";
import Footer from "../components/Footer";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [imagePosts, setImagePosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        axios.defaults.withCredentials = true;

        // Step 1: Fetch logged-in user data
        const { data } = await axios.get(
          "http://localhost:4444/api/v1/user/me"
        );
        setUser(data);

        // Step 2: Fetch posts created by this user using their ID
        const res = await axios.get(
          `http://localhost:4444/api/v1/post/user/${data._id}`
        );
        const allPosts = res.data || [];

        // Split posts into imagePosts and blogPosts
        const images = allPosts.filter(
          (p) => p.postpic && p.postpic !== "default.png"
        );
        const blogs = allPosts.filter(
          (p) => !p.postpic || p.postpic === "default.png"
        );

        setImagePosts(images);
        setBlogPosts(blogs);
      } catch (error) {
        console.error("Error fetching profile or posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, []);

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const seconds = Math.floor((now - posted) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user)
    return <div className="text-center text-red-500 mt-20">User not found</div>;

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
            <div className="absolute top-2 right-2 flex gap-3 mx-3 mt-3">
              <HugeiconsIcon icon={UserEdit01Icon} />
              <HugeiconsIcon icon={MoreHorizontalCircle01Icon} fill="black" />
            </div>
          </div>

          <div className="mt-16 px-4 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <p className="text-sm mt-1 text-gray-600">🎓 CampusX Student</p>
              </div>
              
            </div>

            {/* Stats */}
            <div className="flex justify-between text-center mt-4">
              <div>
                <p className="font-bold">{user.posts.length}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div>
                <p className="font-bold">{user.followers?.length || 0}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="font-bold">{user.following?.length || 0}</p>
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
                      <div className="flex items-center p-3">
                        <div>
                          <p className="font-semibold text-black mx-2">
                            @{post?.username}
                          </p>
                          <p className="text-xs text-gray-500 mx-2">
                            {post?.createdAt
                              ? getRelativeTime(post.createdAt)
                              : "• Just now"}
                          </p>
                        </div>
                      </div>

                      {post?.postpic && post.postpic !== "default" && (
                        <img
                          src={post.postpic}
                          alt="Post"
                          className="w-full object-cover"
                        />
                      )}

                      <div className="p-3">
                        <p className="text-sm">
                          <span className="font-semibold">
                            @{post?.username}
                          </span>{" "}
                          {post?.caption || "No description."}
                        </p>
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
