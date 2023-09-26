import { SALARY_URL  } from '../constants';
import { apiSlice } from './apiSlice';

export const salarysApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSalarys: builder.query({
            query: ({keyword, pageNumber}) => ({
                url: SALARY_URL,
                params: {
                    keyword,
                    pageNumber,
                },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Salarys'],
        }),
        getSalaryDetails: builder.query({
            query: (salaryId) => ({
                url: `${SALARY_URL}/${salaryId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        deleteSalary: builder.mutation({
            query: (salaryId) => ({
                url: `${SALARY_URL}/${salaryId}`,
                method: 'DELETE',
            }),
        }),
        createSalary: builder.mutation({
            query: () => ({
                url: `${SALARY_URL}`,
                method: 'POST',
            }),
            keepUnusedDataFor: 5,
            invalidatesTags: ['Salary'],
        }),
        updateSalary: builder.mutation({
            query: (data) => ({
                url: `${SALARY_URL}/${data.salaryId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Salarys'],
        }),
    }),
});

export const {
    useGetSalarysQuery,
    useGetSalaryDetailsQuery,
    useDeleteSalaryMutation,
    useUpdateSalaryMutation,
    useCreateSalaryMutation
} = salarysApiSlice;