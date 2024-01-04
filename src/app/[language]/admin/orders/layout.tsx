import React from 'react'
import { getOrders } from '@/services/orders'
import Protected from '@/app/components/server/Protected'

export default async function Layout() {
    const orders = await getOrders()
    return (
        <Protected roles={['orders:read']}>
            {
                orders.map(order => (
                    <div key={order.id}>
                        {order.name}
                    </div>
                ))
            }
        </Protected>
    )
}