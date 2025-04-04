import { Avatar } from "./Avatar";

export default function StorySection() {
  return (
    <div className="flex space-x-4 p-4 overflow-x-auto text-black">
      <div className="flex flex-col items-center">
        <Avatar className="w-12 h-12 border-2 border-green-500" />
        <span className="text-xs">Your Story</span>
      </div>
      {["called.gal", "calistah", "adamuseno"].map((user, index) => (
        <div key={index} className="flex flex-col items-center">
          <Avatar className="w-12 h-12 border-2 border-green-500" />
          <span className="text-xs">{user}</span>
        </div>
      ))}
    </div>
  );
}
