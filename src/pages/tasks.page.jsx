import { useState } from "react";
import {
  Search,
  CalendarIcon,
  ArrowUpAZ,
  ArrowDownWideNarrow,
} from "lucide-react";
import { TasksList } from "../features/tasks.list";
import { Calendar } from "../features/calendar";

export const TasksPage = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#C6532A] rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-200" />
              <input
                type="text"
                placeholder="Search for tasks by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border text-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all"
              />
            </div>

            {/* Tabs */}
            <div className="relative flex gap-2 sm:gap-3 border-b border-gray-200 overflow-x-auto scrollbar-hide">
              {/* All Tasks Tab */}
              <button
                onClick={() => {
                  setActiveTab("tasks");
                  setSortBy("");
                }}
                className={`flex items-center gap-1.5 hover:cursor-pointer sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === "tasks" && sortBy === ""
                    ? "text-gray-100 border-gray-100 "
                    : "text-gray-100 border-transparent hover:text-gray-200"
                }`}
                style={{ position: "relative" }}
              >
                <span>All Tasks</span>
                {activeTab === "tasks" && sortBy === "" && (
                  <span className="tab-underline" />
                )}
              </button>
              {/* Sort by Name Tab */}
              <button
                onClick={() => {
                  setActiveTab("tasks");
                  setSortBy("name-asc");
                }}
                className={`flex items-center gap-1.5 sm:gap-2 hover:cursor-pointer px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === "tasks" && sortBy === "name-asc"
                    ? "text-gray-100 border-gray-100"
                    : "text-gray-100 border-transparent hover:text-gray-200"
                }`}
                style={{ position: "relative" }}
              >
                <ArrowUpAZ className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sort by Name</span>
                <span className="sm:hidden">Name</span>
                {activeTab === "tasks" && sortBy === "name-asc" && (
                  <span className="tab-underline" />
                )}
              </button>
              {/* Sort by Date Tab */}
              <button
                onClick={() => {
                  setActiveTab("tasks");
                  setSortBy("date-desc");
                }}
                className={`flex items-center gap-1.5 sm:gap-2 hover:cursor-pointer px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === "tasks" && sortBy === "date-desc"
                    ? "text-gray-100 border-gray-100"
                    : "text-gray-100 border-transparent hover:text-gray-200"
                }`}
                style={{ position: "relative" }}
              >
                <ArrowDownWideNarrow className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sort by Date</span>
                <span className="sm:hidden">Date</span>
                {activeTab === "tasks" && sortBy === "date-desc" && (
                  <span className="tab-underline" />
                )}
              </button>
              {/* Calendar Tab */}
              <button
                onClick={() => setActiveTab("calendar")}
                className={`flex items-center gap-1.5 sm:gap-2 hover:cursor-pointer px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === "calendar"
                    ? "text-gray-100 border-gray-100"
                    : "text-gray-100 border-transparent hover:text-gray-200"
                }`}
                style={{ position: "relative" }}
              >
                <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Calendar</span>
                {activeTab === "calendar" && <span className="tab-underline" />}
              </button>
              {/* Animated underline style */}
              <style>{`
                .tab-underline {
                  position: absolute;
                  left: 0;
                  bottom: -2px;
                  height: 2px;
                  width: 100%;
                  background: linear-gradient(90deg, #fff 0%, #C6532A 100%);
                  animation: tabPulse 1.2s cubic-bezier(.4,0,.2,1) infinite;
                  border-radius: 2px;
                  transform-origin: left;
                  display: block;
                }
                @keyframes tabPulse {
                  0% { opacity: 0.5; transform: scaleX(0); }
                  50% { opacity: 1; transform: scaleX(1); }
                  100% { opacity: 0.5; transform: scaleX(0); }
                }
              `}</style>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === "tasks" ? (
          <TasksList searchQuery={searchQuery} sortBy={sortBy} />
        ) : (
          <Calendar />
        )}
      </div>
    </div>
  );
};
