'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type MobilePageWrapperProps = {
    children: React.ReactNode,
}

export default function PageWrapper({children}: Readonly<MobilePageWrapperProps>) {
    const variants = {
        hidden: {
            y: 100,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
        },
        exit: {
            y: 100,
            opacity: 0,
        },
    }
    const router = useRouter()

    return (
        <motion.div variants={variants} initial={'hidden'} animate={'visible'} exit={'exit'}>
            <button onClick={() => router.back()} className={'p-5 md:hidden'}>
                <Image src={'/assets/arrow.svg'} alt={'back_arrow.svg'} width={24} height={24} className={'rotate-90'}/>
            </button>
            {children}
        </motion.div>
    )
}