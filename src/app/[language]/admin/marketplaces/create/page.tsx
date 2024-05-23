'use client'

import React from 'react';
import PageWrapper from '@/app/[language]/profile/PageWrapper';
import Link from 'next/link';
import Image from 'next/image';
import AdminMarketplaceForm from '@/app/components/client/MarketplaceForm/AdminMarketplaceForm';
import { useTranslation } from '@/app/i18n'

export const dynamic = 'force-dynamic';

type Props = {
    params: {
        language: string
    }
}

export default async function Page({ params: { language } }: Readonly<Props>) {
    const {t} = await useTranslation(language, 'marketplace')

    return (
        <PageWrapper>
            <div className="md:p-20 flex flex-col">
                <div className="hidden md:flex md:flex-row md:align-center md:gap-x-4 mb-10">
                    <Link href={'.'} className="flex justify-center">
                        <Image src={'/assets/back_arrow.svg'} alt={'back_arrow.svg'} width={24} height={24} />
                    </Link>
                    <p className="md:text-4xl md:font-bold">
                        {t('add_marketplace')}
                    </p>
                </div>
                <div className="w-full ">
                    <AdminMarketplaceForm isUpdate={false} language={language} />
                </div>
            </div>
        </PageWrapper>
    );
}
