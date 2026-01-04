import { useMemo, useState } from "react";
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
  AlertCircle,
} from "lucide-react";
import {
  useGetAnalyticsSummaryQuery,
  useGetAnalyticsActiveRateQuery,
  useGetAnalyticsOverdueQuery,
  useGetAnalyticsTimeseriesQuery,
  useGetAnalyticsDistributionQuery,
  useGetTopSubtasksQuery,
} from "../store/analytics.api";

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("Monthly");

  // Analytics queries
  const { data: summaryResp, isLoading: loadingSummary } =
    useGetAnalyticsSummaryQuery();
  const { data: activeRateResp, isLoading: loadingActive } =
    useGetAnalyticsActiveRateQuery();
  const { data: overdueResp, isLoading: loadingOverdue } =
    useGetAnalyticsOverdueQuery();

  const rangeParam = useMemo(() => {
    switch (dateRange) {
      case "Weekly":
        return "weekly";
      case "Yearly":
        return "yearly";
      default:
        return "monthly";
    }
  }, [dateRange]);

  const dateRangeText = useMemo(() => {
    const now = new Date();
    const fmt = (d) =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    if (dateRange === "Weekly") {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      return `${fmt(start)} - ${fmt(now)}`;
    }
    if (dateRange === "Monthly") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return `${fmt(start)} - ${fmt(now)}`;
    }
    // Yearly
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    return `${fmt(start)} - ${fmt(end)}`;
  }, [dateRange]);
  const { data: timeseriesResp, isLoading: loadingTimeseries } =
    useGetAnalyticsTimeseriesQuery(rangeParam);

  const { data: distributionResp, isLoading: loadingDistribution } =
    useGetAnalyticsDistributionQuery(rangeParam);
  const { data: topSubtasksResp, isLoading: loadingTop } =
    useGetTopSubtasksQuery(rangeParam);

  // Project Travel Chart (no API provided, keep sample)
  const projectTravelData = [
    { name: "Jan", completed: 20, ongoing: 15, overdue: 5 },
    { name: "Feb 1", completed: 25, ongoing: 20, overdue: 8 },
    { name: "Feb 2", completed: 30, ongoing: 25, overdue: 10 },
    { name: "Feb 3", completed: 35, ongoing: 30, overdue: 12 },
    { name: "Feb 4", completed: 40, ongoing: 35, overdue: 15 },
    { name: "June", completed: 45, ongoing: 40, overdue: 18 },
  ];
  // Derived analytics data
  const completedTasks = summaryResp?.data?.completedTasks ?? 0;
  const totalTasks = summaryResp?.data?.totalTasks ?? 0;
  const completionRate = activeRateResp?.data?.completionRate ?? 0;
  const overdueTasks = overdueResp?.data?.overdueTasks ?? 0;

  const timeseriesData = useMemo(() => {
    const ts = timeseriesResp?.data;
    if (!ts || !Array.isArray(ts.labels)) return [];
    const labels = ts.labels || [];
    const completedArr = ts.completed || [];
    const overdueArr = ts.overdue || [];
    return labels.map((label, i) => ({
      name: label,
      completed: Number(completedArr[i] ?? 0),
      overdue: Number(overdueArr[i] ?? 0),
    }));
  }, [timeseriesResp]);

  const taskDistributionData = useMemo(() => {
    const d = distributionResp?.data;
    if (!d) return [];
    if (Array.isArray(d.taskDistributionData)) return d.taskDistributionData;
    const series = Array.isArray(d.series) ? d.series : [];
    return series.map((s) => ({
      name: s.name,
      value: Array.isArray(s.data)
        ? s.data.reduce((sum, v) => sum + (Number(v) || 0), 0)
        : 0,
      color: s.color || "#9CA3AF",
    }));
  }, [distributionResp]);

  const teamPerformanceData = useMemo(() => {
    const top = topSubtasksResp?.data;
    const tasks = Array.isArray(top?.tasks) ? top.tasks : [];
    // New timeseries shape: sum per task across labels
    if (tasks.length && Array.isArray(tasks[0]?.data)) {
      return tasks.map((t) => ({
        name: t.taskName,
        tasks: t.data.reduce((sum, v) => sum + (Number(v) || 0), 0),
      }));
    }
    // Legacy shape fallback
    return tasks.map((t) => ({ name: t.taskName, tasks: t.subtaskCount || 0 }));
  }, [topSubtasksResp]);

  // Stats cards (dynamic from API)
  const statsCards = [
    {
      title: "Task Completed",
      count: completedTasks,
      total: totalTasks,
      percentage:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      isPercent: false,
      description: "Total number of tasks completed in the selected period.",
    },
    {
      title: "Active rate",
      count: completionRate,
      total: 100,
      percentage: completionRate,
      trend: "up",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      isPercent: true,
      description: "Overall completion rate across tasks.",
    },
    {
      title: "Task Overdue",
      count: overdueTasks,
      total: totalTasks,
      percentage:
        totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0,
      trend: "down",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      isPercent: false,
      description: "Tasks that are past their due date.",
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
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Time Range Dropdown */}
            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  Time Series
                </span>

                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none bg-transparent pl-2 pr-8 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none cursor-pointer"
                >
                  {["Weekly", "Monthly", "Yearly"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                {/* Dropdown arrow */}
                <svg
                  className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Date Range Text */}
            <div className="px-4 py-2.5 bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 shadow-sm">
              {dateRangeText}
            </div>

            {/* Export Button */}
            <button
              className="relative px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white 
               bg-gradient-to-r from-blue-600 to-indigo-600 
               hover:from-blue-700 hover:to-indigo-700 
               active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
            >
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
                  {card.isPercent
                    ? `${card.count}%`
                    : card.count.toString().padStart(2, "0")}
                </span>
                {!card.isPercent && (
                  <span className="text-sm sm:text-base text-gray-200 mb-1">
                    / {card.total}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300">{card.description}</p>
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
              <LineChart data={timeseriesData}>
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
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="overdue"
                  stroke="#EF4444"
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
                      backgroundColor: "#98ABC3",
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
                        {(() => {
                          const total = taskDistributionData.reduce(
                            (sum, it) => sum + (Number(it.value) || 0),
                            0
                          );
                          const val = Number(item.value) || 0;
                          return total > 0
                            ? `${Math.round((val / total) * 100)}%`
                            : "0%";
                        })()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subtasks insights */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Subtasks insights
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
        </div>
      </div>
    </div>
  );
};
