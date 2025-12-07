import { Bell, ChevronDown } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-[98%] h-18 flex items-center px-4 md:px-8 rounded-3xl bg-[#C6532A] mt-1 ml-2 mx-auto">
      {/* Search bar */}
      <div className="flex-1 flex items-center">
        <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-2 w-full max-w-[340px] h-10">
          <input
            type="text"
            placeholder="Type here to search"
            className="bg-transparent outline-none text-[#232323] placeholder-gray-500 w-full text-sm"
            style={{ letterSpacing: "0.01em" }}
          />
        </div>
      </div>

      {/* Notification bell */}
      <div className="flex items-center mx-4">
        <button className="relative p-2 rounded-full hover:bg-[#DF5B28] cursor-pointer transition">
          <Bell className="w-6 h-6 text-white" />
          {/* Notification dot (optional) */}
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
        </button>
      </div>

      {/* User profile */}
      <div className="flex items-center gap-2 min-w-[180px] justify-end">
        <div className="w-8 h-8 rounded-full border-2 border-[#ff5c1a] flex items-center justify-center overflow-hidden">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Muhammad Umair"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start justify-center leading-tight">
          <span className="text-sm font-medium text-white">Muhammad Umair</span>
          <span className="text-[11px] text-white px-2 mt-0.5 border border-[#020202]/60 rounded-full p-0.5">
            Manager
          </span>
        </div>
        <ChevronDown className="w-5 h-5 text-white ml-1" />
      </div>
    </header>
  );
};
