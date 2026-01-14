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
  FileText,
  FileImage,
  FileVideo,
  Trash2,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { AddTaskMenu } from "./index";
import {
  useGetAllTasksQuery,
  useGetSubtasksByTaskIdQuery,
  useLazyGetSubtasksByTaskIdQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useUpdateSubtaskMutation,
} from "../store/tasks.api";

export const TasksList = ({ searchQuery = "", sortBy = "" }) => {
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Fetch tasks from API
  const { data: apiTasks, isLoading, isError } = useGetAllTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [updateSubtask] = useUpdateSubtaskMutation();
  const [fetchSubtasksByTaskId] = useLazyGetSubtasksByTaskIdQuery();

  const getCompletionStatus = (item) => {
    return Boolean(item?.completionStatus ?? item?.completed ?? false);
  };

  const extractSubtasksArray = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.subtasks)) {
      return response.data.subtasks;
    }
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    }
    if (Array.isArray(response.subtasks)) return response.subtasks;
    return [];
  };

  // Transform API tasks to the format expected by the UI
  const tasks = useMemo(() => {
    if (!apiTasks) return [];

    // Handle different API response structures
    let tasksArray = [];
    if (Array.isArray(apiTasks)) {
      tasksArray = apiTasks;
    } else if (apiTasks.data && Array.isArray(apiTasks.data)) {
      tasksArray = apiTasks.data;
    } else if (apiTasks.tasks && Array.isArray(apiTasks.tasks)) {
      tasksArray = apiTasks.tasks;
    }

    if (tasksArray.length === 0) return [];

    return tasksArray.map((task) => ({
      id: task._id || task.id,
      title: task.taskName || task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
      progress: task.percentageCompleted || task.progress || 0,
      days: task.days || 1,
      users: task.users || 1,
      completed: task.completionStatus ?? task.completed ?? false,
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
      deadline: task.deadline ? new Date(task.deadline) : null,
      subtasks: task.subtasks || [],
      subtaskCount:
        typeof task.subtaskCount === "number"
          ? task.subtaskCount
          : Array.isArray(task.subtasks)
          ? task.subtasks.length
          : 0,
      attachments: task.attachments || [],
    }));
  }, [apiTasks]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let taskList = [...tasks];

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
      // Sort by deadline descending; tasks without deadline go last
      taskList = taskList.sort((a, b) => {
        const aTime =
          a.deadline instanceof Date
            ? a.deadline.getTime()
            : a.deadline
            ? new Date(a.deadline).getTime()
            : -Infinity;
        const bTime =
          b.deadline instanceof Date
            ? b.deadline.getTime()
            : b.deadline
            ? new Date(b.deadline).getTime()
            : -Infinity;
        return bTime - aTime;
      });
    }

    return taskList;
  }, [tasks, searchQuery, sortBy]);

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

  const toggleTaskCompletion = async (
    taskId,
    isSubtask = false,
    parentTaskId = null,
    currentCompleted = null
  ) => {
    if (!isSubtask) {
      // Update main task completion via API
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        const nextCompleted = !task.completed;
        try {
          await updateTask({
            id: taskId,
            completionStatus: nextCompleted,
          }).unwrap();

          // Completion Propagation Rule (frontend enforcement)
          // When a Task is marked completed, auto-complete all subtasks.
          if (nextCompleted && (task.subtaskCount ?? 0) > 0) {
            const subtasksResponse = await fetchSubtasksByTaskId(
              taskId
            ).unwrap();
            const subtasksArray = extractSubtasksArray(subtasksResponse);

            await Promise.all(
              subtasksArray
                .filter((st) => !getCompletionStatus(st))
                .map((st) =>
                  updateSubtask({
                    id: st._id || st.id,
                    parentTaskId: taskId,
                    completionStatus: true,
                  }).unwrap()
                )
            );
          }
        } catch (error) {
          console.error("Failed to update task:", error);
          alert(
            error?.data?.message ||
              error?.message ||
              "Failed to update task. Please try again."
          );
        }
      }
    } else {
      // Update subtask completion via API
      if (currentCompleted === null || currentCompleted === undefined) {
        console.warn("Missing current subtask state; skipping update", {
          taskId,
          parentTaskId,
        });
        return;
      }
      try {
        await updateSubtask({
          id: taskId,
          parentTaskId,
          completionStatus: !currentCompleted,
        }).unwrap();

        // Completion propagation upward (frontend enforcement)
        // If all subtasks are complete, auto-complete the parent task.
        if (parentTaskId) {
          const parentTask = tasks.find((t) => t.id === parentTaskId);
          if (parentTask && (parentTask.subtaskCount ?? 0) > 0) {
            const subtasksResponse = await fetchSubtasksByTaskId(
              parentTaskId
            ).unwrap();
            const subtasksArray = extractSubtasksArray(subtasksResponse);
            const allCompleted =
              subtasksArray.length > 0 &&
              subtasksArray.every((st) => getCompletionStatus(st));

            if (allCompleted && !parentTask.completed) {
              await updateTask({
                id: parentTaskId,
                completionStatus: true,
              }).unwrap();
            }
          }
        }
      } catch (error) {
        console.error("Failed to update subtask:", error);
        alert(
          error?.data?.message ||
            error?.message ||
            "Failed to update subtask. Please try again."
        );
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    // Deletion Guard Rule (frontend enforcement)
    // Block deletion if any child subtask is incomplete.
    const task = tasks.find((t) => t.id === taskId);

    try {
      if (task && (task.subtaskCount ?? 0) > 0) {
        const subtasksResponse = await fetchSubtasksByTaskId(taskId).unwrap();
        const subtasksArray = extractSubtasksArray(subtasksResponse);
        const hasIncomplete = subtasksArray.some(
          (st) => !(st.completionStatus || st.completed)
        );

        if (hasIncomplete) {
          alert(
            "Cannot delete this task because it has incomplete subtasks. Complete all subtasks first."
          );
          setOpenMenuId(null);
          return;
        }
      }

      await deleteTask(taskId).unwrap();
      setOpenMenuId(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert(
        error?.data?.message ||
          error?.message ||
          "Failed to delete task. Please try again."
      );
    }
  };

  const handleSaveTask = async (newTask) => {
    // This will be handled by AddTaskMenu component
    // Just close the menu after saving
    setIsAddTaskOpen(false);
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Context + Create Button */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* LEFT SIDE — Contextual Info */}
            <div className="flex flex-col gap-1">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Tasks Overview
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Organize priorities, deadlines, and progress in one place
              </p>

              {/* Optional stats row */}
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span>• High priority focus</span>
                <span>• Deadlines tracked</span>
                <span className="hidden sm:inline">• Subtasks supported</span>
              </div>
            </div>

            {/* RIGHT SIDE — Animated Create Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="relative group inline-flex items-center gap-2 cursor-pointer
               px-4 sm:px-5 py-2 sm:py-2.5 
               rounded-xl font-medium text-sm sm:text-base text-blue-600
               bg-white
               shadow-lg shadow-blue-500/30
               active:scale-[0.97]
               transition-all duration-300"
              >
                {/* Always-on animated pulse border */}
                <span
                  className="absolute inset-0 rounded-xl 
                 border-2 border-blue-500/60
                 animate-pulse"
                />

                {/* Always-on glowing aura */}
                <span
                  className="absolute inset-[10px] rounded-xl 
                 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
                 opacity-30 blur-lg
                 animate-pulse"
                />

                {/* Hover intensifies glow (does NOT create it) */}
                <span
                  className="absolute -inset-[1px] rounded-xl 
                 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400
                 opacity-0 group-hover:opacity-40 blur-xl
                 transition-opacity duration-300"
                />

                {/* Button content */}
                <span className="relative z-10 flex items-center gap-2 bg-white rounded-xl px-4 sm:px-5 py-2 sm:py-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white">
                    <Plus className="w-4 h-4" />
                  </span>
                  <span>Create Task</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            Loading tasks...
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-red-200 p-8 text-center text-red-500">
            Failed to load tasks. Please try again.
          </div>
        )}

        {/* Tasks List */}
        {!isLoading && !isError && (
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
                  onDeleteTask={handleDeleteTask}
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
        )}
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
  onDeleteTask,
  openMenuId,
  setOpenMenuId,
}) => {
  const token = useSelector((state) => state?.auth?.token);
  const hasSubtasks = (task.subtaskCount ?? 0) > 0;
  const hasDescription = task.description && task.description.trim();

  const getAttachmentDownloadUrl = (attachment) => {
    if (!attachment) return null;

    const baseUrl = import.meta?.env?.VITE_API_URL;
    const origin = (() => {
      try {
        return new URL(baseUrl).origin;
      } catch {
        return window.location.origin;
      }
    })();

    const url = attachment.url;
    if (typeof url === "string" && url.trim()) {
      if (/^https?:\/\//i.test(url)) return url;
      if (url.startsWith("/")) return `${origin}${url}`;
      return `${origin}/${url}`;
    }

    // Fallback for GridFS-style attachments (backend route may differ)
    const fileId = attachment.fileId;
    if (fileId) {
      return `${baseUrl}/files/${fileId}`;
    }

    return null;
  };

  const downloadAttachment = async (attachment) => {
    const url = getAttachmentDownloadUrl(attachment);
    if (!url) return;

    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        throw new Error(`Download failed (${res.status})`);
      }

      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      
      // Build proper filename with extension
      let filename = attachment.filename || attachment.name || "attachment";
      const format = attachment.format;
      
      // Ensure filename has the correct extension
      if (format && !filename.toLowerCase().endsWith(`.${format.toLowerCase()}`)) {
        filename = `${filename}.${format}`;
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error("Failed to download attachment", e);
      // Fallback: open in a new tab (may still allow user to download)
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const getAttachmentIcon = (attachment) => {
    const type = String(attachment?.type || "").toLowerCase();
    const format = String(attachment?.format || "").toLowerCase();

    if (type === "image" || ["png", "jpg", "jpeg"].includes(format)) return FileImage;
    if (type === "video" || ["mp4", "mkv", "mov"].includes(format)) return FileVideo;
    return FileText;
  };

  const {
    data: subtasksResponse,
    isLoading: isSubtasksLoading,
    isError: isSubtasksError,
  } = useGetSubtasksByTaskIdQuery(task.id, {
    skip: !isExpanded || !hasSubtasks,
  });

  const subtasks = useMemo(() => {
    if (!subtasksResponse) return [];

    let subtasksArray = [];
    if (Array.isArray(subtasksResponse)) {
      subtasksArray = subtasksResponse;
    } else if (Array.isArray(subtasksResponse.data)) {
      subtasksArray = subtasksResponse.data;
    } else if (
      subtasksResponse.data &&
      Array.isArray(subtasksResponse.data.subtasks)
    ) {
      subtasksArray = subtasksResponse.data.subtasks;
    } else if (Array.isArray(subtasksResponse.subtasks)) {
      subtasksArray = subtasksResponse.subtasks;
    }

    return subtasksArray.map((st) => ({
      id: st._id || st.id,
      title: st.subtaskName || st.title || st.name || "",
      completed: st.completionStatus ?? st.completed ?? false,
    }));
  }, [subtasksResponse]);

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
        <div className="shrink-0">
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
          className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            task.completed
              ? "bg-blue-600 border-blue-600"
              : "border-gray-300 hover:border-blue-600"
          }`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        {/* Task Title + Dates */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm sm:text-base leading-tight ${
              task.completed ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            {task.title}
          </p>
          {/* Dates Row: responsive flex/stack */}
          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mt-1">
            {/* Created Date */}
            <span className="inline-flex items-center justify-end px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium gap-1 border border-gray-200">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Created:{" "}
              {task.createdAt
                ? new Date(task.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "-"}
            </span>
            {/* Deadline Date */}
            {task.deadline && (
              <span
                className={`inline-flex items-center justify-end px-2 py-0.5 rounded-full border text-xs font-medium gap-1
                  ${(() => {
                    const today = new Date();
                    const deadline = new Date(task.deadline);
                    const isOverdue = deadline < today.setHours(0, 0, 0, 0);
                    const isToday =
                      deadline.toDateString() === new Date().toDateString();
                    if (isOverdue)
                      return "bg-red-100 text-red-700 border-red-200";
                    if (isToday)
                      return "bg-orange-100 text-orange-700 border-orange-200";
                    return "bg-green-100 text-green-700 border-green-200";
                  })()}`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Due:{" "}
                {new Date(task.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Priority Badge with Progress and Deadline */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="flex flex-col items-end gap-1">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 border ${getPriorityColor(
                task.priority
              )} text-xs font-medium rounded-full whitespace-nowrap`}
            >
              <span>{getPriorityEmoji(task.priority)}</span>
              <span>{task.priority}</span>
            </span>

            {Array.isArray(task.attachments) && task.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                {task.attachments.slice(0, 3).map((att, idx) => {
                  const Icon = getAttachmentIcon(att);
                  const label = att?.filename || att?.name || `Attachment ${idx + 1}`;
                  return (
                    <button
                      key={`${task.id}-att-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadAttachment(att);
                      }}
                      title={`Download: ${label}`}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white/70 text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}

                {task.attachments.length > 3 && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 bg-gray-100 border border-gray-200 rounded-full"
                    title={`${task.attachments.length} attachments`}
                  >
                    <Paperclip className="w-3 h-3" />+{task.attachments.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Progress Pie Chart */}
          <span className="inline-flex items-center justify-center">
            <svg width="38" height="38" viewBox="0 0 28 28" className="block">
              <circle
                cx="14"
                cy="14"
                r="12"
                fill="#F3F4F6"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              <circle
                cx="14"
                cy="14"
                r="12"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                strokeDasharray={2 * Math.PI * 12}
                strokeDashoffset={
                  2 * Math.PI * 12 * (1 - (task.progress ?? 0) / 100)
                }
                strokeLinecap="round"
                transform="rotate(-90 14 14)"
              />
              <text
                x="14"
                y="16"
                textAnchor="middle"
                fontSize="8.5"
                fill="#2563EB"
                fontWeight="bold"
              >
                {Math.round(task.progress ?? 0)}%
              </text>
            </svg>
          </span>
        </div>

        {/* Date: removed, now shown under title */}

        {/* More Options Menu */}
        <div className="relative shrink-0">
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
                  if (
                    window.confirm("Are you sure you want to delete this task?")
                  ) {
                    onDeleteTask(task.id);
                  }
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
                {isSubtasksLoading && (
                  <div className="text-sm text-gray-500">
                    Loading subtasks...
                  </div>
                )}

                {isSubtasksError && (
                  <div className="text-sm text-red-500">
                    Failed to load subtasks.
                  </div>
                )}

                {!isSubtasksLoading &&
                  !isSubtasksError &&
                  subtasks.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No subtasks found
                    </div>
                  )}

                {!isSubtasksLoading &&
                  !isSubtasksError &&
                  subtasks.map((subtask) => (
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
          onToggleCompletion(subtask.id, true, parentTaskId, subtask.completed);
        }}
        className={`shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
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
