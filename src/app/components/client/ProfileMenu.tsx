'use client'

import React from 'react'
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";

type MenuLinkProps = {
    pathname: string,
    link: string,
    title: string,
}

function MenuLink({pathname, link, title}: Readonly<MenuLinkProps>) {
    return (
        <li className={'border-b-black px-5 py-2 md:border-b-light-gray border-b border-solid md:last:border-b-0'}>
            <Link href={link}
                  className={clsx('flex flex-row justify-between md:block md:no-underline md:text-black md:px-10 md:py-5 md:hover:rounded-3xl', {
                      ['md:text-light-gray']: pathname === link,
                  })}>
                {title}
                <Image src={'/assets/arrow.svg'} alt={'arrow'} width={10} height={10} className={'ml-5 -rotate-90 md:hidden'}/>
            </Link>
        </li>
    )
}

export default function ProfileMenu() {

}