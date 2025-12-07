import { Outlet } from "react-router-dom";
import { Header, Sidebar, Footer } from "../common";

export const MainLayout = () => {
  // TEMPORARILY BYPASS AUTHENTICATION
  // const token = useSelector(state => state.auth.token);
  // const location = useLocation();

  // if (!token) return <Navigate to="/login" />;
  // if (location.pathname === "/") return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen dark:bg-[#484444] dark:text-white bg-purple-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 flex-col ml-8 md:ml-0 lg:ml-0 min-w-40">
          <main className="flex-1 p-5 lg:p-6 w-full min-w-0">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
