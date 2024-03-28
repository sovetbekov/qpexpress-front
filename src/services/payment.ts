'use server'

import { makeRequest } from '@/services/utils'

type CreatePaymentRequest = {
    amount: number,
    deliveryId: string
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

type PaymentStatus = "Creating" | "QrTokenCreated" | "Wait" | "Processed" | "Error"

type LinkResponse = {
    uri: string
}

type KaspiLinkResponse = {
    statusCode: number,
    data: {
        token: string,
        expireDate: number,
        paymentId: string,
        paymentLink: string,
        paymentBehaviorOptions: {
            qrCodeScanWaitTimeout: number,
            paymentConfirmationTimeout: number,
            statusPollingInterval: number,
        }
    },
}

export async function createQr(data: CreatePaymentRequest) {
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

export async function createKaspiLink(data: CreatePaymentRequest) {
    return await makeRequest<KaspiLinkResponse>(`v1/payment/kaspi/create-link`, {
        requestOptions: {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    })
}

export async function getQRPaymentStatus(data: { deliveryId: string }) {
    return await makeRequest<PaymentStatus>(`v1/payment/kaspi/${data.deliveryId}/status`)
}

export async function getJetpayLink(data: CreatePaymentRequest) {
    return await makeRequest<LinkResponse>(`v1/payment/jetpay/payment-page`, {
        requestOptions: {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    })
}

export async function getJetpayPaymentStatus(data: {deliveryId: string}) {
    return await makeRequest<PaymentStatus>(`v1/payment/jetpay/${data.deliveryId}/status`)
}

export async function getPaymentStatus(data: {deliveryId: string}) {
    return await makeRequest<PaymentStatus>(`v1/payment/${data.deliveryId}/status`)
}