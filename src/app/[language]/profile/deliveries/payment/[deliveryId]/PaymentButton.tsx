'use client'

import { useAppDispatch } from '@/hooks/client/redux'
import React from 'react'
import { openModal } from '@/redux/reducers/modalSlice'
import { useTranslation } from '@/app/i18n/client'

type Props = {
    price: number
    deliveryId: string
    language: string
}

export default function PaymentButton({price, deliveryId, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'delivery')
    const dispatch = useAppDispatch()
    return (
        <button className={'w-full bg-blue rounded-full p-3 text-white'} onClick={() => dispatch(openModal({modalType: 'paymentMethod', data: {price, deliveryId}}))}>
            {t('pay')}
        </button>
    )
}