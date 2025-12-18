import { useState } from "react";
import { User, Lock, Bell, Eye, EyeOff, Camera } from "lucide-react";

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("password");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: "Sarah Johnson",
    email: "sarahjohnson@gmail.com",
    phone: "+1 (555) 123-4567",
    jobTitle: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
  });

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

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Profile update:", profileForm);
    alert("Profile updated successfully!");
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

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload
      console.log("New profile image:", file);
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
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
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
                  Settings
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">
                  {profileForm.email}
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
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
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

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    {/* Job Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={profileForm.jobTitle}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            jobTitle: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={profileForm.department}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            department: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                      className="w-full sm:w-auto px-6 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
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
