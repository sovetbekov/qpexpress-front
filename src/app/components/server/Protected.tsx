import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import React from 'react'
import Redirect from '@/app/components/client/Redirect'

type Props = {
    children: React.ReactNode
    onUnauthorized?: () => void
}

export default async function Protected({children, onUnauthorized}: Props) {
    const session = await getServerSession(authOptions)
    if (session === null) {
        onUnauthorized && onUnauthorized()
        return <Redirect location={'/'}/>
    }

    return (
        <>
            {children}
        </>
    )
}