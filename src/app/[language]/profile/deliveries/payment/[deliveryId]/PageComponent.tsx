'use client'

import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/app/i18n/client'

type Props = {
    language: string
}

export default function PageComponent({language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'delivery')
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
                {t('delivery_information')}
            </p>
        </div>
    )
}