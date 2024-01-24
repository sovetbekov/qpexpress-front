import React from 'react'
import Image from 'next/image'
import { useTranslation } from '@/app/i18n'

type Props = {
    language: string,
}

export default async function HowItWorks({language}: Readonly<Props>) {
    const {t} = await useTranslation(language, 'how_it_works')
    return (
        <div className={'w-full flex flex-col gap-y-5 px-5 md:gap-y-[3.75rem] md:p-20'} id={'how_it_works'}>
            <h2 className={'text-[1.5rem] md:text-[3rem]'}>{t('title')}</h2>
            <div className={'flex flex-col gap-y-5 md:flex-row md:justify-between md:items-center md:gap-x-10 w-full'}>
                <div className={'relative p-5 overflow-hidden w-full h-[100vw] md:h-[33vw] md:w-[33vw] bg-gray md:leading-8 flex flex-col justify-between md:p-10 rounded-3xl md:break-words'}>
                    <Image src={'/assets/first_step.svg'} alt={'first_step.svg'} fill/>
                    <h3>01</h3>
                    <p className={'text-xl w-2/3'}>
                        {t('first_step')}
                    </p>
                </div>
                <div className={'relative p-5 overflow-hidden w-full h-[100vw] md:h-[33vw] md:w-[33vw] bg-gray md:leading-8 flex flex-col justify-between md:p-10 rounded-3xl md:break-words'}>
                    <Image src={'/assets/second_step.svg'} alt={'second_step.svg'} fill/>
                    <h3>02</h3>
                    <p className={'text-xl w-2/3 whitespace-pre-line'}>
                        {t('second_step')}
                    </p>
                </div>
                <div className={'relative p-5 overflow-hidden w-full h-[100vw] md:h-[33vw] md:w-[33vw] bg-gray md:leading-8 flex flex-col justify-between md:p-10 rounded-3xl md:break-words'}>
                    <Image src={'/assets/third_step.svg'} alt={'third_step.svg'} fill/>
                    <h3>03</h3>
                    <p className={'text-xl w-2/3'}>
                        {t('third_step')}
                    </p>
                </div>
            </div>
        </div>
    )
}