import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatedSection } from "../components/common/AnimatedSection";
import { useForgotPasswordMutation } from "../store";
import { toast } from "react-toastify";
import { Mail, Lock, Send, ArrowLeft } from "lucide-react";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Password reset link sent to your email!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Forgot password failed:", error);
      toast.error(
        error?.data?.message || "Failed to send reset link. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 flex items-center justify-center p-4 md:p-6 lg:p-12">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center">
        {/* Left Side - Info Card */}
        <AnimatedSection
          direction="left"
          className="flex-1 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 rounded-3xl shadow-2xl p-8 md:p-12 text-white"
        >
          <div className="max-w-md mx-auto">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="bg-purple-400/30 backdrop-blur-sm rounded-full p-6">
                <Mail className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-4">
              Secure Recovery
            </h1>
            <p className="text-center text-purple-100 mb-8 leading-relaxed">
              Don't worry, it happens to the best of us. Enter your email
              address and we'll send you a link to reset your password securely.
            </p>

            {/* Security Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Lock className="w-16 h-16 text-purple-200" />
              </div>
            </div>

            {/* Password Strength Indicator (decorative) */}
            <div className="flex gap-2 justify-center mb-8">
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
            </div>

            {/* Progress bars (decorative) */}
            <div className="space-y-2 mb-8">
              <div className="h-2 bg-purple-400/30 rounded-full overflow-hidden">
                <div className="h-full bg-white/50 rounded-full w-3/4"></div>
              </div>
              <div className="h-2 bg-purple-400/30 rounded-full overflow-hidden">
                <div className="h-full bg-white/50 rounded-full w-1/2"></div>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-purple-50">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">✓</span>
                </div>
                <span>Secure encryption</span>
              </li>
              <li className="flex items-center gap-3 text-purple-50">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">✓</span>
                </div>
                <span>Instant delivery</span>
              </li>
              <li className="flex items-center gap-3 text-purple-50">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">✓</span>
                </div>
                <span>24/7 support</span>
              </li>
            </ul>
          </div>
        </AnimatedSection>

        {/* Right Side - Form Card */}
        <AnimatedSection
          direction="right"
          className="flex-1 bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-500">
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {isLoading ? "Sending..." : "Send Reset Link"}
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
              <span className="text-purple-600 font-semibold cursor-pointer hover:underline">
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
