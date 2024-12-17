import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getRecipients } from '@/services/account'
import { isError } from '@/app/lib/utils'
import { RecipientOverview } from '@/types/entities'
import RecipientReviewForm from './RecipientReviewForm'

type Props = {
    params: {
        recipientId: string
        language: string
    }
}

export const dynamic = 'force-dynamic'

export default async function Page({ params: { recipientId, language } }: Readonly<Props>) {
    const recipientsResponse = await getRecipients()
    if (isError(recipientsResponse)) {
        return <div>Ошибка</div>
    }

    const recipients = recipientsResponse.data

    const recipientData = recipients.find(
        (recipient: RecipientOverview) => recipient.id === recipientId
    )

    if (!recipientData) {
        return <div>Получатель не найден</div>
    }

    return (
        <div className={'md:p-20'}>
            <div className={'hidden md:flex md:flex-row md:align-center md:gap-x-4 mb-10'}>
                <Link href={'.'} className={'flex justify-center'}>
                    <Image src={'/assets/back_arrow.svg'} alt={'back_arrow.svg'} width={24} height={24} />
                </Link>
                <p className={'md:text-4xl md:font-bold'}>
                    {recipientData.firstName} {recipientData.lastName}
                </p>
            </div>
            <div>
                <RecipientReviewForm data={recipientData} language={language} />
            </div>
        </div>
    )
}
