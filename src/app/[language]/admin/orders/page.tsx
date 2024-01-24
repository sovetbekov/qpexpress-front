import React from 'react'
import { getOrders } from '@/services/orders'
import OrdersTable from '@/app/[language]/admin/orders/OrdersTable'
import { isError } from '@/app/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const ordersResponse = await getOrders()
    if (isError(ordersResponse)) {
        return <div>Ошибка</div>
    }
    const orders = ordersResponse.data
    return (
        <>
            <OrdersTable orders={orders}/>
        </>
    )
}