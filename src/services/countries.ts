import { makeRequest } from '@/services/utils'
import { CountryData } from '@/types/entities'

export async function getCountries() {
    return await makeRequest<CountryData[]>('v1/countries')
}