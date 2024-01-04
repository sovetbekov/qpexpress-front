'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import CreateOrderForm from '@/app/[language]/profile/orders/create/CreateOrderForm'
import PageWrapper from '@/app/[language]/profile/PageWrapper'

export default function Page() {
    const router = useRouter()
    const onBackClick = () => {
        router.back()
    }

    return (
        <PageWrapper>
            <div className={'md:p-20'}>
                <div className={'hidden md:flex md:flex-row md:align-middle md:gap-x-4 md:mb-20'}>
                    <button onClick={onBackClick}>
                        <Image src={'/assets/back_arrow.svg'} alt={'back_arrow.svg'} width={24} height={24}/>
                    </button>
                    <p className={'md:text-4xl md:font-bold'}>
                        Добавить заказ
                    </p>
                </div>
                <div>
                    <CreateOrderForm/>
                </div>
            </div>
        </PageWrapper>
    )
}