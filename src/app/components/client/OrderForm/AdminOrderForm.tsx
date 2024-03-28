import React from 'react'
import ReadOnlyOrderForm from '@/app/components/client/OrderForm/ReadOnlyOrderForm'
import { OrderData } from '@/types'
import { useTranslation } from '@/app/i18n'

type Props = {
    order: OrderData
    language: string
}

export default async function AdminOrderForm({order, language}: Readonly<Props>) {
    const {t} = await useTranslation(language, 'order')
    return (
        <div className={'flex flex-col p-5 gap-y-5 md:gap-y-[8rem]'}>
            <h2 className={'text-2xl md:hidden'}>{t('add_order')}</h2>
            <ReadOnlyOrderForm data={{
                ...order,
                goods: order.goods.map(good => ({
                    ...good,
                    price: {
                        value: good.price,
                        currency: good.currency,
                    },
                })),
            }} language={language}/>
        </div>
    )
}