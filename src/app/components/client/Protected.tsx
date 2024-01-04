'use client'

import React from 'react'
import useAuthorization from '@/hooks/client/auth'
import Redirect from '@/app/components/client/Redirect'

type Props = {
    children: React.ReactNode
    role?: string
}

export default function Protected({children, role}: Readonly<Props>) {
    const auth = useAuthorization()
    if (role && auth.status === 'authenticated' && !auth.roles?.includes(role)) {
        return <Redirect location={'/'}/>
    }
    if (auth.status === 'unauthenticated') {
        return <Redirect location={'/'}/>
    }
    if (auth.status === 'loading') {
        return (
            <>
                {children}
            </>
        )
    }
    if (auth.status === 'authenticated') {
        return (
            <>
                {children}
            </>
        )
    }
}