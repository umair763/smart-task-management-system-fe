import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(2025, new Date().getMonth(), 1)
  );

  // Dummy tasks data for demonstration
  const dummyTasks = [
    {
      id: 1,
      title: "Complete project proposal",
      scheduledDate: new Date(2025, currentMonth.getMonth(), 5),
      priority: "high",
      taskCount: 3,
    },
    {
      id: 2,
      title: "Review team feedback",
      scheduledDate: new Date(2025, currentMonth.getMonth(), 5),
      priority: "medium",
      taskCount: 1,
    },
    {
      id: 3,
      title: "Update documentation",
      scheduledDate: new Date(2025, currentMonth.getMonth(), 12),
      priority: "low",
      taskCount: 2,
    },
    {
      id: 4,
      title: "Client meeting",
      scheduledDate: new Date(2025, currentMonth.getMonth(), 18),
      priority: "high",
      taskCount: 1,
    },
    {
      id: 5,
      title: "Code review session",
      scheduledDate: new Date(2025, currentMonth.getMonth(), 22),
      priority: "medium",
      taskCount: 4,
    },
  ];

  // Priority badge styling
  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500",
    };
    return styles[priority] || "bg-gray-400";
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Create a lookup of dates with scheduled tasks for the current month
  const scheduledDates = useMemo(() => {
    const dates = {};

    dummyTasks.forEach((task) => {
      if (task.scheduledDate) {
        const scheduledDate = new Date(task.scheduledDate);

        // Only include tasks from the current month/year
        if (
          scheduledDate.getMonth() === currentMonth.getMonth() &&
          scheduledDate.getFullYear() === currentMonth.getFullYear()
        ) {
          const day = scheduledDate.getDate();
          if (!dates[day]) {
            dates[day] = {
              tasks: [],
              priorities: [],
            };
          }

          dates[day].tasks.push(task.taskCount);
          dates[day].priorities.push(task.priority);
        }
      }
    });

    return dates;
  }, [currentMonth]);

  const days = [];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2 sm:p-4 rounded-lg"></div>);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayData = scheduledDates[i];
    const totalTasks = dayData ? dayData.tasks.reduce((a, b) => a + b, 0) : 0;
    const priorities = dayData ? [...new Set(dayData.priorities)] : [];

    days.push(
      <div
        key={i}
        className="p-2 sm:p-4 bg-white rounded-xl shadow-sm text-center font-semibold text-gray-800 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
      >
        {/* Date number */}
        <div className="text-[0.45rem] sm:text-lg mb-1">{i}</div>

        {/* Task count and priorities */}
        {totalTasks > 0 && (
          <div className="flex flex-col items-center gap-1">
            <div className="text-[0.4rem] sm:text-xs text-blue-600 font-bold">
              {totalTasks} task{totalTasks > 1 ? "s" : ""}
            </div>
            <div className="flex justify-center gap-1 flex-wrap">
              {priorities.slice(0, 3).map((priority, idx) => (
                <span
                  key={`${i}-${priority}-${idx}`}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getPriorityBadge(
                    priority
                  )}`}
                  title={`${priority} priority`}
                ></span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6 font-inter text-gray-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Task Calendar
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Visualize and manage your tasks with an interactive calendar.
        </p>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-lg p-1 sm:p-6 lg:p-8 mb-8 max-w-full overflow-x-auto min-w-0">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Monthly Calendar View
        </h3>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="p-1.5 sm:p-2 lg:p-2 rounded-full bg-purple-100 text-gray-600 hover:bg-purple-200 transition-colors duration-200 flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>

          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {monthName}
          </span>

          <button
            onClick={handleNextMonth}
            aria-label="Next month"
            className="p-1.5 sm:p-2 lg:p-2 rounded-full bg-purple-100 text-gray-600 hover:bg-purple-200 transition-colors duration-200 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {/* Days Grid */}
        <div className="w-full max-w-full overflow-x-auto min-w-0">
          <div
            className="grid grid-cols-7 gap-0.5 sm:gap-4 text-center w-full max-w-full min-w-0"
            style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="font-semibold text-gray-600 text-[0.45rem] sm:text-base leading-tight px-0.5"
              >
                {day}
              </div>
            ))}

            {days}
          </div>
        </div>
      </div>

      {/* Task Legend */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Priority Legend
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm text-gray-700">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm text-gray-700">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm text-gray-700">Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
};
