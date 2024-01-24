import React from 'react'
import ReadOnlyDeliveryForm from '@/app/components/client/DeliveryForm/ReadOnlyDeliveryForm'
import { getDelivery } from '@/services/deliveries'
import { isError } from '@/app/lib/utils'

export const dynamic = 'force-dynamic'

type Props = {
    params: {
        deliveryId: string
        language: string
    }
}

export default async function UserDeliveryForm({params: {deliveryId, language}}: Readonly<Props>) {
    const deliveryResponse = await getDelivery(deliveryId)
    if (isError(deliveryResponse)) {
        return <div>Delivery not found</div>
    }
    const delivery = deliveryResponse.data
    return (
        <div className={'flex flex-col p-5 gap-y-5 md:gap-y-[8rem]'}>
            <h2 className={'text-2xl md:hidden'}>Добавить заказ</h2>
            <ReadOnlyDeliveryForm data={delivery} language={language}/>
        </div>
    )
}