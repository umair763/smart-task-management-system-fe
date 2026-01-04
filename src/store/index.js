// Export store and persistor
export { store, persistor } from "./store";

// Export auth slice actions
export { setUser, updateUserData, logout } from "./auth.slice";

// Export UI slice actions
export { toggleSidebar, setSidebarOpen } from "./ui.slice";

// Export all auth API hooks
export {
  useLoginMutation,
  useRegisterMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "./auth.api";

// Export all tasks API hooks
export {
  useCreateTaskMutation,
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "./tasks.api";

// Export analytics API hooks
export {
  useGetAnalyticsSummaryQuery,
  useGetAnalyticsActiveRateQuery,
  useGetAnalyticsOverdueQuery,
  useGetAnalyticsTimeseriesQuery,
  useGetAnalyticsDistributionQuery,
  useGetTopSubtasksQuery,
} from "./analytics.api";
