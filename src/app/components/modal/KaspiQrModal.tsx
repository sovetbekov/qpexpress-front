'use client'

import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { createQr, getQRPaymentStatus } from '@/services/payment'
import { Errors } from '@/types'

type Props = {
    price: number
    deliveryId: string
}

export default function KaspiQrModal({price, deliveryId}: Readonly<Props>) {
    const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)
    const [qrCode, setQrCode] = useState('')
    const [payed, setPayed] = useState(false)
    const [isPayedLoading, setIsPayedLoading] = useState(true)
    const [error, setError] = useState<Errors>()

    useEffect(() => {
        const fetchData = async () => {
            const response = await createQr({amount: price, deliveryId})
            if (response.status === 'error') {
                setError(response.error)
            } else if (response.status === 'success') {
                setQrCode(response.data.data.token)
            }
        }
        if (!price) return
        fetchData().catch(console.error)
    }, [deliveryId, price])

    useEffect(() => {
        if (canvasRef && qrCode.length > 0) {
            QRCode.toCanvas(canvasRef, qrCode, {scale: 10}, function (error) {
                if (error) console.error(error)
            })
        }
    }, [canvasRef, price, qrCode])

    useEffect(() => {
        const fetchStatus = async () => {
            const response = await getQRPaymentStatus({deliveryId})
            setIsPayedLoading(false)
            if (response.status === 'error') {
                setError(response.error)
            } else if (response.status === 'success') {
                if (response.data === 'Processed') {
                    setPayed(true)
                }
                else if (response.data === 'Error')
                    setError({payment: ['Произошла ошибка при оплате']})
            }
        }
        const interval = setInterval(fetchStatus, 1000)
        if (payed) clearInterval(interval)
        return () => clearInterval(interval)
    }, [deliveryId, payed])

    return (
        <div className={'p-20'}>
            {
                isPayedLoading && (
                    <div className={'text-center text-2xl font-bold'}>
                        Пожалуйста, подождите
                    </div>
                )
            }
            {
                !isPayedLoading && payed && (
                    <div className={'text-center text-2xl font-bold'}>
                        Оплата прошла успешно
                    </div>
                )
            }
            {
                !isPayedLoading && !payed && (
                    <>
                        <div className="text-center text-2xl font-bold">
                            {price} тенге
                        </div>
                        <div className="flex justify-center">
                            <canvas ref={ref => setCanvasRef(ref)}/>
                        </div>
                        <div className="text-center text-sm">
                            Пожалуйста, отсканируйте QR-код
                        </div>
                    </>
                )
            }
        </div>
    )
}
