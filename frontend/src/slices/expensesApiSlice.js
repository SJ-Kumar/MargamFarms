import { EXPENSE_URL  } from '../constants';
import { apiSlice } from './apiSlice';

export const expensesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getExpenses: builder.query({
            query: ({keyword, pageNumber}) => ({
                url: EXPENSE_URL,
                params: {
                    keyword,
                    pageNumber,
                },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Expenses'],
        }),
        getExpenseDetails: builder.query({
            query: (expenseId) => ({
                url: `${EXPENSE_URL}/${expenseId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        deleteExpense: builder.mutation({
            query: (expenseId) => ({
                url: `${EXPENSE_URL}/${expenseId}`,
                method: 'DELETE',
            }),
        }),
        createExpense: builder.mutation({
            query: () => ({
                url: `${EXPENSE_URL}`,
                method: 'POST',
            }),
            keepUnusedDataFor: 5,
            invalidatesTags: ['Expense'],
        }),
        updateExpense: builder.mutation({
            query: (data) => ({
                url: `${EXPENSE_URL}/${data.expenseId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Expenses'],
        }),
    }),
});

export const {
    useGetExpensesQuery,
    useGetExpenseDetailsQuery,
    useDeleteExpenseMutation,
    useUpdateExpenseMutation,
    useCreateExpenseMutation
} = expensesApiSlice;