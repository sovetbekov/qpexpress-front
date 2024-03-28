'use client'

import React, { useEffect, useState } from 'react'
import { getDelivery } from '@/services/deliveries'
import Image from 'next/image'
import Link from 'next/link'
import AdminDeliveryForm from '@/app/components/client/DeliveryForm/AdminDeliveryForm'
import DeliveryStatusInput from '@/app/[language]/admin/deliveries/[deliveryId]/DeliveryStatusInput'
import { isError } from '@/app/lib/utils'
import { DeliveryData } from '@/types'

export const dynamic = 'force-dynamic'

type Props = {
    params: {
        deliveryId: string
        language: string
    }
}

export default function Page({params: {language, deliveryId}}: Readonly<Props>) {
    const [delivery, setDelivery] = useState<DeliveryData>()
    useEffect(() => {
        getDelivery(deliveryId).then(response => {
            if (!isError(response)) {
                setDelivery(response.data)
            }
        })
    }, [deliveryId])

    if (!delivery) {
        return <div>Loading...</div>
    }

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
                <DeliveryStatusInput delivery={delivery} setDelivery={setDelivery} selected={delivery.status} language={language}/>
            </div>
            <AdminDeliveryForm isUpdate={true} language={language} data={delivery}/>
        </div>
    )
}