import { OILCAKE_URL  } from '../constants';
import { apiSlice } from './apiSlice';

export const oilcakesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOilcakes: builder.query({
            query: ({keyword, pageNumber}) => ({
                url: OILCAKE_URL,
                params: {
                    keyword,
                    pageNumber,
                },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Oilcakes'],
        }),
        getOilcakeDetails: builder.query({
            query: (oilcakeId) => ({
                url: `${OILCAKE_URL}/${oilcakeId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        deleteOilcake: builder.mutation({
            query: (oilcakeId) => ({
                url: `${OILCAKE_URL}/${oilcakeId}`,
                method: 'DELETE',
            }),
        }),
        createOilcake: builder.mutation({
            query: () => ({
                url: `${OILCAKE_URL}`,
                method: 'POST',
            }),
            keepUnusedDataFor: 5,
            invalidatesTags: ['Oilcake'],
        }),
        updateOilcake: builder.mutation({
            query: (data) => ({
                url: `${OILCAKE_URL}/${data.oilcakeId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Oilcakes'],
        }),
    }),
});

export const {
    useGetOilcakesQuery,
    useGetOilcakeDetailsQuery,
    useDeleteOilcakeMutation,
    useUpdateOilcakeMutation,
    useCreateOilcakeMutation
} = oilcakesApiSlice;