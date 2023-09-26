import { TRANSPORT_URL  } from '../constants';
import { apiSlice } from './apiSlice';

export const transportsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTransports: builder.query({
            query: ({keyword, pageNumber}) => ({
                url: TRANSPORT_URL,
                params: {
                    keyword,
                    pageNumber,
                },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Transports'],
        }),
        getTransportDetails: builder.query({
            query: (transportId) => ({
                url: `${TRANSPORT_URL}/${transportId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        deleteTransport: builder.mutation({
            query: (transportId) => ({
                url: `${TRANSPORT_URL}/${transportId}`,
                method: 'DELETE',
            }),
        }),
        createTransport: builder.mutation({
            query: () => ({
                url: `${TRANSPORT_URL}`,
                method: 'POST',
            }),
            keepUnusedDataFor: 5,
            invalidatesTags: ['Transport'],
        }),
        updateTransport: builder.mutation({
            query: (data) => ({
                url: `${TRANSPORT_URL}/${data.transportId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Transports'],
        }),
    }),
});

export const {
    useGetTransportsQuery,
    useGetTransportDetailsQuery,
    useDeleteTransportMutation,
    useUpdateTransportMutation,
    useCreateTransportMutation
} = transportsApiSlice;