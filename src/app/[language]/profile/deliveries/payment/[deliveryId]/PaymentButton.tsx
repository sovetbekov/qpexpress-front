'use client'

import { useAppDispatch } from '@/hooks/client/redux'
import React from 'react'
import { openModal } from '@/redux/reducers/modalSlice'

export default function PaymentButton() {
    const dispatch = useAppDispatch()

    return (
        <button className={'w-full bg-blue rounded-full p-3 text-white'} onClick={() => dispatch(openModal({modalType: 'paymentMethod'}))}>
            Оплатить
        </button>
    )
}