import { makeRequest } from '@/services/utils'
import { CurrencyData } from '@/types/entities'

export async function getCurrencies() {
    return await makeRequest<CurrencyData[]>('v1/currencies')
}

export async function convertCurrency(amount: number, from: string, to: string) {
    return await makeRequest<number>(`v1/currencies/convert?amount=${amount}&from=${from}&to=${to}`)
}