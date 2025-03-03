'use client'

import React from 'react'
import Link from "next/link"
import clsx from "clsx"
import Image from "next/image"
import { useTranslation } from "@/app/i18n/client"
import { usePathname } from "next/navigation"
import Protected from "@/app/components/client/Protected"

type Props = {
    children: React.ReactNode
    params: { language: string }
}

type MenuLinkProps = {
    pathname: string
    link: string
    title: string
}

const MenuLink = ({ pathname, link, title }: MenuLinkProps) => (
    <li className="border-b-black px-5 py-2 md:border-b-light-gray border-b border-solid md:last:border-b-0">
        <Link
            href={link}
            className={clsx(
                "flex flex-row justify-between md:block md:no-underline md:text-black md:px-10 md:py-5 md:hover:rounded-3xl",
                { "md:text-light-gray": pathname === link }
            )}
        >
            {title}
            <Image
                src="/assets/arrow.svg"
                alt="arrow"
                width={10}
                height={10}
                className="ml-5 -rotate-90 md:hidden"
            />
        </Link>
    </li>
)

export default function Layout({ children, params: { language } }: Readonly<Props>) {
    const { t } = useTranslation(language, "admin")
    const pathname = usePathname()

    const menuLinks = [
        { link: `/${language}/admin/users`, title: t("users") },
        { link: `/${language}/admin/orders`, title: t("orders") },
        { link: `/${language}/admin/deliveries`, title: t("deliveries") },
        { link: `/${language}/admin/marketplaces`, title: t("marketplaces") },
        { link: `/${language}/admin/shipments`, title: t("shipments") },
    ]

    const showMenu = /^\/(ru|en|zh|kz)\/admin(\/(users|orders|deliveries|marketplaces|shipments))?$/.test(pathname)

    return (
        <Protected role="admin:read">
            <div className="hidden md:block">
                {showMenu ? (
                    <div className="md:grid md:grid-cols-[25rem_1fr] md:grid-rows-[1fr] md:gap-10 md:w-full md:p-20">
                        <h2 className="text-2xl px-5 pt-8 pb-5 md:hidden">Личный кабинет</h2>
                        <nav className="md:bg-gray md:h-fit md:rounded-3xl">
                            <ul>
                                {menuLinks.map(({ link, title }) => (
                                    <MenuLink key={link} pathname={pathname} link={link} title={title} />
                                ))}
                            </ul>
                        </nav>
                        {children}
                    </div>
                ) : (
                    <>{children}</>
                )}
            </div>
        </Protected>
    )
}
