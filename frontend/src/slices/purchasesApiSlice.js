import { PURCHASE_URL  } from '../constants';
import { apiSlice } from './apiSlice';

export const purchasesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPurchases: builder.query({
            query: ({keyword, pageNumber}) => ({
                url: PURCHASE_URL,
                params: {
                    keyword,
                    pageNumber,
                },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Purchases'],
        }),
        getPurchaseDetails: builder.query({
            query: (purchaseId) => ({
                url: `${PURCHASE_URL}/${purchaseId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        deletePurchase: builder.mutation({
            query: (purchaseId) => ({
                url: `${PURCHASE_URL}/${purchaseId}`,
                method: 'DELETE',
            }),
        }),
        createPurchase: builder.mutation({
            query: () => ({
                url: `${PURCHASE_URL}`,
                method: 'POST',
            }),
            keepUnusedDataFor: 5,
            invalidatesTags: ['Purchase'],
        }),
        updatePurchase: builder.mutation({
            query: (data) => ({
                url: `${PURCHASE_URL}/${data.purchaseId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Purchases'],
        }),
    }),
});

export const {
    useGetPurchasesQuery,
    useGetPurchaseDetailsQuery,
    useDeletePurchaseMutation,
    useUpdatePurchaseMutation,
    useCreatePurchaseMutation
} = purchasesApiSlice;