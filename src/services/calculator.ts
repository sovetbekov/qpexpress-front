'use server'

import { makeRequest } from '@/services/utils'

export type CalculatorResponse = {
    countryId: string
    weight: number | null
    price: number | null
}

export type CalculatorRequest = {
    countryId: string
    weight: number | null
    price: number | null
}

export async function getCalculatorValues(data: CalculatorRequest) {
    return await makeRequest<CalculatorResponse>('v1/calculator/delivery-price', {
        requestOptions: {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            next: {
                tags: ['calculator-values'],
            },
        },
        authRequired: false,
    })
}