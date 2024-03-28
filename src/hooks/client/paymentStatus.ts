import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { getJetpayPaymentStatus, getQRPaymentStatus } from '@/services/payment'
import { Errors } from '@/types'

export function usePaymentStatus(deliveryId: string, setError?: Dispatch<SetStateAction<Errors | undefined>>) {
    const [isPaid, setIsPaid] = useState(false)
    const [isKaspiLoading, setIsKaspiLoading] = useState(true)
    const [isJetpayLoading, setIsJetpayLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        const fetchKaspiStatus = async () => {
            const response = await getQRPaymentStatus({deliveryId})
            setIsKaspiLoading(false)
            if (response.status === 'error') {
                setError?.(response.error)
            } else if (response.status === 'success') {
                if (response.data === 'Processed') {
                    setIsPaid(true)
                }
                else if (response.data === 'Error')
                    setError?.({payment: ['Произошла ошибка при оплате']})
            }
        }
        const fetchJetpayStatus = async () => {
            const response = await getJetpayPaymentStatus({deliveryId})
            setIsJetpayLoading(false)
            if (response.status === 'error') {
                setError?.(response.error)
            } else if (response.status === 'success') {
                if (response.data === 'Processed') {
                    setIsPaid(true)
                }
                else if (response.data === 'Error')
                    setError?.({payment: ['Произошла ошибка при оплате']})
            }
        }
        const kaspiInterval = setInterval(fetchKaspiStatus, 1000)
        const jetpayInterval = setInterval(fetchJetpayStatus, 1000)
        if (!isKaspiLoading && !isJetpayLoading) {
            setIsLoading(false)
        }
        if (isPaid) {
            clearInterval(kaspiInterval)
            clearInterval(jetpayInterval)
        }
        return () => {
            clearInterval(kaspiInterval)
            clearInterval(jetpayInterval)
        }
    }, [deliveryId, isJetpayLoading, isKaspiLoading, isPaid, setError])
    return {
        isPaid,
        isLoading
    }
}