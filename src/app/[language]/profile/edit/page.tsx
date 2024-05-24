import React from 'react'
import PageWrapper from '../PageWrapper'
import { getMyProfile, getMyRecipients } from '@/services/account'
import ProfileInfoForm from './ProfileInfoForm'
import RecipientInfoForm from '@/app/[language]/profile/edit/RecipientInfoForm'
import { isError } from '@/app/lib/utils'

type Props = {
    params: {
        language: string
    }
}

export const dynamic = 'force-dynamic'

export default async function Page({params: {language}}: Readonly<Props>) {
    const profilePromise = getMyProfile()
    const recipientsPromise = getMyRecipients()
    const [profileResponse, recipientsResponse] = await Promise.all([profilePromise, recipientsPromise])
    if (isError(profileResponse) || isError(recipientsResponse)) {
        return <div>Ошибка</div>
    }
    const profile = profileResponse.data
    const recipients = recipientsResponse.data

    return (
        <PageWrapper>
            <div className={'flex flex-col gap-y-4 md:gap-y-12 px-5'}>
                <ProfileInfoForm initialFormData={profile} language={language} />
                <RecipientInfoForm initialFormData={recipients} language={language} />
            </div>
        </PageWrapper>
    )
}