import React from 'react'
import PageWrapper from '../../../PageWrapper'
import { getOrderData } from '@/services/orders'
import OrderDetailsForm from './OrderDetailsForm'
import PageClient from './PageClient'

type Props = {
    params: {
        orderId: string
    }
}

export default async function Page({params: {orderId}}: Props) {
    const orderData = await getOrderData(orderId)
    return (
        <PageWrapper>
            <div className={'md:p-20'}>
                <PageClient/>
                <OrderDetailsForm orderData={orderData}/>
            </div>
        </PageWrapper>
    )
}