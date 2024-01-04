import React from 'react'
import { getCountries } from '@/services/countries'
import { OrderData } from '@/redux/reducers/ordersApi'
import Link from 'next/link'

type Props = {
    order: OrderData
}

export default async function OrderCard({order}: Props) {
    const countries = await getCountries()

    const amountOfSticks = order.status === 'CREATED' ? 1 :
        order.status === 'DELIVERED_TO_WAREHOUSE' ? 2 :
            order.status === 'IN_THE_WAY' ? 3 :
                order.status === 'IN_YOUR_COUNTRY' ? 4 :
                    order.status === 'IN_MAIL_OFFICE' ? 5 :
                        order.status === 'DELIVERED' ? 6 : 0

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
            <h2 className={'text-xl'}>{order.trackingNumber}</h2>
            <p className={'text-base'}>Статус заказа: {statusNames[order.status]}</p>
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
            <p className={'text-base'}>Наименование: {order.name}</p>
            <p className={'text-base'}>Описание/вид товара: {order.description}</p>
            <p className={'text-base'}>ID заказа: {order.customOrderId}</p>
            <p className={'text-base'}>Страна: {countries.find(country => country.id === order.countryId)?.name}</p>
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
    )
}