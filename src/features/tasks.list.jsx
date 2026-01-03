import { useState, useMemo } from "react";
import {
  Share2,
  Plus,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Check,
  Bell,
  Paperclip,
  Trash2,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AddTaskMenu } from "./index";

export const TasksList = ({ searchQuery = "", sortBy = "" }) => {
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Initialize tasks data
  const [tasks, setTasks] = useState([
    {
      id: "new-tasks",
      title: "New tasks",
      icon: "📥",
      tasks: [
        {
          id: 1,
          title: "Get another day full of work done!",
          priority: "High",
          description:
            "Focus on completing the main deliverables and coordinate with the team for final review.",
          progress: 74,
          days: 3,
          users: 2,
          completed: false,
          createdAt: new Date("2026-01-03"),
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
          priority: "Low",
          progress: 38,
          days: 3,
          users: 2,
          completed: false,
          createdAt: new Date("2026-01-02"),
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
          priority: "Urgent",
          description:
            "Review all documentation and tutorials to understand the platform features.",
          progress: 10,
          days: 3,
          users: 1,
          completed: false,
          createdAt: new Date("2026-01-01"),
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
          priority: "Medium",
          description:
            "Design a comprehensive component library including buttons, cards, and navigation elements for the new design system.",
          progress: 87,
          days: 2,
          users: 1,
          completed: false,
          createdAt: new Date("2025-12-31"),
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
          priority: "Medium",
          progress: 0,
          days: 1,
          users: 2,
          completed: false,
          createdAt: new Date("2025-12-30"),
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
          priority: "Low",
          progress: 10,
          days: 3,
          users: 2,
          completed: false,
          createdAt: new Date("2025-12-29"),
          subtasks: [],
        },
        {
          id: 7,
          title: "Build some new components in Figma",
          priority: "Delayed",
          description:
            "This task was delayed due to resource constraints. Need to prioritize other urgent items first before continuing with the component design work.",
          progress: 83,
          days: 2,
          users: 1,
          completed: false,
          createdAt: new Date("2025-12-28"),
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
          priority: "Urgent",
          progress: 0,
          days: 1,
          users: 2,
          completed: false,
          createdAt: new Date("2025-12-27"),
          subtasks: [],
        },
        {
          id: 9,
          title: "Get another day full of work done!",
          priority: "High",
          description:
            "Stay focused and maintain productivity throughout the day. Break down work into manageable chunks and take regular breaks for better efficiency.",
          progress: 74,
          days: 3,
          users: 3,
          completed: false,
          createdAt: new Date("2025-12-26"),
          subtasks: [],
        },
        {
          id: 10,
          title: "Keep my mentality healthy by taking walks outside",
          priority: "Low",
          progress: 38,
          days: 3,
          users: 2,
          completed: false,
          createdAt: new Date("2025-12-25"),
          subtasks: [],
        },
      ],
    },
  ]);

  // Flatten all tasks from groups into a single array
  const allTasks = useMemo(() => {
    return tasks.flatMap((group) => group.tasks);
  }, [tasks]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let taskList = [...allTasks];

    // Filter by search query
    if (searchQuery.trim()) {
      taskList = taskList.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort tasks
    if (sortBy === "name-asc") {
      taskList = taskList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "date-desc") {
      taskList = taskList.sort(
        (a, b) =>
          (b.createdAt || new Date(0)).getTime() -
          (a.createdAt || new Date(0)).getTime()
      );
    }

    return taskList;
  }, [allTasks, searchQuery, sortBy]);

  const getPriorityEmoji = (priority) => {
    const emojis = {
      Urgent: "🔴",
      High: "🟠",
      Medium: "🟡",
      Low: "🟢",
      Delayed: "⚪",
    };
    return emojis[priority] || "🟡";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Urgent: "bg-red-100 text-red-700 border-red-200",
      High: "bg-orange-100 text-orange-700 border-orange-200",
      Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Low: "bg-green-100 text-green-700 border-green-200",
      Delayed: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[priority] || "bg-gray-100 text-gray-700 border-gray-200";
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
      return prevTasks.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) => {
          if (isSubtask && task.id === parentTaskId) {
            // Update the specific subtask
            const updatedSubtasks = task.subtasks.map((subtask) =>
              subtask.id === taskId
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            );

            // Check if all subtasks are now completed
            const allSubtasksCompleted = updatedSubtasks.every(
              (st) => st.completed
            );

            return {
              ...task,
              subtasks: updatedSubtasks,
              completed: allSubtasksCompleted, // Auto-complete parent if all subtasks are done
            };
          } else if (!isSubtask && task.id === taskId) {
            const newCompletedState = !task.completed;
            // If task has subtasks, mark all subtasks with the same completed state
            const updatedSubtasks =
              task.subtasks && task.subtasks.length > 0
                ? task.subtasks.map((subtask) => ({
                    ...subtask,
                    completed: newCompletedState,
                  }))
                : task.subtasks;

            return {
              ...task,
              completed: newCompletedState,
              subtasks: updatedSubtasks,
            };
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
      description: newTask.description,
      priority: newTask.priority || "Medium",
      progress: 0,
      days: 1,
      users: 1,
      completed: false,
      createdAt: new Date(),
      subtasks: newTask.subtasks.map((st) => ({
        ...st,
        progress: 0,
      })),
      attachments: newTask.attachments,
    };

    setTasks((prevTasks) => {
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
        {/* Header Section with Create Button */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-end gap-2 sm:gap-3">
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

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredAndSortedTasks.length > 0 ? (
            filteredAndSortedTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                getPriorityEmoji={getPriorityEmoji}
                getPriorityColor={getPriorityColor}
                isExpanded={expandedTasks.has(task.id)}
                onToggleExpansion={toggleTaskExpansion}
                onToggleCompletion={toggleTaskCompletion}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              No tasks found
            </div>
          )}
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
  getPriorityEmoji,
  getPriorityColor,
  isExpanded,
  onToggleExpansion,
  onToggleCompletion,
  openMenuId,
  setOpenMenuId,
}) => {
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const hasDescription = task.description && task.description.trim();

  const handleRowClick = (e) => {
    // Expand to show description if it exists, or subtasks
    if ((hasDescription || hasSubtasks) && !e.target.closest("button")) {
      onToggleExpansion(task.id);
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* Main Task */}
      <div
        className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer"
        onClick={handleRowClick}
      >
        {/* Expand Button (if has description or subtasks) */}
        <div className="flex-shrink-0">
          {hasDescription || hasSubtasks ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpansion(task.id);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>

        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompletion(task.id);
          }}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            task.completed
              ? "bg-blue-600 border-blue-600"
              : "border-gray-300 hover:border-blue-600"
          }`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        {/* Task Title */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm sm:text-base leading-tight ${
              task.completed ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            {task.title}
          </p>
        </div>

        {/* Priority Badge with Progress */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 border ${getPriorityColor(
              task.priority
            )} text-xs font-medium rounded-full whitespace-nowrap`}
          >
            <span>{getPriorityEmoji(task.priority)}</span>
            <span>{task.priority}</span>
          </span>
          <span className="text-xs text-gray-500 font-medium">
            {task.progress}%
          </span>
        </div>

        {/* Date */}
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {task.createdAt
              ? new Date(task.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "No date"}
          </span>
        </div>

        {/* More Options Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === task.id ? null : task.id);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {openMenuId === task.id && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Add reminder for task:", task.id);
                  setOpenMenuId(null);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-4 h-4" />
                Add reminder
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Add attachment for task:", task.id);
                  setOpenMenuId(null);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
                Add attachment
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Update date for task:", task.id);
                  setOpenMenuId(null);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Update date
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Delete task:", task.id);
                  setOpenMenuId(null);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description and Subtasks */}
      <AnimatePresence>
        {isExpanded && (hasDescription || hasSubtasks) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gray-100"
          >
            {/* Description Section */}
            {hasDescription && (
              <div className="px-4 sm:px-5 py-3 bg-blue-50/50">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}

            {/* Subtasks Section */}
            {hasSubtasks && (
              <div className="px-4 sm:px-5 py-3 space-y-2">
                {task.subtasks.map((subtask) => (
                  <SubtaskRow
                    key={subtask.id}
                    subtask={subtask}
                    parentTaskId={task.id}
                    onToggleCompletion={onToggleCompletion}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Subtask Row Component
const SubtaskRow = ({ subtask, parentTaskId, onToggleCompletion }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-md sm:rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleCompletion(subtask.id, true, parentTaskId);
        }}
        className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
          subtask.completed
            ? "bg-blue-600 border-blue-600"
            : "border-gray-300 hover:border-blue-600"
        }`}
      >
        {subtask.completed && <Check className="w-3 h-3 text-white" />}
      </button>

      {/* Subtask Title */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-tight ${
            subtask.completed ? "line-through text-gray-400" : "text-gray-700"
          }`}
        >
          {subtask.title}
        </p>
      </div>
    </div>
  );
};
