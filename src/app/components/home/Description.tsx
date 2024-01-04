import React from 'react'
import Image from 'next/image'
import { useTranslation } from '@/app/i18n'

type Props = {
    language: string,
}

export default async function Description({language}: Props) {
    const {t} = await useTranslation(language, 'description')
    return (
        <div className={'flex flex-col w-full items-center px-5 md:gap-y-[3.75rem] md:px-20 md:py-4 md:mt-14'}>
            <div className={'relative w-full h-[25rem] object-cover object-center md:order-last row-span-6'}>
                <Image src={'/assets/description.svg'} alt={'description'} fill={true}
                       placeholder={'empty'} className={'hidden md:block'}/>
                <Image src={'/assets/description_mobile.svg'} alt={'description'} fill={true}
                       placeholder={'empty'} className={'block md:hidden'}/>
            </div>
            <div className={'flex flex-col items-center'}>
                <h1 className={'text-[2.5rem] leading-[2.6rem] md:text-[4.5rem] md:text-black md:w-[56.875rem] md:leading-[4.95rem] md:text-center md:break-words font-black md:mb-5'}>
                    {t('title')}
                </h1>
                <br className={'md:h-30'}/>
                <p className={'text-[1rem] w-full md:text-center md:text-[1.25rem]'}>
                    {t('information')}
                </p>
            </div>
        </div>
    )
}