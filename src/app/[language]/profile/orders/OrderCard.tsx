import React from 'react'
import Link from 'next/link'
import { OrderData } from '@/types'
import { useTranslation } from '@/app/i18n'

type Props = {
    order: OrderData
    language: string
}

function getAmountOfStick(status: string) {
    switch (status) {
        case 'CREATED':
            return 1
        case 'DELIVERED_TO_WAREHOUSE':
            return 2
        case 'IN_THE_WAY':
            return 3
        case 'IN_YOUR_COUNTRY':
            return 4
        case 'IN_MAIL_OFFICE':
            return 5
        case 'DELIVERED':
            return 6
        default:
            return 0
    }
}

export const dynamic = 'force-dynamic'

export default async function OrderCard({order, language}: Readonly<Props>) {
    const {t} = await useTranslation(language, 'order')
    const amountOfSticks = getAmountOfStick(order.status)

    const statusNames: { [key: string]: string } = {
        CREATED: t('created'),
        DELIVERED_TO_WAREHOUSE: t('delivered_to_warehouse'),
        IN_THE_WAY: t('in_the_way'),
        IN_YOUR_COUNTRY: t('in_your_country'),
        IN_MAIL_OFFICE: t('in_mail_office'),
        DELIVERED: t('delivered')
    }

    return (
        <Link href={`/profile/orders/${order.id}`}>
            <div className={'bg-gray rounded-3xl p-5 md:p-8'}>
                <h2 className={'text-xl'}>{order.orderNumber}</h2>
                <p className={'text-base'}>{t('order_status')}: {statusNames[order.status]}</p>
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
                    order.status === 'DELIVERED_TO_WAREHOUSE' &&
                    <Link href={`/profile/orders/payment/${order.id}`}>
                        <button className={'bg-blue mt-5 rounded-full w-full md:px-12 py-3 text-white md:mt-5'}>
                            Данные о товаре
                        </button>
                    </Link>
                }
                {
                    order.status !== 'CREATED' && order.status !== 'DELIVERED_TO_WAREHOUSE' &&
                    <button className={'bg-blue mt-5 rounded-full w-full md:px-12 py-3 text-white md:mt-5'}>
                        Отследить посылку
                    </button>
                }
            </div>
        </Link>
    )
}