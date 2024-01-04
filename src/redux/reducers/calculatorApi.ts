import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { CalculatorRequest, CalculatorResponse } from '@/redux/types'
import { baseQuery } from '@/redux/interfaces/baseQueryWithAuthorizationHeader'

export const calculatorApi = createApi({
    reducerPath: 'calculatorApi',
    tagTypes: ['Calculator'],
    baseQuery,
    endpoints: builder => ({
        getCalculatorValues: builder.query<CalculatorResponse, CalculatorRequest>({
            query: (request) => ({
                url: 'calculator/delivery-price',
                method: 'POST',
                body: request,
            }),
            providesTags: () => [{type: 'Calculator', id: 'VALUE'}],
        }),
    }),
})

export const {
    useLazyGetCalculatorValuesQuery
} = calculatorApi

export default calculatorApi.reducer