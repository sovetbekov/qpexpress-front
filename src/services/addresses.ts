'use server'

import { AddressData } from '@/types/entities'
import { makeRequest } from '@/services/utils'

export async function getAddresses(language: string) {
    return await makeRequest<AddressData[]>(`v1/addresses/${language}`)
}