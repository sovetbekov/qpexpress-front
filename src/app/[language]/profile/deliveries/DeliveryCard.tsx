import React from 'react'
import { getCountries } from '@/services/countries'
import Link from 'next/link'
import { DeliveryStatus } from '@/types/utils'
import { DeliveryData } from '@/types/entities'

type Props = {
    delivery: DeliveryData
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

export default async function DeliveryCard({delivery}: Readonly<Props>) {
    const countries = await getCountries()

    const amountOfSticks = getAmountOfStick(delivery.status)

    const statusNames: { [key: string]: string } = {
        CREATED: 'Создан',
        DELIVERED_TO_WAREHOUSE: 'Доставлен на склад',
        IN_THE_WAY: 'В пути',
        IN_YOUR_COUNTRY: 'В вашей стране',
        IN_MAIL_OFFICE: 'В почтовом отделении',
        DELIVERED: 'Доставлен',
    }

    return (
        <div className={'bg-gray rounded-3xl p-5 md:p-8'}>
            <h2 className={'text-xl'}>{delivery.deliveryNumber}</h2>
            <p className={'text-base'}>Статус заказа: {statusNames[delivery.status]}</p>
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
                delivery.status === 'IN_THE_WAY' &&
                <Link href={`/profile/deliveries/payment/${delivery.id}`}>
                    <button className={'bg-blue mt-5 rounded-full w-full md:px-12 py-3 text-white md:mt-5'}>
                        Оплатить
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