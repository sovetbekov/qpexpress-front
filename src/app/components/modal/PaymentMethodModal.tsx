'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hooks/client/redux'
import { openModal } from '@/redux/reducers/modalSlice'
import Image from 'next/image'
import {
    createKaspiLink,
    getJetpayLink,
} from '@/services/payment'
import { Errors } from '@/types'

type Props = {
    price: number
    deliveryId: string
}

export default function PaymentMethodModal({price, deliveryId}: Readonly<Props>) {
    const dispatch = useAppDispatch()
    const [error, setError] = useState<Errors>()
    const [jetpayLink, setJetpayLink] = useState<string | null>(null)

    useEffect(() => {
        getJetpayLink({amount: price, deliveryId}).then(link => {
                if (link.status === 'error') {
                    console.error(link.error)
                    return
                }
                setJetpayLink(link.data.uri)
            },
        )
    }, [deliveryId, price])

    const onKaspiClick = () => {
        dispatch(openModal({modalType: 'kaspiQr', data: {price, deliveryId}}))
    }

    const onMobileKaspiClick = async () => {
        const linkResponse = await createKaspiLink({amount: price, deliveryId})
        if (linkResponse.status === 'error') {
            console.error(linkResponse.error)
            return
        }
        window.location.href = linkResponse.data.data.paymentLink
    }

    const onJetpayClick = () => {
        if (jetpayLink) {
            window.open(jetpayLink, '_blank', 'width=1200,height=1200,menubar=no,toolbar=no,location=no,status=no')
        }
    }

    return (
        <div className={'flex flex-col gap-y-5 py-16 px-10 items-center'}>
            <p className={'text-2xl'}>Способ оплаты</p>
            <button
                className={'md:flex hidden bg-[#F14635] w-full h-16 px-20 rounded-full flex-row justify-center items-center gap-x-5'}
                onClick={onKaspiClick}>
                <Image src={'/assets/kaspi_logo.svg'} alt={'kaspi_logo'} width={112} height={50}/>
                <div className={'md:bg-white md:border md:border-white md:h-8'}></div>
                <Image src={'/assets/kaspi_gold.svg'} alt={'kaspi_gold'} width={36} height={28}/>
            </button>
            <button
                className={'md:hidden bg-[#F14635] w-full h-16 px-20 rounded-full flex flex-row justify-center items-center gap-x-5'}
                onClick={onMobileKaspiClick}>
                <Image src={'/assets/kaspi_logo.svg'} alt={'kaspi_logo'} width={112} height={50}/>
                <div className={'md:bg-white md:border md:border-white md:h-8'}></div>
                <Image src={'/assets/kaspi_gold.svg'} alt={'kaspi_gold'} width={36} height={28}/>
            </button>
            {
                jetpayLink &&
                <button
                    className={'bg-blue w-full h-16 rounded-full flex flex-row justify-center items-center gap-x-4'}
                    onClick={onJetpayClick}>
                    <p className={'text-base text-white text-nowrap'}>Платежная карта</p>
                    <div className={'flex flex-row gap-x-2'}>
                        <Image src={'/assets/visa.svg'} alt={'visa'} width={36} height={28}/>
                        <Image src={'/assets/mastercard.svg'} alt={'mastercard'} width={36} height={28}/>
                    </div>
                </button>
            }
        </div>
    )
}