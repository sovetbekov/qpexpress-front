'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthenticationActions } from '@/hooks/client/useAuthenticationActions'
import { useTranslation } from '@/app/i18n/client'

type Props = {
    language: string
}

export default function Header({language}: Props) {
    const {auth, onLoginClick, onSignUpClick, onSignOutClick} = useAuthenticationActions()
    const {t} = useTranslation(language, 'header')

    return (
        <div className={'hidden md:block md:w-full md:flex md:flex-row md:justify-end md:items-center md:bg-black md:gap-12 md:px-20 md:py-4'}>
            {
                auth?.status === 'loading' &&
                <div className={'md:flex md:flex-row md:gap-10 md:animate-pulse md:py-[1.13rem]'}>
                    <div className={'md:h-3 md:bg-dark-gray md:rounded md:col-span-2 md:w-28'}></div>
                    <div className={'md:h-3 md:bg-dark-gray md:rounded md:col-span-2 md:w-28'}></div>
                </div>
            }
            {
                auth?.status === 'unauthenticated' &&
                <>
                    <button className={'md:cursor-pointer md:text-white md:px-5 md:py-3 md:rounded-full md:border-none md:bg-none'}
                            onClick={onLoginClick}>
                        <span className={'md:text-base md:font-normal'}>{t('login')}</span>
                    </button>
                    <button
                        className={'md:cursor-pointer md:text-white md:bg-blue md:px-5 md:py-3 md:rounded-full md:border-none md:hover:text-black'}
                        onClick={onSignUpClick}>
                        <span className={'md:text-base md:font-normal'}>{t('register')}</span>
                    </button>
                </>
            }
            {
                auth?.status === 'authenticated' &&
                <>
                    <Link href={'/profile'}
                          className={'md:cursor-pointer md:text-white md:px-5 md:py-3 md:rounded-full md:border-none md:bg-none md:flex md:flex-row md:gap-x-5 md:items-center'}>
                        <Image src={'/assets/user-circle-white.svg'} alt={'user-avatar'} width={24} height={24}/>
                        <span className={'md:text-base md:font-normal'}>{auth.session.user.name}</span>
                    </Link>
                    <button className={'md:cursor-pointer md:text-white md:px-5 md:py-3 md:rounded-full md:border-0 md:bg-none'}
                            onClick={onSignOutClick}>
                        <span className={'md:text-base md:font-normal'}>{t('logout')}</span>
                    </button>
                </>
            }
        </div>
    )
}