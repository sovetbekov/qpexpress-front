import { makeRequest } from '@/services/utils'
import { CurrencyData } from '@/types/entities'

export async function getCurrencies() {
    return await makeRequest<CurrencyData[]>('v1/currencies')
}