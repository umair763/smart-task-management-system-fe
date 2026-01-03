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
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Launch Clever dashboard theme
            </h1>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for tasks by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 sm:gap-3 border-b border-gray-200 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => {
                  setActiveTab("tasks");
                  setSortBy("");
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === "tasks" && sortBy === ""
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                <span>All Tasks</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("tasks");
                  setSortBy("name-asc");
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === "tasks" && sortBy === "name-asc"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                <ArrowUpAZ className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sort by Name</span>
                <span className="sm:hidden">Name</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("tasks");
                  setSortBy("date-desc");
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === "tasks" && sortBy === "date-desc"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                <ArrowDownWideNarrow className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sort by Date</span>
                <span className="sm:hidden">Date</span>
              </button>

              <button
                onClick={() => setActiveTab("calendar")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === "calendar"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Calendar</span>
              </button>
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
