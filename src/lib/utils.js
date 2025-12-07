// Helper function to construct proper image URL for profile images
export const getImageUrl = (profileImagePath) => {
  if (!profileImagePath) return null;

  // If the path already starts with http, return as is
  if (profileImagePath.startsWith("http")) {
    return profileImagePath;
  }

  // Remove any leading slashes
  let cleanPath = profileImagePath.replace(/^\/+/, "");

  // Ensure it starts with uploads/
  if (!cleanPath.startsWith("uploads/")) {
    cleanPath = `uploads/${cleanPath}`;
  }

  // Only allow image extensions
  const validExt = /\.(jpg|jpeg|png|webp|gif)$/i.test(cleanPath);
  if (!validExt) return null;

  // Get the base URL without /api/v1 suffix for static file serving
  let baseUrl = import.meta.env.VITE_API_URL;

  // Remove /api/v1 and any trailing slashes
  baseUrl = baseUrl.replace(/\/api\/v1\/?$/, "");
  baseUrl = baseUrl.replace(/\/+$/, ""); // Remove any trailing slashes

  // Construct the full URL for static files
  const fullUrl = `${baseUrl}/${cleanPath}`;

  // Debug log (remove in production)
  console.log("Image URL constructed:", fullUrl);

  return fullUrl;
};
