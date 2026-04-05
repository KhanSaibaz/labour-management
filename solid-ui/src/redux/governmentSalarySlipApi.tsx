import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "@solidxai/core-ui";


export const governmentSalarySlipApi = createApi({
    reducerPath: "governmentSalarySlipApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["GovernmentSalarySlip"],

    endpoints: (builder) => ({

        generateSalarySlips: builder.mutation({
            query: ({ month, year }) => ({
                url: `/government-salary-slip/generate-slips`,
                method: "POST",
                body: {
                    month,
                    year
                }
            }),

            invalidatesTags: ["GovernmentSalarySlip"],
        }),

    }),
});

export const {
    useGenerateSalarySlipsMutation
} = governmentSalarySlipApi;