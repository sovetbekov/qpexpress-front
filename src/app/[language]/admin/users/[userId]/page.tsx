import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import UserReviewForm from '@/app/[language]/admin/users/[userId]/UserReviewForm'
import { getUser } from '@/services/account'
import { isError } from '@/app/lib/utils'

type Props = {
    params: {
        userId: string
        language: string
    }
}

export const dynamic = 'force-dynamic'

export default async function Page({params: {userId, language}}: Readonly<Props>) {
    const userDataResponse = await getUser(userId)
    if (isError(userDataResponse)) {
        return <div>Ошибка</div>
    }
    const userData = userDataResponse.data
    return (
        <div className={'md:p-20'}>
            <div className={'hidden md:flex md:flex-row md:align-center md:gap-x-4 mb-10'}>
                <Link href={'.'} className={'flex justify-center'}>
                    <Image src={'/assets/back_arrow.svg'} alt={'back_arrow.svg'} width={24} height={24}/>
                </Link>
                <p className={'md:text-4xl md:font-bold'}>
                    {userData.user.firstName} {userData.user.lastName}
                </p>
            </div>
            <div>
                <UserReviewForm data={userData} language={language}/>
            </div>
        </div>
    )
}