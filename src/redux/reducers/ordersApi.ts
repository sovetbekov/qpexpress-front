import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseQuery } from '@/redux/interfaces/baseQueryWithAuthorizationHeader'

type CreateOrderData = {
    userId: string,
    trackingNumber: string,
    linkOrders: string,
    name: string,
    description: string,
    price: number,
    currencyId: string,
    invoice: string,
    countryId: string,
    weight: number,
    withBox: boolean,
}

enum OrderStatus {
    CREATED = 'CREATED',
    DELIVERED_TO_WAREHOUSE = 'DELIVERED_TO_WAREHOUSE',
    IN_THE_WAY = 'IN_THE_WAY',
    IN_YOUR_COUNTRY = 'IN_YOUR_COUNTRY',
    IN_MAIL_OFFICE = 'IN_MAIL_OFFICE',
    DELIVERED = 'DELIVERED',
    DELETED = 'DELETED'
}

export type OrderData = {
    id: string
    customOrderId: string
    trackingNumber: string
    productType: string
    name: string,
    description: string,
    price: number
    commission: number
    invoiceId: string
    weight: number
    countryId: string
    deliveryPrice: number
    kazPostTrackNumber: string
    kazPostInvoice: string
    userId: string
    status: OrderStatus
}

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    tagTypes: ['Orders'],
    baseQuery,
    endpoints: builder => ({
        createOrder: builder.mutation<OrderData, CreateOrderData>({
            query: (body) => ({
                url: 'orders',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'Orders', id: 'LIST'}],
        }),
        getMyOrders: builder.query<OrderData[], void>({
            query: () => 'orders',
            providesTags: (result) => result?.map(({id}) => ({type: 'Orders', id})) ?? [{type: 'Orders', id: 'LIST'}],
        }),
    }),
})

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
} = ordersApi

export default ordersApi.reducer