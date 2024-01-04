import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { AddressData } from '@/redux/types'
import { baseQuery } from '@/redux/interfaces/baseQueryWithAuthorizationHeader'

export const addressesApi = createApi({
    reducerPath: 'addressesApi',
    tagTypes: ['Address'],
    baseQuery,
    endpoints: builder => ({
        getAddresses: builder.query<AddressData[], void>({
            query: () => 'addresses',
            providesTags: (result) => result?.map(({id}) => ({type: 'Address', id})) ?? [{type: 'Address', id: 'LIST'}],
        }),
    }),
})

export const {
    useGetAddressesQuery
} = addressesApi

export default addressesApi.reducer