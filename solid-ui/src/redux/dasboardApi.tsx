import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "@solidxai/core-ui";

export interface DashboardData {
  stats: any[];
  attendanceData: any;
  donutData: any;
  salaryData: any;
  advancePayments: any[];
  inventory: any[];
  recentLabours: any[];
  lastRefreshed: string;
}

export const DashBoardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardData, void>({
      query: () => ({
        url: "/dashboard/get-record",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = DashBoardApi;