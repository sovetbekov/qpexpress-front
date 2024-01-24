import React from 'react'
import { getOrders } from '@/services/orders'
import Protected from '@/app/components/server/Protected'

type Props = {
    children: React.ReactNode
}

export default async function Layout({children}: Readonly<Props>) {

    return (
        <Protected roles={['orders:read']}>
            {
                children
            }
        </Protected>
    )
}