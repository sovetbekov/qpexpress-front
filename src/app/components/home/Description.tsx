import React from 'react'
import Image from 'next/image'
import { useTranslation } from '@/app/i18n'
import localFont from 'next/font/local'
import clsx from 'clsx'

type Props = {
    language: string,
}

const arialBlack = localFont({
    src: '../../fonts/ariblkKZ.ttf',
    variable: '--font-ariblk'
})

export default async function Description({language}: Readonly<Props>) {
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
                <h1 className={clsx('text-[2rem] leading-[2.6rem] md:text-[3.5rem] md:text-black md:w-[56.875rem] md:leading-[4rem] md:text-center md:break-words md:mb-5', arialBlack.className)}>
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