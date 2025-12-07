import { Outlet } from "react-router-dom";
import { Header, Sidebar, Footer } from "../common";

export const MainLayout = () => {
  // TEMPORARILY BYPASS AUTHENTICATION
  // const token = useSelector(state => state.auth.token);
  // const location = useLocation();

  // if (!token) return <Navigate to="/login" />;
  // if (location.pathname === "/") return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen dark:bg-[#484444] dark:text-white bg-purple-100">
      {/* Two-column layout: left = sidebar (fixed full height), right = header + content */}
      <div className="flex w-full">
        {/* Sidebar: fixed full height, no vertical scroll */}
        <div className="h-screen flex-none">
          <Sidebar />
        </div>

        {/* Right column: header at top, outlet/main fills remaining space */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />

          <main className="flex-1 p-5 lg:p-6 w-full min-w-0 overflow-auto">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};
