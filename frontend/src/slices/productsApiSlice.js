import { PRODUCTS_URL, UPLOADS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({keyword, pageNumber}) => ({
                url: PRODUCTS_URL,
                params: {
                    keyword,
                    pageNumber,
                },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Products'],
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createReview: builder.mutation({
            query: (data) => ({
              url: `${PRODUCTS_URL}/${data.productId}/reviews`,
              method: 'POST',
              body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        getTopProducts: builder.query({
            query: () => `${PRODUCTS_URL}/top`,
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: `${PRODUCTS_URL}`,
                method: 'POST',
            }),
            keepUnusedDataFor: 5,
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOADS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }),
        })
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateReviewMutation,
    useGetTopProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
} = productsApiSlice;