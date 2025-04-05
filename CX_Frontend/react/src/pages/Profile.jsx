import { useState } from "react";
import { Card } from "../components/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import { Grid3X3, Video, Heart } from "lucide-react";
import Footer from "../components/Footer";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalCircle01Icon, UserEdit01Icon } from "@hugeicons/core-free-icons";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="min-h-screen w-screen flex justify-center bg-white px-4 pt-8 pb-20 overflow-x-hidden">
      <div className="flex justify-center p-4 bg-white min-h-screen text-black">
        <Card className="w-full max-w-md bg-white rounded-2xl mb-15">
          {/* Cover and Avatar */}
          <div className="relative">
            <img
              src="default.png"
              alt="Cover"
              className="w-full h-32 object-cover rounded-t-2xl"
            />
            <img
              src="default.png"
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white absolute left-4 -bottom-12"
            />

            {/* Edit & Message Buttons */}
            <div className="absolute top-2 right-2 flex gap-3 mx-3 mt-3" >
              <HugeiconsIcon icon={UserEdit01Icon} />
              <HugeiconsIcon icon={MoreHorizontalCircle01Icon} fill="black" />
              </div>
          </div>

          <div className="mt-16 px-4 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Aditya Prasodjo</h2>
                <p className="text-sm text-gray-500">@aditya_prasodjo</p>
                <p className="text-sm mt-1 text-gray-600">
                  🎥 Content creator & Filmmaker
                  <br />
                  📍 Surabaya, Indonesia
                </p>
              </div>
              <span className=" bg-gradient-to-r from-[#eafe31] to-[#d2f93c] text-black rounded-full px-4 py-1">
                Follow
              </span>
            </div>

            {/* Stats */}
            <div className="flex justify-between text-center mt-4">
              <div>
                <p className="font-bold">200</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div>
                <p className="font-bold">97.5K</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="font-bold">121</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
              <div>
                <p className="font-bold">3.25M</p>
                <p className="text-sm text-gray-500">Likes</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="posts" className="mt-6">
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
                  value="likes"
                  onClick={() => setActiveTab("likes")}
                  className="flex justify-center items-center gap-1"
                >
                  <Heart className="w-4 h-4" /> Likes
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="posts"
                className="grid grid-cols-3 gap-2 mt-4"
              >
                <img src="/post1.jpg" className="w-full rounded-lg" />
                <img src="/post2.jpg" className="w-full rounded-lg" />
                <img src="/post3.jpg" className="w-full rounded-lg" />
              </TabsContent>

              <TabsContent
                value="videos"
                className="text-center text-gray-500 mt-4"
              >
                No videos yet.
              </TabsContent>
              <TabsContent
                value="likes"
                className="text-center text-gray-500 mt-4"
              >
                No liked posts yet.
              </TabsContent>
            </Tabs>
          </div>
        </Card>
        <Footer />
      </div>
    </div>
  );
}
