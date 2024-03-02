'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { animated } from '@react-spring/web'

type MobilePageWrapperProps = {
    children: React.ReactNode,
}

export default function PageWrapper({children}: Readonly<MobilePageWrapperProps>) {
    const router = useRouter()

    return (
        <animated.div>
            <button onClick={() => router.back()} className={'p-5 md:hidden'}>
                <Image src={'/assets/arrow.svg'} alt={'back_arrow.svg'} width={24} height={24} className={'rotate-90'}/>
            </button>
            {children}
        </animated.div>
    )
}