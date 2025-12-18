import { useState } from "react";
import {
  Share2,
  Plus,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AddTaskMenu } from "../features";

export const TasksPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [tasks, setTasks] = useState(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Initialize tasks data
  const taskGroups = tasks || [
    {
      id: "new-tasks",
      title: "New tasks",
      icon: "📥",
      tasks: [
        {
          id: 1,
          title: "Get another day full of work done!",
          status: "Important",
          progress: 74,
          days: 3,
          users: 2,
          completed: false,
          subtasks: [
            {
              id: 11,
              title: "Review morning priorities",
              progress: 100,
              completed: true,
            },
            {
              id: 12,
              title: "Complete client presentation",
              progress: 50,
              completed: false,
            },
          ],
        },
        {
          id: 2,
          title: "Keep my mentality healthy by taking walks outside",
          status: "Pending",
          progress: 38,
          days: 3,
          users: 2,
          completed: false,
          subtasks: [],
        },
      ],
    },
    {
      id: "do-today",
      title: "Do today",
      icon: "📌",
      tasks: [
        {
          id: 3,
          title: "Figure out how to use Clever from the help center",
          status: "Urgent",
          progress: 10,
          days: 3,
          users: 1,
          completed: false,
          subtasks: [
            {
              id: 31,
              title: "Read documentation",
              progress: 100,
              completed: true,
            },
            {
              id: 32,
              title: "Watch tutorial videos",
              progress: 0,
              completed: false,
            },
            {
              id: 33,
              title: "Try practice exercises",
              progress: 0,
              completed: false,
            },
          ],
        },
        {
          id: 4,
          title: "Build some new components in Figma",
          status: "New project",
          progress: 87,
          days: 2,
          users: 1,
          completed: false,
          subtasks: [
            {
              id: 41,
              title: "Create button components",
              progress: 100,
              completed: true,
            },
            {
              id: 42,
              title: "Design card layouts",
              progress: 75,
              completed: false,
            },
          ],
        },
        {
          id: 5,
          title: "Create wireframes for the new dashboard",
          status: "Design",
          progress: 0,
          days: 1,
          users: 2,
          completed: false,
          subtasks: [],
        },
      ],
    },
    {
      id: "in-progress",
      title: "In progress",
      icon: "⚡",
      tasks: [
        {
          id: 6,
          title: "Figure out how to use Clever from the help center",
          status: "Pending",
          progress: 10,
          days: 3,
          users: 2,
          completed: false,
          subtasks: [],
        },
        {
          id: 7,
          title: "Build some new components in Figma",
          status: "Delayed",
          progress: 83,
          days: 2,
          users: 1,
          completed: false,
          subtasks: [
            {
              id: 71,
              title: "Research best practices",
              progress: 100,
              completed: true,
            },
            {
              id: 72,
              title: "Create initial mockups",
              progress: 80,
              completed: false,
            },
            {
              id: 73,
              title: "Get team feedback",
              progress: 60,
              completed: false,
            },
          ],
        },
        {
          id: 8,
          title: "Create wireframes for the new dashboard",
          status: "Critical",
          progress: 0,
          days: 1,
          users: 2,
          completed: false,
          subtasks: [],
        },
        {
          id: 9,
          title: "Get another day full of work done!",
          status: "In Progress",
          progress: 74,
          days: 3,
          users: 3,
          completed: false,
          subtasks: [],
        },
        {
          id: 10,
          title: "Keep my mentality healthy by taking walks outside",
          status: "Wellness",
          progress: 38,
          days: 3,
          users: 2,
          completed: false,
          subtasks: [],
        },
      ],
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Important: "bg-orange-400",
      Pending: "bg-orange-400",
      Urgent: "bg-purple-500",
      "New project": "bg-green-400",
      Design: "bg-purple-400",
      Delayed: "bg-red-500",
      Critical: "bg-red-500",
      "In Progress": "bg-teal-400",
      Wellness: "bg-orange-400",
    };
    return colors[status] || "bg-gray-400";
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const toggleTaskCompletion = (
    taskId,
    isSubtask = false,
    parentTaskId = null
  ) => {
    setTasks((prevTasks) => {
      if (!prevTasks) return prevTasks;

      return prevTasks.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) => {
          if (isSubtask && task.id === parentTaskId) {
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === taskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              ),
            };
          } else if (!isSubtask && task.id === taskId) {
            return { ...task, completed: !task.completed };
          }
          return task;
        }),
      }));
    });
  };

  const handleSaveTask = (newTask) => {
    // In a real app, this would save to backend
    console.log("New task created:", newTask);

    // Add to the first group (New tasks) for demo purposes
    const taskData = {
      id: Date.now(),
      title: newTask.title,
      status: "New",
      progress: 0,
      days: 1,
      users: 1,
      completed: false,
      subtasks: newTask.subtasks.map((st) => ({
        ...st,
        progress: 0,
      })),
      attachments: newTask.attachments,
    };

    setTasks((prevTasks) => {
      if (!prevTasks) return prevTasks;

      const updatedTasks = [...prevTasks];
      updatedTasks[0] = {
        ...updatedTasks[0],
        tasks: [taskData, ...updatedTasks[0].tasks],
      };
      return updatedTasks;
    });

    setIsAddTaskOpen(false);
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Launch Clever dashboard theme
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Create</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {["all", "most-recent", "popular"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                {tab === "all"
                  ? "View all"
                  : tab === "most-recent"
                  ? "Most recent"
                  : "Popular"}
              </button>
            ))}
          </div>
        </div>

        {/* Task Groups */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {taskGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Group Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-3 sm:p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{group.icon}</span>
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                      {group.title}
                    </h2>
                    <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {group.tasks.length}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Tasks */}
              <div className="divide-y divide-gray-100">
                {group.tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    getStatusColor={getStatusColor}
                    isExpanded={expandedTasks.has(task.id)}
                    onToggleExpansion={toggleTaskExpansion}
                    onToggleCompletion={toggleTaskCompletion}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Menu */}
      <AddTaskMenu
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

// Task Row Component
const TaskRow = ({
  task,
  getStatusColor,
  isExpanded,
  onToggleExpansion,
  onToggleCompletion,
}) => {
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  const handleRowClick = (e) => {
    // Only expand if clicking the row itself (not checkbox or other buttons)
    if (hasSubtasks && !e.target.closest("button")) {
      onToggleExpansion(task.id);
    }
  };

  return (
    <div className="bg-[#C6532A] bg-opacity-5 hover:bg-opacity-10 transition-all duration-200">
      {/* Main Task */}
      <div
        className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 lg:p-6 cursor-pointer"
        onClick={handleRowClick}
      >
        {/* Expand Button (if has subtasks) */}
        <div className="flex-shrink-0">
          {hasSubtasks ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpansion(task.id);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 sm:p-1"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          ) : (
            <div className="w-5 sm:w-7" />
          )}
        </div>

        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompletion(task.id);
          }}
          className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all ${
            task.completed
              ? "bg-blue-600 border-blue-600"
              : "border-gray-300 hover:border-blue-600"
          }`}
        >
          {task.completed && (
            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
          )}
        </button>

        {/* Task Title */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs sm:text-sm md:text-base leading-tight sm:leading-normal ${
              task.completed ? "line-through text-gray-400" : "text-gray-100"
            }`}
          >
            {task.title}
          </p>
        </div>

        {/* Status Badge (Hidden on small mobile) */}
        <div className="hidden md:flex flex-shrink-0">
          <span
            className={`px-2 md:px-3 py-0.5 md:py-1 ${getStatusColor(
              task.status
            )} text-white text-xs rounded-full whitespace-nowrap`}
          >
            {task.status}
          </span>
        </div>

        {/* Progress */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                className="text-gray-200 sm:hidden"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-gray-200 hidden sm:block"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${
                  2 * Math.PI * 16 * (1 - task.progress / 100)
                }`}
                className={`${getStatusColor(task.status).replace(
                  "bg-",
                  "text-"
                )} transition-all duration-500 sm:hidden`}
                strokeLinecap="round"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${
                  2 * Math.PI * 20 * (1 - task.progress / 100)
                }`}
                className={`${getStatusColor(task.status).replace(
                  "bg-",
                  "text-"
                )} transition-all duration-500 hidden sm:block`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-gray-700">
              {task.progress}%
            </span>
          </div>
        </div>

        {/* Days */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0 text-gray-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">{task.days}d</span>
        </div>

        {/* Users */}
        <div className="hidden sm:flex items-center flex-shrink-0">
          <div className="flex items-center -space-x-2">
            {[...Array(task.users)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
        </div>

        {/* More Button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5 sm:p-1"
        >
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Mobile-only info row */}
      <div className="flex sm:hidden items-center gap-2 sm:gap-4 px-2 sm:px-4 pb-2 sm:pb-4 text-xs overflow-x-auto">
        <span
          className={`px-2 py-0.5 ${getStatusColor(
            task.status
          )} text-white text-xs rounded-full whitespace-nowrap flex-shrink-0`}
        >
          {task.status}
        </span>
        <div className="flex items-center gap-1 text-xs text-gray-600 flex-shrink-0">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{task.days}d</span>
        </div>
        <div className="flex items-center -space-x-1.5">
          {[...Array(task.users)].map((_, i) => (
            <div
              key={i}
              className=" w-5 h-5 rounded-full bg-blue-600 border border-white flex items-center justify-center text-white text-[9px] font-medium"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
      </div>

      {/* Subtasks */}
      <AnimatePresence>
        {hasSubtasks && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white bg-opacity-50"
          >
            <div className="pl-6 sm:pl-12 md:pl-16 pr-2 sm:pr-4 md:pr-6 pb-2 sm:pb-4 space-y-1.5 sm:space-y-2">
              {task.subtasks.map((subtask) => (
                <SubtaskRow
                  key={subtask.id}
                  subtask={subtask}
                  parentTaskId={task.id}
                  onToggleCompletion={onToggleCompletion}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Subtask Row Component
const SubtaskRow = ({ subtask, parentTaskId, onToggleCompletion }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-md sm:rounded-lg border border-gray-200 hover:border-[#C6532A] hover:shadow-sm transition-all">
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleCompletion(subtask.id, true, parentTaskId);
        }}
        className={`flex-shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center transition-all ${
          subtask.completed
            ? "bg-blue-600 border-blue-600"
            : "border-gray-300 hover:border-blue-600"
        }`}
      >
        {subtask.completed && (
          <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
        )}
      </button>

      {/* Subtask Title */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[11px] sm:text-xs md:text-sm leading-tight ${
            subtask.completed ? "line-through text-gray-400" : "text-gray-700"
          }`}
        >
          {subtask.title}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <div className="w-12 sm:w-20 h-1 sm:h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C6532A] transition-all duration-500"
            style={{ width: `${subtask.progress}%` }}
          />
        </div>
        <span className="text-[10px] sm:text-xs text-gray-600 w-8 sm:w-10 text-right">
          {subtask.progress}%
        </span>
      </div>
    </div>
  );
};
