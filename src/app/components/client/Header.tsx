'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthenticationActions } from '@/hooks/client/useAuthenticationActions'
import { useTranslation } from '@/app/i18n/client'
import LeaveContacts from '../home/LeaveContacts'

type Props = {
    language: string
}

export default function Header({language}: Readonly<Props>) {
    const {auth, onLoginClick, onSignUpClick, onSignOutClick} = useAuthenticationActions(language)
    const [isOpen, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!isOpen);
    };
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
                auth?.status === 'authenticated' && auth?.roles?.includes('admin:read') &&
                <>
                    <Link href={'/admin'}
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
            {
                auth?.status === 'authenticated' && !auth?.roles?.includes('admin:read') &&
                <>
                    <button
                        onClick={toggle}
                        className="md:cursor-pointer md:text-white md:px-5 md:py-3 md:rounded-full md:border-none md:bg-none md:flex md:flex-row md:gap-x-5 md:items-center"
                    >
                        <Image src="/assets/call_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="phone" width={24} height={24} />
                        {t('call_us')}
                    </button>

                    {isOpen && (
                        <>
                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80 z-50">
                                <h2 className="text-lg font-semibold">Связаться с нами!</h2>
                                <p className="text-gray-700 text-base mb-4">Выйдем на связь как можно скорее.</p>
                                <div>
                                    <LeaveContacts language={''} />
                                </div>
                                <button
                                    onClick={toggle}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                >
                                    &times;
                                </button>
                            </div>

                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                                onClick={toggle}
                            ></div>
                        </>
                    )}
                </>

            }
            {
                auth?.status === 'authenticated' && !auth?.roles?.includes('admin:read') &&
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