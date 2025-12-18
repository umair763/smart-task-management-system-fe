import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("Month");

  // Sample data for Task Performance Chart
  const taskPerformanceData = [
    { name: "Wk 1", completed: 30, inProgress: 20, overdue: 10 },
    { name: "Wk 2", completed: 45, inProgress: 35, overdue: 15 },
    { name: "Wk 3", completed: 60, inProgress: 50, overdue: 20 },
    { name: "Wk 4", completed: 80, inProgress: 60, overdue: 25 },
    { name: "Wk 5", completed: 95, inProgress: 75, overdue: 30 },
    { name: "June", completed: 70, inProgress: 55, overdue: 20 },
  ];

  // Sample data for Project Travel Chart
  const projectTravelData = [
    { name: "Jan", completed: 20, ongoing: 15, overdue: 5 },
    { name: "Feb 1", completed: 25, ongoing: 20, overdue: 8 },
    { name: "Feb 2", completed: 30, ongoing: 25, overdue: 10 },
    { name: "Feb 3", completed: 35, ongoing: 30, overdue: 12 },
    { name: "Feb 4", completed: 40, ongoing: 35, overdue: 15 },
    { name: "June", completed: 45, ongoing: 40, overdue: 18 },
  ];

  // Sample data for Team Performance
  const teamPerformanceData = [
    { name: "AI X", tasks: 80 },
    { name: "Video", tasks: 60 },
    { name: "Prototyping & Writing", tasks: 55 },
    { name: "Q&L", tasks: 90 },
    { name: "Design", tasks: 100 },
  ];

  // Sample data for Task Distribution
  const taskDistributionData = [
    { name: "To Do", value: 25, color: "#8B5CF6" },
    { name: "Completed", value: 35, color: "#3B82F6" },
    { name: "Ongoing", value: 25, color: "#10B981" },
    { name: "Overdue", value: 15, color: "#1E293B" },
  ];

  // Stats cards data
  const statsCards = [
    {
      title: "Task Completed",
      count: 25,
      total: 74,
      percentage: 50,
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Task in Progress",
      count: 8,
      total: 56,
      percentage: 15,
      trend: "up",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Task Overdue",
      count: 4,
      total: 35,
      percentage: 25,
      trend: "down",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Overview
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm">
              <Calendar className="w-4 h-4 text-gray-600" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 text-xs sm:text-sm cursor-pointer"
              >
                <option>Month</option>
                <option>Week</option>
                <option>Year</option>
              </select>
            </div>
            <div className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-700">
              May 01 - Jun 12, 2025
            </div>
            <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors">
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className="bg-[#C6532A] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 sm:p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${card.color}`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    card.trend === "up"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {card.trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {card.percentage}%
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-200 mb-2">
                {card.title}
              </h3>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100">
                  {card.count.toString().padStart(2, "0")}
                </span>
                <span className="text-sm sm:text-base text-gray-200 mb-1">
                  / {card.total}
                </span>
              </div>
              <p className="text-xs text-gray-300">
                {card.title === "Task Completed"
                  ? "This is the total number of tasks you have completed in this time."
                  : card.title === "Task in Progress"
                  ? "This is the number of tasks that are in activity progress."
                  : "This is the number of tasks that are yet to be completed and got passed their due date."}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Task Performance Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Task Performance Chart
              </h2>
              <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
                See Comparison Data
              </button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={taskPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="#9CA3AF"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="inProgress"
                  stroke="#F472B6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="overdue"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Project Travel Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Project Travel
              </h2>
              <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
                Project Comparison Data
              </button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={projectTravelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="#9CA3AF"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="ongoing"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="overdue"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Team Performance */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Team Performance
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={teamPerformanceData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12 }}
                  stroke="#9CA3AF"
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="tasks" radius={[0, 8, 8, 0]}>
                  {teamPerformanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#3B82F6"
                          : index === 1
                          ? "#06B6D4"
                          : index === 2
                          ? "#FBBF24"
                          : index === 3
                          ? "#A855F7"
                          : "#10B981"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Task Distribution Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Task Distribution Chart
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-around">
              <ResponsiveContainer width="60%" height={280}>
                <PieChart>
                  <Pie
                    data={taskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {taskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3 mt-4 sm:mt-0">
                {taskDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
