import { useState, useRef } from "react";
import {
  X,
  Bold,
  Italic,
  Link2,
  Smile,
  Paperclip,
  Upload,
  Trash2,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AddTaskMenu = ({ isOpen, onClose, onSave }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now(), title: "", completed: false }]);
  };

  const handleSubtaskChange = (id, value) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, title: value } : st))
    );
  };

  const handleSubtaskToggle = (id) => {
    setSubtasks(
      subtasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st
      )
    );
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter((file) => {
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    const newAttachments = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter((att) => att.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSave = () => {
    if (!taskTitle.trim()) return;

    const newTask = {
      title: taskTitle,
      description,
      subtasks: subtasks.filter((st) => st.title.trim()),
      attachments,
    };

    onSave?.(newTask);
    handleReset();
  };

  const handleReset = () => {
    setTaskTitle("");
    setDescription("");
    setSubtasks([]);
    setAttachments([]);
  };

  const handleClose = () => {
    handleReset();
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[500px] md:w-[600px] lg:w-[700px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Create a new task
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {/* Task Title */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Click here and start typing"
                    className="w-full text-base sm:text-lg font-medium px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors placeholder:text-gray-400"
                    autoFocus
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="border-2 border-gray-200 rounded-xl focus-within:border-blue-500 transition-colors">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    rows="4"
                    className="w-full px-4 py-3 border-none focus:outline-none resize-none text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Subtasks
                </h3>
                <div className="space-y-2">
                  {subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-2 group"
                    >
                      <button
                        onClick={() => handleSubtaskToggle(subtask.id)}
                        className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                          subtask.completed
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300 hover:border-blue-600"
                        }`}
                      >
                        {subtask.completed && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <input
                        type="text"
                        value={subtask.title}
                        onChange={(e) =>
                          handleSubtaskChange(subtask.id, e.target.value)
                        }
                        placeholder="Enter subtask"
                        className={`flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors ${
                          subtask.completed ? "line-through text-gray-400" : ""
                        }`}
                      />
                      <button
                        onClick={() => handleRemoveSubtask(subtask.id)}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={handleAddSubtask}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full"
                  >
                    <span className="text-lg">+</span>
                    <span>Add another subtask</span>
                  </button>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Attachments
                </h3>

                {/* Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 font-medium">
                        Upload a file or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, PDF or DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                          <Paperclip className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!taskTitle.trim()}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Save task
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
