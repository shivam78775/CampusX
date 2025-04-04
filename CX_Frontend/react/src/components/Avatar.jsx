export function Avatar({ src, alt = "User Avatar", size = "w-12 h-12" }) {
    return (
      <div className={`relative inline-block ${size}`}>
        <img
          src={src || "/default-avatar.png"}
          alt={alt}
          className="rounded-full object-cover w-full h-full border border-gray-300"
        />
      </div>
    );
  }
  