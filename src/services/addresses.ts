'use server'

import { AddressData } from '@/types/entities'
import { makeRequest } from '@/services/utils'

export async function getAddresses() {
    return await makeRequest<AddressData[]>('v1/addresses')
}