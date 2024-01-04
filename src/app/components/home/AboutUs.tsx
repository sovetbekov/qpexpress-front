import React from 'react'
import Image from 'next/image'
import { useTranslation } from '@/app/i18n'

type Props = {
    language: string,
}

export default async function AboutUs({language}: Props) {
    const {t} = await useTranslation(language, 'about_us')
    return (
        <div className={'flex flex-col w-full px-5 md:p-20 md:gap-10'} id={'about_us'}>
            <h2 className={'text-[1.5rem] md:text-[3rem]'}>
                {t('title')}
            </h2>
            <div className={'flex flex-col md:flex-row md:justify-between md:col-gap-10 w-full'}>
                <div className={'md:text-black md:leading-8 md:text-left md:w-1/3'}>
                    <p className={'text-base whitespace-pre-line'}>
                        {t('description')}
                        <br/><br/>
                        {t('mission')}
                    </p>
                </div>
                <div className={'relative w-full h-[15rem] md:h-[25rem] order-first md:order-last'}>
                    <Image src={'/assets/about_us.png'} alt={'about_us'} fill={true} placeholder={'empty'}
                           className={'object-contain'}/>
                </div>
            </div>
        </div>
    )
}