import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  List,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    { name: "Tasks", path: "/tasks", icon: <List className="w-5 h-5" /> },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart2 className="w-5 h-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    // set initial CSS variable for sidebar width so layout can adapt
    const width = collapsed
      ? getComputedWidthCollapsed()
      : getComputedWidthOpen();
    document.documentElement.style.setProperty("--sidebar-width", width);
  }, [collapsed]);

  function getComputedWidthOpen() {
    // w-60 => 15rem
    return "15rem";
  }

  function getComputedWidthCollapsed() {
    // w-17 is a custom width in this project; approximate as 4.25rem
    return "4.25rem";
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-40 bg-[#C6532A] text-[#020202] rounded-tr-3xl rounded-br-3xl
                  h-screen p-4 flex flex-col transition-[width] duration-300 ease-in-out
                  ${collapsed ? "w-17" : "w-60"}`}
    >
      {/* Collapse button with SmartTask text */}
      <div className="flex items-center mb-6">
        {!collapsed && (
          <span className="font-bold text-md md:text-lg lg:text-3xl text-white mr-2 select-none">
            SmartTask
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full mx-auto cursor-pointer hover:bg-[#DF5B28] text-white transition flex items-center justify-center"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded hover:bg-[#DF5B28] hover:text-white transition ${
                isActive ? "bg-[#C6532A] text-white" : ""
              }`
            }
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout button */}
      <LogoutButton collapsed={collapsed} />

      {/* Optional footer */}

      {/* Optional footer */}
      <div className="text-xs text-white font-semibold">
        {collapsed ? "ST" : "SmartTask © 2025"}
      </div>
    </aside>
  );
};

function LogoutButton({ collapsed }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // best-effort clear of client state
      try {
        localStorage.clear();
      } catch (e) {}
      try {
        sessionStorage.clear();
      } catch (e) {}
      // navigate to login/root page
      navigate("/", { replace: true });
    } catch (err) {
      // fallback
      window.location.href = "/";
    }
  };

  return (
    <button
      className={`cursor-pointer  flex items-center gap-3 w-full p-2 rounded hover:bg-[#DF5B28] hover:text-white transition mb-2 ${
        collapsed ? "justify-center" : ""
      }`}
      onClick={handleLogout}
    >
      <LogOut className="w-5 h-5" />
      {!collapsed && <span>Logout</span>}
    </button>
  );
}
