import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AnimatedSection } from "../components/common/AnimatedSection";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../store";
import { setUser } from "../store";
import { toast } from "react-toastify";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      console.log("Login response:", response); // Debug log

      // Handle different response structures
      const userData = response.user || response.data?.user || response;
      const token =
        response.token || response.data?.token || response.accessToken;

      // Store user and token in Redux state (will be persisted)
      dispatch(
        setUser({
          user: userData,
          token: token,
        })
      );

      console.log("User stored in Redux:", { user: userData, token }); // Debug log

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 md:p-6 lg:p-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left / Form with animation */}
        <AnimatedSection
          direction="left"
          className="flex-1 flex items-center justify-center p-4 md:p-8"
        >
          <div className="w-full max-w-md bg-white rounded-3xl shadow-md p-8 m-0">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">Sign in to your account</h2>
              <p className="text-sm text-gray-500 mt-2">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-purple-600 font-semibold">
                  Create account
                </Link>
              </p>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent p-3"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent p-3"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-purple-600"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link to="/" className="text-purple-600">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <div className="text-sm text-gray-400">Or continue with</div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  className="rounded-full border border-gray-300 bg-white shadow-sm p-3 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Sign in with Google"
                >
                  <FcGoogle className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
        </AnimatedSection>
        {/* Right / Illustration with animation */}
        <AnimatedSection
          direction="right"
          className="hidden md:flex md:w-1/2 bg-linear-to-br from-purple-700 via-indigo-700 to-black text-white p-10 items-center justify-center"
        >
          <div className="max-w-lg">
            <div className="mb-6">
              <div className="bg-white/10 rounded-lg inline-flex p-3 mb-6">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path d="M12 2L15 8H9L12 2Z" fill="currentColor" />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold mb-2">Welcome back</h1>
              <p className="text-gray-200/90">
                Sign in to your account and continue managing tasks smarter.
              </p>
            </div>
            <ul className="space-y-4 mt-8 text-gray-200">
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  ✓
                </span>
                <span>Intelligent task dependencies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  ✓
                </span>
                <span>Smart reminders & notifications</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  ✓
                </span>
                <span>Universal access on all devices</span>
              </li>
            </ul>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};
