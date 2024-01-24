import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseQuery } from '@/redux/interfaces/baseQueryWithAuthorizationHeader'
import { CurrencyData } from '@/types'

export const currenciesApi = createApi({
    reducerPath: 'currenciesApi',
    tagTypes: ['Currency'],
    baseQuery,
    endpoints: builder => ({
        getCurrencies: builder.query<CurrencyData[], void>({
            query: () => 'currencies',
            providesTags: (result) => result?.map(({id}) => ({type: 'Currency', id})) ?? [{type: 'Currency', id: 'LIST'}],
        }),
    }),
})

export const {
    useGetCurrenciesQuery,
} = currenciesApi

export default currenciesApi.reducer