'use client'

import React, { useState } from 'react'
import { denyRecipient } from '@/services/account'
import { useAppDispatch } from '@/hooks/client/redux'
import { closeModal, openModal } from '@/redux/reducers/modalSlice'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Props = {
    price: number
}

export default function PaymentMethodModal({price}: Readonly<Props>) {
    const dispatch = useAppDispatch()

    const onKaspiClick = () => {
        console.log(price)
        dispatch(openModal({modalType: 'kaspiQr', data: {price}}))
    }

    return (
        <div className={'md:flex md:flex-col md:gap-y-5 md:py-16 md:px-10 md:items-center'}>
            <p className={'md:text-2xl'}>Способ оплаты</p>
            <button
                className={'md:bg-[#F14635] md:w-full md:h-16 md:px-20 md:rounded-full md:flex md:flex-row md:justify-center md:items-center md:gap-x-5'}
                onClick={onKaspiClick}
            >
                <Image src={'/assets/kaspi_logo.svg'} alt={'kaspi_logo'} width={112} height={50}/>
                <div className={'md:bg-white md:border md:border-white md:h-8'}></div>
                <Image src={'/assets/kaspi_gold.svg'} alt={'kaspi_gold'} width={36} height={28}/>
            </button>
            <button
                className={'md:bg-blue md:w-full md:h-16 md:rounded-full md:flex md:flex-row md:justify-center md:items-center md:gap-x-4'}>
                <p className={'text-base text-white text-nowrap'}>Платежная карта</p>
                <div className={'flex flex-row gap-x-2'}>
                <Image src={'/assets/visa.svg'} alt={'visa'} width={36} height={28}/>
                <Image src={'/assets/mastercard.svg'} alt={'mastercard'} width={36} height={28}/>
                </div>
            </button>
        </div>
    )
}