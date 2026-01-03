import { api } from "./api";

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (taskData) => ({
        url: "/tasks",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Tasks"],
    }),
    getAllTasks: builder.query({
      query: () => "/tasks",
      providesTags: ["Tasks"],
    }),
    getTaskById: builder.query({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: "Tasks", id }],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...taskData }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: taskData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Tasks",
        { type: "Tasks", id },
      ],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    // Subtasks endpoints
    createSubtask: builder.mutation({
      query: (subtaskData) => ({
        url: "/subtasks",
        method: "POST",
        body: subtaskData,
      }),
      invalidatesTags: ["Tasks"],
    }),
    getSubtasksByTaskId: builder.query({
      query: (taskId) => `/subtasks/task/${taskId}`,
      providesTags: (result, error, taskId) => [{ type: "Tasks", id: taskId }],
    }),
    updateSubtask: builder.mutation({
      query: ({ id, ...subtaskData }) => ({
        url: `/subtasks/${id}`,
        method: "PUT",
        body: subtaskData,
      }),
      invalidatesTags: (result, error, { parentTaskId }) =>
        parentTaskId
          ? ["Tasks", { type: "Tasks", id: parentTaskId }]
          : ["Tasks"],
    }),
    deleteSubtask: builder.mutation({
      query: (id) => ({
        url: `/subtasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCreateSubtaskMutation,
  useGetSubtasksByTaskIdQuery,
  useLazyGetSubtasksByTaskIdQuery,
  useUpdateSubtaskMutation,
  useDeleteSubtaskMutation,
} = tasksApi;
