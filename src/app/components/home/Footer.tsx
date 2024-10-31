import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/app/i18n'

type Props = {
    language: string
}

export default async function Footer({language}: Readonly<Props>) {
    const {t} = await useTranslation(language, 'footer')
    return (
        <div className={'w-full flex flex-col gap-y-6 md:gap-y-12 bg-black text-white p-5 md:p-20'}>
            <div className={'flex flex-row justify-between'}>
                <div className={'flex flex-col gap-y-4'}>
                    <p className={'text-[0.9rem]'}>{t('phone_number')}: +7 (700) 088-80-90</p>
                    <p className={'text-[0.9rem]'}>{t('address')}</p>
                    <p className={'text-[0.9rem]'}>Email:&nbsp;<a
                        href={'mailto://qpexpresskz@gmail.com'}>qpexpresskz@gmail.com</a>
                    </p>
                </div>
                <div className={'flex flex-col gap-y-4'}>
                    <Link href={'/payment_info'} className={'text-[0.9rem]'}>
                        {t('payment_info')}
                    </Link>
                    <Link href={'/termsofservice'} className={'text-[0.9rem]'}>
                        {t('terms_of_service')}
                    </Link>
                    <Link href={'/requisites'} className={'text-[0.9rem]'}>
                        {t('requisites')}
                    </Link>
                </div>
                <div className={'flex items-end'}>
                    <div className={'flex flex-row gap-5 h-[40px] items-center'}>
                        <div>
                            <Image src={'/assets/visa.svg'} alt={'visa'} width={50} height={50}/>
                        </div>
                        <div>
                            <Image src={'/assets/mastercard.svg'} alt={'mastercard'} width={50} height={50}/>
                        </div>
                    </div>
                </div>
            </div>
            <hr className={'w-full border border-white hidden md:block'}/>
            <div className={'flex flex-col md:flex-row justify-between items-center gap-4 h-full'}>
                <p className={'text-[0.9rem] order-last md:order-first'}>2024 @ QP Express</p>
                <div className={'relative w-12 h-12'}>
                    <Link href={'https://instagram.com/qp_express'} target={'_blank'} className={'w-full h-full'}>
                        <Image src={'/assets/instagram.svg'} alt={'instagram'} fill/>
                    </Link>
                </div>
            </div>
        </div>
    )
}
