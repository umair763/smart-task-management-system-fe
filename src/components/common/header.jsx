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
    <header className="w-[98%] h-16 flex items-center px-4 md:px-8 rounded-2xl bg-white border border-[#E2E8F0] mt-2 ml-2 mx-auto shadow-sm">
      {/* Search bar */}
      <div className="flex-1 flex items-center text-[#0F172A] font-bold text-xs md:text-xl lg:text-xl tracking-tight">
        <h1>Transform Chaos Into Clarity</h1>
      </div>

      {/* Notification bell */}
      <div className="flex items-center mx-4">
        <button className="relative p-2 rounded-full hover:bg-[#F1F5F9] cursor-pointer transition-all duration-200">
          <Bell className="w-5 h-5 text-[#475569]" />
          {/* Notification dot (optional) */}
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
        </button>
      </div>

      {/* User profile */}
      <div className="flex items-center gap-2 min-w-[180px] justify-end">
        <div className="w-9 h-9 rounded-full border-2 border-[#0D9488] flex items-center justify-center overflow-hidden bg-[#0D9488]">
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
          <span className="text-sm font-semibold text-[#0F172A]">{displayName}</span>
          {displayTitle && (
            <span className="text-[10px] text-[#475569] px-2 py-0.5 mt-0.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full font-medium">
              {displayTitle}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
