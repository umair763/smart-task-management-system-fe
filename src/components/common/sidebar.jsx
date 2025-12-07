import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, List, BarChart2, Settings } from "lucide-react";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Tasks", path: "/tasks", icon: <List className="w-5 h-5" /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart2 className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                  h-screen p-4 flex flex-col transition-all duration-300 
                  ${collapsed ? "w-17" : "w-60"}`}
    >
      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-6 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        {collapsed ? "→" : "←"}
      </button>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                isActive ? "bg-purple-500 text-white" : ""
              }`
            }
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Optional footer */}
      <div className="mt-auto text-xs text-gray-500 dark:text-gray-400">
        {collapsed ? "ST" : "SmartTask © 2025"}
      </div>
    </aside>
  );
};
