import React from 'react'
import AdminOrderForm from '@/app/components/client/OrderForm/AdminOrderForm'
import { getOrder } from '@/services/orders'
import Link from 'next/link'
import Image from 'next/image'
import { isError } from '@/app/lib/utils'

type Props = {
    params: {
        orderId: string
        language: string
    }
}

export const dynamic = 'force-dynamic'

export default async function Page({params: {orderId, language}}: Readonly<Props>) {
    const orderResponse = await getOrder(orderId)
    if (isError(orderResponse)) {
        return <div>Order not found</div>
    }
    const order = orderResponse.data

    return (
        <div className={'md:p-20'}>
            <div className={'hidden md:flex md:flex-row md:align-center md:gap-x-4 mb-10'}>
                <Link href={'.'} className={'flex justify-center'}>
                    <Image src={'/assets/back_arrow.svg'} alt={'back_arrow.svg'} width={24} height={24}/>
                </Link>
                <p className={'md:text-4xl md:font-bold'}>
                    {order.orderNumber}
                </p>
            </div>
            <AdminOrderForm order={order} language={language}/>
        </div>
    )
}