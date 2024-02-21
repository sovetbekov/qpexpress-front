import React from 'react'

type Props = {
    children: React.ReactNode
}

export default function ModalBody({children}: Readonly<Props>) {
    return (
        <div className="p-3">
            {children}
        </div>
    )
}