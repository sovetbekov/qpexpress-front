import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import React from 'react'
import Redirect from '@/app/components/client/Redirect'

type Props = {
    children: React.ReactNode
    roles?: string[]
    onUnauthorized?: () => void
}

export default async function Protected({children, roles, onUnauthorized}: Readonly<Props>) {
    const session = await getServerSession(authOptions)
    if (session === null) {
        onUnauthorized?.()
        return <Redirect location={'/'}/>
    }

    const userRoles = session?.roles
    console.log(roles)
    if ((userRoles === undefined && roles && roles?.length > 0) || (userRoles !== undefined && !roles?.some(r => userRoles.includes(r)))) {
        onUnauthorized?.()
        return <Redirect location={'/'}/>
    }

    return (
        <>
            {children}
        </>
    )
}