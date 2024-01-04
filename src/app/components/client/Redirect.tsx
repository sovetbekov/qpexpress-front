'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Props = {
    location: string,
}

export default function Redirect({location}: Props) {
    const router = useRouter()

    useEffect(() => {
        router.push(location)
    }, [location, router])

    return null
}