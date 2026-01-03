import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Lock, Bell, Eye, EyeOff, Camera } from "lucide-react";
import {
  useUpdateUserMutation,
  useGetCurrentUserQuery,
  updateUserData,
} from "../store";
import { toast } from "react-toastify";
import { en } from "zod/v4/locales";

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_ORIGIN = import.meta.env.VITE_API_URL;
  const API_PREFIX = "/api/v1";

  const SERVER_ORIGIN = (() => {
    try {
      return new URL(API_ORIGIN).origin;
    } catch {
      return "http://localhost:3000";
    }
  })();

  const normalizeUploadPath = (path) => {
    if (!path || typeof path !== "string") return path;

    // Backend sometimes returns api/v1/uploads/... but uploads are typically served at /uploads/...
    // Normalize to avoid 404s like http://localhost:3000/api/v1/uploads/...
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

  // Get current user from Redux state
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Redux API hooks
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    refetch,
  } = useGetCurrentUserQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Profile form state - initialize with user data
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    title: "",
    email: "",
    description: "",
  });

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageLoadError, setProfileImageLoadError] = useState(false);

  // Update form when user data is loaded
  useEffect(() => {
    const currentUserValue =
      currentUser?.user || currentUser?.data?.user || currentUser;
    const userData = currentUserValue || user;
    console.log("Settings - User Data:", userData); // Debug log

    if (userData) {
      setProfileForm({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        title: userData.title || "",
        email: userData.email || "",
        description: userData.bio || userData.description || "",
      });

      // Set profile image if available - check multiple possible field names
      const imageUrl =
        userData.profileImage ||
        userData.avatar ||
        userData.image ||
        userData.photo;
      if (imageUrl) {
        setProfileImagePreview(toAbsoluteUrl(imageUrl));
        setProfileImageLoadError(false);
      }
    }
  }, [currentUser, user]);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      taskAssigned: true,
      taskCompleted: true,
      taskOverdue: true,
      weeklyReport: false,
      teamUpdates: true,
    },
    reminderNotifications: {
      upcomingDeadlines: true,
      dailyDigest: true,
      taskReminders: true,
      mentionedInComments: true,
    },
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "notification", label: "Notification", icon: Bell },
  ];

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    // Handle password update
    console.log("Password update:", passwordForm);
    // Reset form
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id && !user?.id) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    try {
      const userId = user._id || user.id;

      // Prepare form data
      const updateData = {
        id: userId,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        username: profileForm.username,
        title: profileForm.title,
        email: profileForm.email,
        bio: profileForm.description,
      };

      // If there's a new profile image, include it
      if (profileImage) {
        // Note: The API expects the image as a field
        // You may need to adjust based on your backend implementation
        updateData.profileImage = profileImage;
      }

      const response = await updateUser(updateData).unwrap();

      const updatedUser = response?.user || response?.data?.user || response;

      // Update Redux state with new user data
      dispatch(updateUserData(updatedUser || updateData));

      // Clear the stored image file after successful upload
      setProfileImage(null);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(
        error?.data?.message || "Failed to update profile. Please try again."
      );
    }
  };

  const handleNotificationToggle = (category, setting) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting],
      },
    }));
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Create preview URL immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
        setProfileImageLoadError(false);
      };
      reader.readAsDataURL(file);

      // Upload the image immediately
      if (!user?._id && !user?.id) {
        toast.error("User ID not found. Please login again.");
        return;
      }

      try {
        toast.info("Uploading image...");

        const userId = user._id || user.id;

        const response = await updateUser({
          id: userId,
          profileImage: file,
        }).unwrap();

        const updatedUser = response?.user || response?.data?.user || response;

        // Update Redux state with new user data
        if (updatedUser) {
          dispatch(updateUserData(updatedUser));
          const nextImageUrl =
            updatedUser.profileImage ||
            updatedUser.avatar ||
            updatedUser.image ||
            updatedUser.photo;
          if (nextImageUrl) {
            setProfileImagePreview(toAbsoluteUrl(nextImageUrl));
            setProfileImageLoadError(false);
          }
        }

        toast.success("Profile image updated successfully!");
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error(
          error?.data?.message || "Failed to upload image. Please try again."
        );
        // Reset preview on error
        setProfileImagePreview(
          toAbsoluteUrl(user?.profileImage || user?.avatar || null)
        );
        setProfileImageLoadError(false);
      }
    }
  };

  return (
    <div className="">
      {/* Main Content */}
      <div className="">
        {/* Profile Card Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
                  {(() => {
                    const currentUserValue =
                      currentUser?.user ||
                      currentUser?.data?.user ||
                      currentUser;
                    const userData = currentUserValue || user;
                    const candidateUrl =
                      profileImagePreview ||
                      toAbsoluteUrl(
                        userData?.profileImage ||
                          userData?.avatar ||
                          userData?.image ||
                          userData?.photo
                      );

                    if (candidateUrl && !profileImageLoadError) {
                      return (
                        <img
                          src={candidateUrl}
                          alt="Profile"
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover"
                          onError={() => {
                            console.error(
                              "Image failed to load:",
                              candidateUrl
                            );
                            setProfileImageLoadError(true);
                            setProfileImagePreview(null);
                          }}
                        />
                      );
                    }

                    return (
                      <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                        {userData?.firstName?.[0]?.toUpperCase() ||
                          userData?.username?.[0]?.toUpperCase() ||
                          "U"}
                      </span>
                    );
                  })()}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900">
                  {(() => {
                    const currentUserValue =
                      currentUser?.user ||
                      currentUser?.data?.user ||
                      currentUser;
                    const userData = currentUserValue || user;
                    return (
                      userData?.username ||
                      userData?.firstName ||
                      profileForm.username ||
                      "User"
                    );
                  })()}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">
                  {(() => {
                    const currentUserValue =
                      currentUser?.user ||
                      currentUser?.data?.user ||
                      currentUser;
                    const userData = currentUserValue || user;
                    return userData?.email || profileForm.email;
                  })()}
                </p>
              </div>
            </div>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-full sm:w-auto">
              View profile
            </button>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <nav
              className="flex gap-1 sm:gap-4 md:gap-6 px-2 sm:px-4 md:px-6"
              aria-label="Tabs"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline sm:inline">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-3xl">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Profile Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Update your personal information and manage your account
                  </p>
                </div>

                <form
                  onSubmit={handleProfileSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                    {/* First Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            username: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={profileForm.title}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g. Product Manager"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>

                    {/* Description - Full Width */}
                    <div className="md:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Description
                      </label>
                      <textarea
                        value={profileForm.description}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            description: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Tell us a bit about yourself..."
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full sm:w-auto px-6 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="max-w-2xl">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Password
                  </h2>
                  <p className="text-sm text-gray-600">
                    Please enter your current password to change your password
                  </p>
                </div>

                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-3 sm:space-y-5"
                >
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Current password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-500">
                      Your new password must be more than 8 characters.
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Confirm new password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        })
                      }
                      className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2 text-xs sm:text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Update password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notification Tab */}
            {activeTab === "notification" && (
              <div className="max-w-3xl">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-gray-600">
                    Manage how you receive notifications and updates
                  </p>
                </div>

                <div className="space-y-5 sm:space-y-8">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                        <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                      Email Notifications
                    </h3>
                    <div className="space-y-4 pl-10">
                      {Object.entries(
                        notificationSettings.emailNotifications
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {key === "taskExpire"
                                ? "Get notified when a task Deadlin exceed."
                                : key === "taskCompleted"
                                ? "Get notified when your task is marked as completed"
                                : key === "taskOverdue"
                                ? "Get notified when a task is overdue"
                                : key === "weeklyReport"
                                ? "Receive a weekly summary of your tasks"
                                : "Get notified about team updates and changes"}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleNotificationToggle(
                                "emailNotifications",
                                key
                              )
                            }
                            className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                              value ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                                value
                                  ? "translate-x-5 sm:translate-x-6"
                                  : "translate-x-0.5 sm:translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reminder Notifications */}
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                        <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                      </div>
                      Reminder Notifications
                    </h3>
                    <div className="space-y-4 pl-10">
                      {Object.entries(
                        notificationSettings.reminderNotifications
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {key === "upcomingDeadlines"
                                ? "Get reminded about upcoming task deadlines"
                                : key === "dailyDigest"
                                ? "Receive a daily summary of your tasks"
                                : key === "taskReminders"
                                ? "Get reminded about pending tasks"
                                : "Get notified when someone mentions you in comments"}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleNotificationToggle(
                                "reminderNotifications",
                                key
                              )
                            }
                            className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                              value ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                                value
                                  ? "translate-x-5 sm:translate-x-6"
                                  : "translate-x-0.5 sm:translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-3 sm:pt-4 border-t border-gray-200">
                    <button className="w-full sm:w-auto px-6 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
