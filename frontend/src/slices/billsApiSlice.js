import { BILL_URL  } from '../constants';
import { apiSlice } from './apiSlice';

export const billsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBills: builder.query({
            query: ({keyword, pageNumber}) => ({
                url: BILL_URL,
                params: {
                    keyword,
                    pageNumber,
                },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Bills'],
        }),
        getBillDetails: builder.query({
            query: (billId) => ({
                url: `${BILL_URL}/${billId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        deleteBill: builder.mutation({
            query: (billId) => ({
                url: `${BILL_URL}/${billId}`,
                method: 'DELETE',
            }),
        }),
        createBill: builder.mutation({
            query: () => ({
                url: `${BILL_URL}`,
                method: 'POST',
            }),
            keepUnusedDataFor: 5,
            invalidatesTags: ['Bill'],
        }),
        updateBill: builder.mutation({
            query: (data) => ({
                url: `${BILL_URL}/${data.billId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Bills'],
        }),
    }),
});

export const {
    useGetBillsQuery,
    useGetBillDetailsQuery,
    useDeleteBillMutation,
    useUpdateBillMutation,
    useCreateBillMutation
} = billsApiSlice;