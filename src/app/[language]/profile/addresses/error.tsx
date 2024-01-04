'use client'

import React from 'react'

type Props = {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({error, reset}: Props) {
    return (
        <div>
            <p>{error.message}</p>
            <button onClick={reset}>Try again</button>
        </div>
    )
}