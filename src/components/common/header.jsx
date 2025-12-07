import { useState } from "react";
import { LucideMenu } from "lucide-react"; // optional icon for mobile menu

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-500 text-white font-bold rounded-full flex items-center justify-center">
            S
          </div>
          <span className="text-xl font-semibold text-gray-800 dark:text-white">
            SmartTask
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6">
          <a
            href="/dashboard"
            className="text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 transition"
          >
            Dashboard
          </a>
          <a
            href="/tasks"
            className="text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 transition"
          >
            Tasks
          </a>
          <a
            href="/analytics"
            className="text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 transition"
          >
            Analytics
          </a>
          <a
            href="/settings"
            className="text-gray-700 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-400 transition"
          >
            Settings
          </a>
        </nav>

        {/* User / Profile */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
            + New Task
          </button>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 font-semibold cursor-pointer">
            U
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <LucideMenu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-800 shadow-inner px-6 py-4 flex flex-col gap-4">
          <a
            href="/dashboard"
            className="text-gray-700 dark:text-gray-200 hover:text-purple-500 transition"
          >
            Dashboard
          </a>
          <a
            href="/tasks"
            className="text-gray-700 dark:text-gray-200 hover:text-purple-500 transition"
          >
            Tasks
          </a>
          <a
            href="/analytics"
            className="text-gray-700 dark:text-gray-200 hover:text-purple-500 transition"
          >
            Analytics
          </a>
          <a
            href="/settings"
            className="text-gray-700 dark:text-gray-200 hover:text-purple-500 transition"
          >
            Settings
          </a>
        </nav>
      )}
    </header>
  );
};
