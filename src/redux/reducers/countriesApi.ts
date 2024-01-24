import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseQuery } from '@/redux/interfaces/baseQueryWithAuthorizationHeader'
import { CountryData } from '@/types'

export const countriesApi = createApi({
    reducerPath: 'countriesApi',
    tagTypes: ['Country'],
    baseQuery,
    endpoints: builder => ({
        getCountries: builder.query<CountryData[], void>({
            query: () => 'countries',
            providesTags: (result) => result?.map(({id}) => ({type: 'Country', id})) ?? [{type: 'Country', id: 'LIST'}],
        }),
    }),
})

export const {
    useGetCountriesQuery,
} = countriesApi

export default countriesApi.reducer