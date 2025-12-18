import { useEffect, useState } from "react";
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

function StatCard({ title, value, delta }) {
  return (
    <div className="bg-[#C6532A] border border-white/5 rounded-2xl p-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-300">{title}</div>
          <div className="text-2xl font-bold text-white mt-2">{value}</div>
        </div>
        <div className="text-sm text-green-400 bg-white/5 px-2 py-1 rounded-md">
          {delta}
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
          margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
        >
          <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
          <YAxis hide domain={[0, 100]} />
          <Tooltip wrapperStyle={{ background: "#0f1724", borderRadius: 8 }} />
          <ReBar dataKey="value" fill="#F0F0F0" radius={[8, 8, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Recharts-based Donut component
function Donut({ percent = 60 }) {
  const data = [
    { name: "Completed", value: percent },
    { name: "Remaining", value: 100 - percent },
  ];
  const COLORS = ["#F0F0F0", "#111827"];

  return (
    <div className="flex items-center justify-center flex-col">
      <ResponsiveContainer width={80} height={80}>
        <RePieChart>
          <Pie
            data={data}
            innerRadius={28}
            outerRadius={36}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </RePieChart>
      </ResponsiveContainer>
      <div className="absolute text-center mt-2">
        <div className="text-2xl text-white font-bold">{percent}%</div>
        <div className="text-xs text-gray-400">Tasks completed</div>
      </div>
    </div>
  );
}

export const DashboardPage = () => {
  const [stats] = useState({
    total: 124,
    completed: 44,
    overdue: 20,
    active: "12/15",
  });

  // Dummy data for productivity bars
  const productivityData = [
    { name: "5 Sep", value: 35 },
    { name: "6 Sep", value: 45 },
    { name: "7 Sep", value: 55 },
    { name: "8 Sep", value: 83 },
    { name: "9 Sep", value: 80 },
    { name: "10 Sep", value: 60 },
  ];

  // Dummy percent for donut
  const donutPercent = 60;

  useEffect(() => {
    // placeholder for future data fetch
  }, []);

  return (
    <div className="w-full mx-auto p-4 rounded-3xl text-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold ">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Track team performance & project insights at a glance.
          </p>
        </div>
        <button className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm shadow-md">
          Export
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Tasks" value={stats.total} delta="+5%" />
        <StatCard title="Completed" value={stats.completed} delta="-8%" />
        <StatCard title="Overdue" value={stats.overdue} delta="+12%" />
        <StatCard title="Active" value={stats.active} delta="+5%" />
      </div>

      {/* Main panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Productivity */}
        <div className="bg-[#C6532A] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-white font-semibold">Productivity</h3>
            <div className="text-sm text-gray-400">This Week</div>
          </div>

          <div className="h-48">
            <Bar data={productivityData} />
          </div>
        </div>

        {/* Right: Task Overview (donut) */}
        <div className="bg-[#C6532A] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg text-white font-semibold mb-4 self-start">
            Task Overview
          </h3>
          <div className="w-full flex items-center justify-center py-6">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <Donut percent={donutPercent} />
            </div>
            <div className="ml-8">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-white rounded-full" />{" "}
                  <span className="text-sm text-gray-300">Completed</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-purple-500 rounded-full" />{" "}
                  <span className="text-sm text-gray-300">In Progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full" />{" "}
                  <span className="text-sm text-gray-300">In Review</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-gray-600 rounded-full" />{" "}
                  <span className="text-sm text-gray-300">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Top performer & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-[#C6532A] border border-white/5 rounded-2xl p-6 flex gap-6 items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Top performer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-white font-semibold">Aditi Verma</div>
            <div className="text-sm text-gray-400">Frontend Developer</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-300">
              <div>
                Task Completed{" "}
                <span className="text-white font-bold">18/19</span>
              </div>
              <div>
                On-time Delivery{" "}
                <span className="text-white font-bold">95%</span>
              </div>
              <div>
                Streak{" "}
                <span className="text-white font-bold">3 week in row</span>
              </div>
              <div className="col-span-2 mt-3">
                <div className="bg-white/5 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-white rounded-full"
                    style={{ width: "72%" }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  12% higher than team average
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#C6532A] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Upcoming deadline</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm text-gray-300 mb-1">
                <div>Landing page UI fix</div>
                <div className="text-xs text-pink-300">Due tomorrow</div>
              </div>
              <div className="bg-white/5 rounded-full h-3">
                <div
                  className="h-3 bg-white rounded-full"
                  style={{ width: "70%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm text-gray-300 mb-1">
                <div>API Integration</div>
                <div className="text-xs text-pink-300">Due in 2 Days</div>
              </div>
              <div className="bg-white/5 rounded-full h-3">
                <div
                  className="h-3 bg-white rounded-full"
                  style={{ width: "40%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
