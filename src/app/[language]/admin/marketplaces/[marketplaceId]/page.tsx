'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AdminMarketplaceForm from '@/app/components/client/MarketplaceForm/AdminMarketplaceForm'
import { isError } from '@/app/lib/utils'
import { MarketplaceDataOverview } from '@/types'
import { getMarketplaceById } from '@/services/marketplaces'

export const dynamic = 'force-dynamic'

type Props = {
    params: {
        marketplaceId: string
        language: string
    }
}

export default function Page({params: {language, marketplaceId}}: Readonly<Props>) {
    const [marketplace, setMarketplace] = useState<MarketplaceDataOverview>()
    useEffect(() => {
        getMarketplaceById(marketplaceId).then(response => {
            if (!isError(response)) {
                setMarketplace(response.data)
            }
        })
    }, [marketplaceId])

    if (!marketplace) {
        return <div>Loading...</div>
    }

    return (
        <div className={'md:p-20'}>
            <div className={'hidden md:flex md:flex-row md:align-center md:justify-between mb-10'}>
                <div className={'md:flex md:flex-row md:align-center md:gap-x-4'}>
                    <Link href={'.'} className={'flex justify-center'}>
                        <Image src={'/assets/back_arrow.svg'} alt={'back_arrow.svg'} width={24} height={24}/>
                    </Link>
                    <p className={'md:text-4xl md:font-bold'}>
                        {marketplace.id}
                    </p>
                </div>
            </div>
            <AdminMarketplaceForm isUpdate={true} language={language} data={marketplace}/>
        </div>
    )
}