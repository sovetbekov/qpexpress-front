import React from 'react'
import { getDelivery } from '@/services/deliveries'
import Image from 'next/image'
import Link from 'next/link'
import AdminDeliveryForm from '@/app/components/client/DeliveryForm/AdminDeliveryForm'
import DeliveryStatusInput from '@/app/[language]/admin/deliveries/[deliveryId]/DeliveryStatusInput'
import { isError } from '@/app/lib/utils'

export const dynamic = 'force-dynamic'

type Props = {
    params: {
        deliveryId: string
        language: string
    }
}

export default async function Page({params: {language, deliveryId}}: Readonly<Props>) {
    const deliveryResponse = await getDelivery(deliveryId)
    if (isError(deliveryResponse)) {
        return <div>Ошибка</div>
    }
    const delivery = deliveryResponse.data

    return (
        <div className={'md:p-20'}>
            <div className={'hidden md:flex md:flex-row md:align-center md:justify-between mb-10'}>
                <div className={'md:flex md:flex-row md:align-center md:gap-x-4'}>
                    <Link href={'.'} className={'flex justify-center'}>
                        <Image src={'/assets/back_arrow.svg'} alt={'back_arrow.svg'} width={24} height={24}/>
                    </Link>
                    <p className={'md:text-4xl md:font-bold'}>
                        {delivery.deliveryNumber}
                    </p>
                </div>
                <DeliveryStatusInput selected={delivery.status} language={language}/>
            </div>
            <AdminDeliveryForm isUpdate={true} language={language} data={delivery}/>
        </div>
    )
}