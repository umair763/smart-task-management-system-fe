import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, CheckCircle } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Links */}

        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-white font-bold">Smart Todo</h4>
              </div>
              <p className="text-gray-400 text-sm max-w-70">
                Transform chaos into clarity with intelligent task management.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#security"
                    className="hover:text-white transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-end mt-8 md:mt-0 md:absolute md:right-0 md:top-0">
            <h5 className="text-white font-semibold mb-4">Follow Us</h5>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@smarttodo.com"
                className="hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-6" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© {currentYear} Smart Todo. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/support" className="hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
