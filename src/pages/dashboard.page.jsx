import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar as ReBar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetAllTasksQuery } from "../store/tasks.api";
import { useGetCurrentUserQuery } from "../store/auth.api";
import { useSelector } from "react-redux";

function StatCard({ title, value }) {
  return (
    <div className="bg-[#C6532A] border border-white/5 rounded-2xl p-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white">{title}</div>
          <div className="text-2xl font-bold text-white mt-2">{value}</div>
        </div>
      </div>
    </div>
  );
}

// Recharts-based Bar component (wraps a simple vertical bar chart)
function Bar({ data = [] }) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart
          data={data}
          margin={{ top: 8, right: 8, left: 1, bottom: 8 }}
        >
          <XAxis dataKey="name" tick={{ fill: "#FFFFFF" }} />
          <YAxis
            tick={{ fill: "#FFFFFF" }}
            allowDecimals={false}
            domain={[0, "dataMax"]}
          />
          <Tooltip
            wrapperStyle={{ background: "#0f1724", borderRadius: 8 }}
            formatter={(val) => [`${val}`, "Tasks"]}
          />
          <ReBar dataKey="value" fill="#F0F0F0" radius={[8, 8, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const DashboardPage = () => {
  const { data: apiTasks, isLoading } = useGetAllTasksQuery();
  const { user } = useSelector((state) => state.auth);
  const { data: currentUser } = useGetCurrentUserQuery(undefined, {
    skip: !user,
  });

  const [profileImageLoadError, setProfileImageLoadError] = useState(false);

  const extractTasksArray = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.tasks)) return response.tasks;
    if (response.data && Array.isArray(response.data.tasks)) {
      return response.data.tasks;
    }
    return [];
  };

  const getCompletionStatus = (item) => {
    return Boolean(item?.completionStatus ?? item?.completed ?? false);
  };

  const coerceDate = (value) => {
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const clampPercent = (value) => {
    const n = Number(value);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(100, n));
  };

  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const startOfDay = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const getDueDate = (task) => {
    return (
      coerceDate(task?.scheduledDate) ||
      coerceDate(task?.dueDate) ||
      coerceDate(task?.deadline) ||
      coerceDate(task?.date)
    );
  };

  const resolveAssetUrl = (maybeUrl) => {
    if (!maybeUrl || typeof maybeUrl !== "string") return null;
    if (maybeUrl.startsWith("http://") || maybeUrl.startsWith("https://")) {
      return maybeUrl;
    }
    // API base is http://localhost:3000/api/v1 -> origin is http://localhost:3000
    if (maybeUrl.startsWith("/")) return `http://localhost:3000${maybeUrl}`;
    return maybeUrl;
  };

  const dashboardData = useMemo(() => {
    const tasksArray = extractTasksArray(apiTasks);
    const total = tasksArray.length;
    const completed = tasksArray.filter((t) => getCompletionStatus(t)).length;

    const now = new Date();
    const todayStart = startOfDay(now);

    const overdue = tasksArray.filter((t) => {
      const completedStatus = getCompletionStatus(t);
      if (completedStatus) return false;
      const due = getDueDate(t);
      return Boolean(due && due.getTime() < now.getTime());
    }).length;

    const completionAvg = total > 0 ? Math.round((completed / total) * 100) : 0;
    const onTimeDelivery =
      total > 0 ? Math.round(((total - overdue) / total) * 100) : 0;

    const pending = Math.max(0, total - completed - overdue);
    const taskDistributionData = total
      ? [
          {
            name: "Completed",
            value: Math.round((completed / total) * 100),
            color: "#F0F0F0",
          },
          {
            name: "Overdue",
            value: Math.round((overdue / total) * 100),
            color: "#A855F7",
          },
          {
            name: "Pending",
            value: Math.max(
              0,
              100 -
                Math.round((completed / total) * 100) -
                Math.round((overdue / total) * 100)
            ),
            color: "#4B5563",
          },
        ]
      : [
          { name: "Completed", value: 0, color: "#F0F0F0" },
          { name: "Overdue", value: 0, color: "#A855F7" },
          { name: "Pending", value: 0, color: "#4B5563" },
        ];

    // Productivity: previous 7 days (last week) for current month (task counts)
    const last7Days = Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - (6 - idx));
      return d;
    });

    const createdCountsByKey = new Map();
    for (const t of tasksArray) {
      const createdAt = coerceDate(t?.createdAt);
      if (!createdAt) continue;
      const key = formatDateKey(startOfDay(createdAt));
      createdCountsByKey.set(key, (createdCountsByKey.get(key) || 0) + 1);
    }

    const productivityData = last7Days.map((d) => {
      const key = formatDateKey(d);
      const count = createdCountsByKey.get(key) || 0;
      const name = `${d.getDate()} ${d.toLocaleString("default", {
        month: "short",
      })}`;
      return {
        name,
        value: count,
      };
    });

    // Recently added: latest 3 tasks by createdAt
    const recentlyAdded = tasksArray
      .map((t) => ({
        raw: t,
        createdAt: coerceDate(t?.createdAt),
      }))
      .filter(({ createdAt }) => Boolean(createdAt))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3)
      .map(({ raw, createdAt }) => {
        const title = raw?.taskName || raw?.title || "Untitled task";
        const createdAtText = createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return {
          id: raw?._id || raw?.id || title,
          title,
          createdAtText,
        };
      });

    // Streak: consecutive days (including today) with at least 1 created task
    const createdDayKeys = new Set(
      tasksArray
        .map((t) => coerceDate(t?.createdAt))
        .filter(Boolean)
        .map((d) => formatDateKey(startOfDay(d)))
    );

    let streakDays = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);
      if (!createdDayKeys.has(formatDateKey(d))) break;
      streakDays += 1;
    }

    return {
      stats: {
        total,
        completed,
        overdue,
        completionAvg,
        onTimeDelivery,
        streakDays,
      },
      productivityData,
      recentlyAdded,
      taskDistributionData,
      pending,
    };
  }, [apiTasks]);

  const displayUser =
    currentUser?.user || currentUser?.data?.user || currentUser || user;
  const displayName =
    displayUser?.fullName ||
    displayUser?.name ||
    `${displayUser?.firstName || ""} ${displayUser?.lastName || ""}`.trim() ||
    displayUser?.email ||
    "User";
  const displayRole =
    displayUser?.role || displayUser?.position || displayUser?.jobTitle || "";
  const displayAvatar =
    displayUser?.profileImage ||
    displayUser?.profileImage?.url ||
    displayUser?.avatar ||
    displayUser?.photoURL ||
    displayUser?.photo ||
    null;

  const resolvedAvatar = resolveAssetUrl(displayAvatar);
  const candidateUrl = resolvedAvatar;

  useEffect(() => {
    setProfileImageLoadError(false);
  }, [candidateUrl]);

  return (
    <div className="w-full mx-auto p-4 rounded-3xl text-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold ">Dashboard</h1>
          <p className="text-sm text-gray-700">
            Track team performance & project insights at a glance.
          </p>
        </div>
        <button className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm shadow-md">
          Export
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Tasks"
          value={isLoading ? "-" : dashboardData.stats.total}
        />
        <StatCard
          title="Completed"
          value={isLoading ? "-" : dashboardData.stats.completed}
        />
        <StatCard
          title="Overdue"
          value={isLoading ? "-" : dashboardData.stats.overdue}
        />
        <StatCard
          title="Active"
          value={isLoading ? "-" : `${dashboardData.stats.completionAvg}%`}
        />
      </div>

      {/* Main panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Productivity */}
        <div className="bg-[#C6532A] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-white font-semibold">Productivity</h3>
            <div className="text-sm text-gray-100">
              This Month • Last 7 Days
            </div>
          </div>

          <div className="h-48 -ml-6">
            <Bar data={dashboardData.productivityData} />
          </div>
        </div>

        {/* Right: Task Overview (pie) */}
        <div className="bg-[#C6532A] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg text-white font-semibold mb-4 self-start">
            Task Overview
          </h3>
          <div className="w-full py-1">
            <div className="flex flex-col sm:flex-row items-center justify-around">
              <ResponsiveContainer width="60%" height={200}>
                <RePieChart>
                  <Pie
                    data={dashboardData.taskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dashboardData.taskDistributionData.map((entry, index) => (
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
                </RePieChart>
              </ResponsiveContainer>

              <div className="flex flex-col gap-3 mt-4 sm:mt-0">
                {dashboardData.taskDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-medium text-white">
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-200">
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

      {/* Bottom row: Top performer & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-[#C6532A] border border-white/5 rounded-2xl p-6 flex gap-6 items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            {candidateUrl && !profileImageLoadError ? (
              <img
                src={candidateUrl}
                alt="Top performer"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                onError={() => {
                  console.error("Image failed to load:", candidateUrl);
                  setProfileImageLoadError(true);
                }}
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </div>
          <div>
            <div className="text-white font-semibold">{displayName}</div>
            <div className="text-sm text-gray-400">{displayRole}</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-100">
              <div>
                Task Completed{" "}
                <span className="text-white font-bold">
                  {isLoading
                    ? "-"
                    : `${dashboardData.stats.completed}/${dashboardData.stats.total}`}
                </span>
              </div>
              <div>
                On-time Delivery{" "}
                <span className="text-white font-bold">
                  {isLoading ? "-" : `${dashboardData.stats.onTimeDelivery}%`}
                </span>
              </div>
              <div>
                Streak{" "}
                <span className="text-white font-bold">
                  {isLoading
                    ? "-"
                    : `${dashboardData.stats.streakDays} day(s) in row`}
                </span>
              </div>
              <div className="col-span-2 mt-3">
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-white rounded-full"
                    style={{
                      width: isLoading
                        ? "0%"
                        : `${dashboardData.stats.completionAvg}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-100 mt-2">
                  {isLoading
                    ? "Loading…"
                    : `${dashboardData.stats.completionAvg}% task completion rate`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#C6532A] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Recently Added</h3>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-sm text-gray-300">Loading…</div>
            ) : dashboardData.recentlyAdded.length === 0 ? (
              <div className="text-sm text-gray-300">No recent tasks</div>
            ) : (
              dashboardData.recentlyAdded.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between text-sm text-gray-50 mb-1">
                    <div>{item.title}</div>
                    <div className="text-xs text-gray-50">
                      {item.createdAtText}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
