import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    getAllUsers: builder.query({
      query: () => "/auth/users",
      providesTags: ["Users"],
    }),
    getUserById: builder.query({
      query: (id) => `/auth/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    getCurrentUser: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => {
        // Check if there's a file (profileImage) that needs to be uploaded
        const hasFile = userData.profileImage instanceof File;

        if (hasFile) {
          // Use FormData for file uploads
          const formData = new FormData();

          Object.keys(userData).forEach((key) => {
            if (userData[key] !== undefined && userData[key] !== null) {
              // Append file directly for file fields
              if (userData[key] instanceof File) {
                formData.append(key, userData[key], userData[key].name);
              } else {
                // Only append non-empty string values
                if (userData[key] !== "") {
                  formData.append(key, userData[key]);
                }
              }
            }
          });

          return {
            url: `/auth/users/${id}`,
            method: "PUT",
            body: formData,
          };
        } else {
          // Use regular JSON for text-only updates
          return {
            url: `/auth/users/${id}`,
            method: "PUT",
            body: userData,
          };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        "User",
        "Users",
        { type: "Users", id },
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = authApi;
