'use client'

import React from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import clsx from 'clsx'
import Protected from '@/app/components/client/Protected'
import Image from 'next/image'
import {useTranslation} from '@/app/i18n/client'

type Props = {
    children: React.ReactNode,
    params: {
        language: string,
    }
}

type MenuLinkProps = {
    pathname: string,
    link: string,
    title: string,
}

const MenuLink = ({pathname, link, title}: MenuLinkProps) => {
    return (
        <li className={'border-b-black px-5 py-2 md:border-b-light-gray border-b border-solid md:last:border-b-0'}>
            <Link href={link}
                  className={clsx('flex flex-row justify-between md:block md:no-underline md:text-black md:px-10 md:py-5 md:hover:rounded-3xl', {
                      ['md:text-light-gray']: pathname === link,
                  })}>
                {title}
                <Image src={'/assets/arrow.svg'} alt={'arrow'} width={10} height={10}
                       className={'ml-5 -rotate-90 md:hidden'}/>
            </Link>
        </li>
    )
}

export default function Layout({children, params: {language}}: Readonly<Props>) {
    const {t} = useTranslation(language, 'profile')
    const pathname = usePathname()
    const showMenu = !!pathname && (/\/(ru|en|zh)\/profile\/(edit|addresses|orders|deliveries)$/.exec(pathname) || /\/(ru|en|zh)\/profile$/.exec(pathname))
    const showMobileMenu = !!pathname && /\/(ru|en|zh)\/profile$/.exec(pathname)
    const menuLinks = [
        {
            link: `/${language}/profile/edit`,
            title: t('profile'),
        },
        {
            link: `/${language}/profile/addresses`,
            title: t('addresses'),
        },
        {
            link: `/${language}/profile/orders`,
            title: t('orders'),
        },
        {
            link: `/${language}/profile/deliveries`,
            title: t('deliveries'),
        },
    ]

    return (
        <Protected>
            <div className={'hidden md:block'}>
                {
                    showMenu && pathname &&
                    <div className={'md:grid md:grid-cols-[25rem_1fr] md:grid-rows-[1fr] md:gap-10 md:w-full md:p-20'}
                         key={pathname}>
                        <h2 className={'text-2xl px-5 pt-8 pb-5 md:hidden'}>Личный кабинет</h2>
                        <nav className={'md:bg-gray md:h-fit md:rounded-3xl'}>
                            <ul>
                                {menuLinks.map((value, index) => <MenuLink key={index}
                                                                           pathname={pathname} {...value}/>)}
                            </ul>
                        </nav>
                        {children}
                    </div>
                }
            </div>
            <div className={'md:hidden'}>
                {
                    showMobileMenu && pathname &&
                    <div className={'md:grid md:grid-cols-[25rem_1fr] md:grid-rows-[1fr] md:gap-10 md:w-full md:p-20'}
                         key={pathname}>
                        <h2 className={'text-2xl px-5 pt-8 pb-5 md:hidden'}>Личный кабинет</h2>
                        <nav className={'md:bg-gray md:h-fit md:rounded-3xl'}>
                            <ul>
                                {menuLinks.map((value, index) => <MenuLink key={index}
                                                                           pathname={pathname} {...value}/>)}
                            </ul>
                        </nav>
                    </div>
                }
                {children}
            </div>
            {
                !showMenu && !showMobileMenu &&
                <div className={'hidden md:block'}>
                    {children}
                </div>
            }
        </Protected>
    )
}