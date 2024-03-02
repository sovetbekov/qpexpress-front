'use client'

import { useAppDispatch } from '@/hooks/client/redux'
import React from 'react'
import { openModal } from '@/redux/reducers/modalSlice'

type Props = {
    price: number
}

export default function PaymentButton({price}: Readonly<Props>) {
    const dispatch = useAppDispatch()
    return (
        <button className={'w-full bg-blue rounded-full p-3 text-white'} onClick={() => dispatch(openModal({modalType: 'paymentMethod', data: {price}}))}>
            Оплатить
        </button>
    )
}