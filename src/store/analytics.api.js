import { api } from "./api";

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsSummary: builder.query({
      query: () => "/analytics/summary",
      providesTags: ["Analytics"],
    }),
    getAnalyticsActiveRate: builder.query({
      query: () => "/analytics/active-rate",
      providesTags: ["Analytics"],
    }),
    getAnalyticsOverdue: builder.query({
      query: () => "/analytics/overdue",
      providesTags: ["Analytics"],
    }),
    getAnalyticsTimeseries: builder.query({
      query: (range) => `/analytics/timeseries?range=${range}`,
      providesTags: ["Analytics"],
    }),
    getAnalyticsDistribution: builder.query({
      query: (range) =>
        range
          ? `/analytics/distribution?range=${range}`
          : "/analytics/distribution",
      providesTags: ["Analytics"],
    }),
    getTopSubtasks: builder.query({
      query: (range) =>
        range
          ? `/analytics/top-subtasks?range=${range}`
          : "/analytics/top-subtasks",
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetAnalyticsSummaryQuery,
  useGetAnalyticsActiveRateQuery,
  useGetAnalyticsOverdueQuery,
  useGetAnalyticsTimeseriesQuery,
  useGetAnalyticsDistributionQuery,
  useGetTopSubtasksQuery,
} = analyticsApi;
