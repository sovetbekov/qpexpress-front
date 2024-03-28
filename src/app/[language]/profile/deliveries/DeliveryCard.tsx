'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { DeliveryStatus } from '@/types/utils'
import { DeliveryData } from '@/types/entities'
import { getPaymentStatus } from '@/services/payment'
import { useTranslation } from '@/app/i18n/client'

type Props = {
    delivery: DeliveryData
    language: string
}

function getAmountOfStick(status: DeliveryStatus) {
    switch (status) {
        case 'CREATED':
            return 1
        case 'IN_THE_WAY':
            return 2
        case 'IN_YOUR_COUNTRY':
            return 3
        case 'IN_MAIL_OFFICE':
            return 4
        case 'DELIVERED':
            return 5
        default:
            return 0
    }
}

export const dynamic = 'force-dynamic'

export default function DeliveryCard({delivery, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'delivery')
    const amountOfSticks = getAmountOfStick(delivery.status)

    const statusNames: { [key: string]: string } = {
        CREATED: t('created'),
        DELIVERED_TO_WAREHOUSE: t('delivered_to_warehouse'),
        IN_THE_WAY: t('in_the_way'),
        IN_YOUR_COUNTRY: t('in_your_country'),
        IN_MAIL_OFFICE: t('in_mail_office'),
        DELIVERED: t('delivered')
    }
    
    const [isPaidLoading, setIsPaidLoading] = useState(true)
    const [isPaid, setIsPaid] = useState(false)
    
    useEffect(() => {
        async function fetchStatus() {
            const paymentStatus = await getPaymentStatus({deliveryId: delivery.id})
            if (paymentStatus.status === 'error') {
                console.error(paymentStatus.error)
                return
            }
            if (paymentStatus.data === 'Processed') {
                setIsPaid(true)
            }
            setIsPaidLoading(false)
        }
        fetchStatus().catch(console.error)
    }, [delivery.id])

    return (
        <div className={'bg-gray rounded-3xl p-5 md:p-8'}>
            <h2 className={'text-xl'}>{delivery.deliveryNumber}</h2>
            <p className={'text-base'}>{t('delivery_status')}: {statusNames[delivery.status]}</p>
            <div className={'flex flex-row gap-2 md:gap-5 mt-2 mb-2'}>
                {
                    Array.from({length: amountOfSticks}).map((_, index) => {
                        return (
                            <div key={index} className={'w-1/6 h-1.5 md:h-2 bg-blue rounded-full'}/>
                        )
                    })
                }
                {
                    Array.from({length: 6 - amountOfSticks}).map((_, index) => {
                        return (
                            <div key={index} className={'w-1/6 h-1.5 md:h-2 bg-dark-gray rounded-full'}/>
                        )
                    })
                }
            </div>
            {
                delivery.status === 'IN_THE_WAY' && !isPaidLoading && !isPaid &&
                <Link href={`/profile/deliveries/payment/${delivery.id}`}>
                    <button className={'bg-blue mt-5 rounded-full w-full md:px-12 py-3 text-white md:mt-5'}>
                        {t('pay')}
                    </button>
                </Link>
            }
            {
                delivery.status === 'IN_YOUR_COUNTRY' &&
                <button className={'bg-blue mt-5 rounded-full w-full md:px-12 py-3 text-white md:mt-5'}>
                    Отследить посылку
                </button>
            }
        </div>
    )
}