'use server'

import { makeRequest } from '@/services/utils'

type CreateQrRequest = {
    amount: number,
}

type CreateQrResponse = {
    statusCode: number,
    data: {
        token: string,
        expireDate: number,
        paymentId: string,
        paymentBehaviorOptions: {
            qrCodeScanWaitTimeout: number,
            paymentConfirmationTimeout: number,
            statusPollingInterval: number,
        }
    },
}

export async function createQr(data: CreateQrRequest) {
    return await makeRequest<CreateQrResponse>(`v1/payment/kaspi/create-qr`, {
        requestOptions: {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        },
    })
}