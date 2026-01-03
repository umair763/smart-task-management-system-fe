import { Bell, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

export const Header = () => {
  // Get user from Redux
  const { user } = useSelector((state) => state.auth);

  // Image normalization helpers (copy from settings.jsx)
  const API_ORIGIN = import.meta.env.VITE_API_URL;
  const API_PREFIX = "/api/v1";
  const SERVER_ORIGIN = useMemo(() => {
    try {
      return new URL(API_ORIGIN).origin;
    } catch {
      return "http://localhost:3000";
    }
  }, [API_ORIGIN]);
  const normalizeUploadPath = (path) => {
    if (!path || typeof path !== "string") return path;
    if (path.startsWith(`${API_PREFIX}/uploads/`)) {
      return path.replace(`${API_PREFIX}/uploads/`, "/uploads/");
    }
    if (path.startsWith("api/v1/uploads/")) {
      return path.replace("api/v1/uploads/", "uploads/");
    }
    if (path.includes("/api/v1/uploads/")) {
      return path.replace("/api/v1/uploads/", "/uploads/");
    }
    return path;
  };
  const toAbsoluteUrl = (maybeUrl) => {
    if (!maybeUrl || typeof maybeUrl !== "string") return null;
    const normalized = normalizeUploadPath(maybeUrl);
    if (maybeUrl.startsWith("data:")) return maybeUrl;
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
      return normalized;
    }
    if (normalized.startsWith("/")) return `${SERVER_ORIGIN}${normalized}`;
    return `${SERVER_ORIGIN}/${normalized}`;
  };

  // Compose display name and image
  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.username ||
      "User"
    : "User";
  const displayTitle = user?.title || "";
  const profileImageUrl = toAbsoluteUrl(
    user?.profileImage || user?.avatar || user?.image || user?.photo
  );
  const [imgError, setImgError] = useState(false);

  return (
    <header className="w-[98%] h-18 flex items-center px-4 md:px-8 rounded-3xl bg-[#C6532A] mt-1 ml-2 mx-auto">
      {/* Search bar */}
      <div className="flex-1 flex items-center">
        <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-2 w-full max-w-[340px] h-10">
          <input
            type="text"
            placeholder="Type here to search"
            className="bg-transparent outline-none text-[#232323] placeholder-gray-500 w-full text-sm"
            style={{ letterSpacing: "0.01em" }}
          />
        </div>
      </div>

      {/* Notification bell */}
      <div className="flex items-center mx-4">
        <button className="relative p-2 rounded-full hover:bg-[#DF5B28] cursor-pointer transition">
          <Bell className="w-6 h-6 text-white" />
          {/* Notification dot (optional) */}
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
        </button>
      </div>

      {/* User profile */}
      <div className="flex items-center gap-2 min-w-[180px] justify-end">
        <div className="w-8 h-8 rounded-full border-2 border-[#ff5c1a] flex items-center justify-center overflow-hidden bg-[#5B2D88]">
          {profileImageUrl && !imgError ? (
            <img
              src={profileImageUrl}
              alt={displayName}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-white text-base font-semibold">
              {displayName[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div className="flex flex-col items-start justify-center leading-tight">
          <span className="text-sm font-medium text-white">{displayName}</span>
          {displayTitle && (
            <span className="text-[11px] text-white px-2 mt-0.5 border border-[#020202]/60 rounded-full p-0.5">
              {displayTitle}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
