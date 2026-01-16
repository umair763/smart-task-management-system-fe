import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatedSection } from "../components/common/AnimatedSection";
import { useResetPasswordMutation } from "../store";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, KeyRound, ArrowLeft, Shield } from "lucide-react";

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      toast.success("Password reset successful! You can now login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password failed:", error);
      toast.error(
        error?.data?.message ||
          "Failed to reset password. The link may have expired."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-4 md:p-6 lg:p-12">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center">
        {/* Left Side - Info Card */}
        <AnimatedSection
          direction="left"
          className="flex-1 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white"
        >
          <div className="max-w-md mx-auto">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="bg-green-400/30 backdrop-blur-sm rounded-full p-6">
                <KeyRound className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-4">
              Set Your New Password
            </h1>
            <p className="text-center text-green-100 mb-8 leading-relaxed">
              Choose a strong password to protect your account. Make sure it's
              something you can remember.
            </p>

            {/* Security Illustration */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-2xl transform rotate-6"></div>
                <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-8">
                  <Shield className="w-20 h-20 text-white mx-auto" />
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <h3 className="font-semibold mb-3 text-white">
                Password Requirements:
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-green-50">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Minimum 8 characters</span>
                </li>
                <li className="flex items-center gap-2 text-green-50">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Include letters & numbers</span>
                </li>
              </ul>
            </div>
          </div>
        </AnimatedSection>

        {/* Right Side - Form Card */}
        <AnimatedSection
          direction="right"
          className="flex-1 bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Set New Password
            </h2>
            <p className="text-gray-500">
              Choose a strong password for your account
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* New Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-5 h-5" />
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            {/* Back to Login */}
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to login</span>
            </Link>

            {/* Support */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Having trouble? Contact our{" "}
              <span className="text-green-600 font-semibold cursor-pointer hover:underline">
                support team
              </span>{" "}
              for assistance.
            </p>
          </form>
        </AnimatedSection>
      </div>
    </div>
  );
};
