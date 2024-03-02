'use client'

import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { createQr } from '@/services/payment'
import { Errors } from '@/types'

type Props = {
    price: number
}

export default function KaspiQrModal({price}: Readonly<Props>) {
    const canvasRef = useRef(null);
    const [qrCode, setQrCode] = useState('')
    const [error, setError] = useState<Errors>()

    useEffect(() => {
        if (!price) return
        createQr({amount: price}).then((data) => {
            if (data.status === 'error') {
                setError(data.error)
            } else if (data.status === 'success') {
                setQrCode(data.data.data.token)
            }
        })
    }, [price])

    useEffect(() => {
        if (canvasRef.current && qrCode.length > 0) {
            QRCode.toCanvas(canvasRef.current, qrCode, {scale: 10}, function (error) {
                if (error) console.error(error);
            })
        }
    }, [price, qrCode]);

    return (
        <div className={'p-20'}>
            <div className="text-center text-2xl font-bold">
                {price}
            </div>
            <div className="flex justify-center">
                <canvas ref={canvasRef}/>
            </div>
            <div className="text-center text-sm">
                Пожалуйста, отсканируйте QR-код
            </div>
        </div>
    )
}
