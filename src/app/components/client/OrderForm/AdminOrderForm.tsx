import React from 'react'
import ReadOnlyOrderForm from '@/app/components/client/OrderForm/ReadOnlyOrderForm'
import { OrderData } from '@/types'

type Props = {
    order: OrderData
}

export default async function AdminOrderForm({order}: Readonly<Props>) {
    return (
        <div className={'flex flex-col p-5 gap-y-5 md:gap-y-[8rem]'}>
            <h2 className={'text-2xl md:hidden'}>Добавить заказ</h2>
            <ReadOnlyOrderForm data={{
                ...order,
                goods: order.goods.map(good => ({
                    ...good,
                    price: {
                        value: good.price,
                        currency: good.currency,
                    },
                })),
            }}/>
        </div>
    )
}