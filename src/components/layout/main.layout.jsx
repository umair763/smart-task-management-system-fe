import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "../common";
import PixelCard from "../common/pixel.card";

export const MainLayout = () => {
  return (
    <PixelCard variant="blue" className="min-h-screen">
      <div className="min-h-screen bg-transparent">
        <div className="flex w-full">
          
          <div className="h-screen flex-none">
            <Sidebar />
          </div>

          <div
            className="flex-1 flex flex-col min-h-screen"
            style={{ marginLeft: "var(--sidebar-width, 15rem)" }}
          >
            <Header />

            <main className="flex-1 p-3 lg:p-5 w-full min-w-0">
              <Outlet />
            </main>
          </div>

        </div>
      </div>
    </PixelCard>
  );
};