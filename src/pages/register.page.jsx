import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedSection } from "../components/common/AnimatedSection";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    // Fake registration: accept any data and redirect
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 md:p-6 lg:p-5">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <AnimatedSection
          direction="left"
          className="hidden md:flex md:w-1/2 bg-linear-to-br from-purple-700 via-indigo-700 to-black text-white p-10 items-center justify-center"
        >
          <div className="max-w-lg">
            <h2 className="text-3xl font-extrabold mb-4">Create an account</h2>
            <p className="text-gray-200/90">
              Join thousands of teams using Smart Todo to organize work.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection
          direction="right"
          className="flex-1 flex items-center justify-center p-4 md:p-5"
        >
          <div className="w-full max-w-md bg-white rounded-3xl shadow-md p-8 m-0">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">Create an account</h2>
              <p className="text-sm text-gray-500 mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-purple-600 font-semibold">
                  Log in
                </Link>
              </p>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-3 focus:ring-2 focus:ring-purple-500"
                    placeholder="Fletcher"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-3 focus:ring-2 focus:ring-purple-500"
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-3 focus:ring-2 focus:ring-purple-500"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-3 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 text-purple-600"
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className="text-purple-600">
                    Terms & Conditions
                  </a>
                </span>
              </label>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold"
              >
                Create account
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <div className="text-sm text-gray-400">Or register with</div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  className="cursor-pointer rounded-full border border-gray-300 bg-white shadow-sm p-3 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Sign up with Google"
                >
                  <FcGoogle className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};
