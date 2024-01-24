'use client'

import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function PageComponent() {
    const router = useRouter()
    const onBackClick = () => {
        router.back()
    }

    return (
        <div className={'hidden md:flex md:flex-row md:align-middle md:gap-x-4 md:mb-20'}>
            <button onClick={onBackClick}>
                <Image src={'/assets/back_arrow.svg'} alt={'back_arrow.svg'} width={24} height={24}/>
            </button>
            <p className={'md:text-4xl md:font-bold'}>
                Данные о посылке
            </p>
        </div>
    )
}