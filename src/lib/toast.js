// Simple toast notifications utility
class ToastManager {
  static show(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    // Main container
    toast.className = `
      fixed top-6 right-6 z-50 flex items-center min-w-[260px] max-w-xs px-4 py-3 rounded-lg shadow-lg
      bg-white text-gray-900 font-medium border-l-4
      ${
        type === "success"
          ? "border-l-[#22c55e]" // green
          : type === "error"
          ? "border-l-[#ef4444]" // red
          : type === "warning"
          ? "border-l-[#facc15]" // yellow
          : "border-l-[#3b82f6]"
      } // blue
    `.replace(/\s+/g, " ");

    // Icon
    const icon = document.createElement("span");
    icon.className = "mr-3 flex-shrink-0";
    icon.innerHTML =
      type === "success"
        ? `<svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="10" fill="#22c55e"/><path d="M6 10l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : type === "error"
        ? `<svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="10" fill="#ef4444"/><path d="M10 6v4m0 4h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : type === "warning"
        ? `<svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="10" fill="#facc15"/><path d="M10 7v3m0 3h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : `<svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="10" fill="#3b82f6"/><path d="M10 7v3m0 3h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    // Message
    const msg = document.createElement("span");
    msg.textContent = message;

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "&times;";
    closeBtn.className =
      "ml-auto text-gray-400 hover:text-gray-700 text-lg font-bold focus:outline-none";
    closeBtn.onclick = () => {
      toast.classList.add("opacity-0");
      setTimeout(() => {
        if (document.body.contains(toast)) document.body.removeChild(toast);
      }, 300);
    };

    toast.appendChild(icon);
    toast.appendChild(msg);
    toast.appendChild(closeBtn);

    toast.style.transition = "opacity 0.3s, transform 0.3s";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    }, 100);

    // Remove toast after duration
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(40px)";
      setTimeout(() => {
        if (document.body.contains(toast)) document.body.removeChild(toast);
      }, 300);
    }, duration);
  }

  static success(message, duration) {
    this.show(message, "success", duration);
  }
  static error(message, duration) {
    this.show(message, "error", duration);
  }
  static warning(message, duration) {
    this.show(message, "warning", duration);
  }
  static info(message, duration) {
    this.show(message, "info", duration);
  }
}

export default ToastManager;
