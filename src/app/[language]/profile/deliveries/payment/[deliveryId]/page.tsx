import React from 'react'
import PageWrapper from '../../../PageWrapper'
import DeliveryDetailsForm from './DeliveryDetailsForm'
import PageComponent from './PageComponent'
import { getMyDelivery } from '@/services/deliveries'
import { isError } from '@/app/lib/utils'

type Props = {
    params: {
        deliveryId: string
    }
}

export const dynamic = 'force-dynamic'

export default async function Page({params: {deliveryId}}: Readonly<Props>) {
    const deliveryResponse = await getMyDelivery(deliveryId)
    if (isError(deliveryResponse)) {
        return <div>Ошибка</div>
    }
    const delivery = deliveryResponse.data

    return (
        <PageWrapper>
            <div className={'md:p-20'}>
                <PageComponent/>
                <DeliveryDetailsForm delivery={delivery}/>
            </div>
        </PageWrapper>
    )
}