'use client'

import { useAppDispatch } from '@/hooks/client/redux'
import React, { useEffect, useState } from 'react'
import { openModal } from '@/redux/reducers/modalSlice'
import { useTranslation } from '@/app/i18n/client'
import { CurrencyData } from '@/types'
import { convertCurrency } from '@/services/currencies'
import _ from 'lodash'

type Props = {
    price: number
    currency: CurrencyData
    deliveryId: string
    language: string
}

export default function PaymentButton({price, currency, deliveryId, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'delivery')
    const dispatch = useAppDispatch()
    const [priceKZT, setPriceKZT] = useState<number>()
    useEffect(() => {
        convertCurrency(price, currency.id, 'kzt').then(response => {
            if (response.status === 'error') {
                console.error(response.error)
            } else {
                setPriceKZT(_.round(response.data))
            }
        })
    }, [currency.id, price])
    if (!priceKZT) {
        return (
            <button className={'w-full bg-gray-2 rounded-full p-3 text-white'} disabled>
                {t('pay')}
            </button>
        )
    }

    return (
        <button className={'w-full bg-blue rounded-full p-3 text-white'}
                onClick={() => dispatch(openModal({modalType: 'paymentMethod', data: {price: priceKZT, deliveryId}}))}>
            {t('pay')}
        </button>
    )
}